import { EffectCallback, useEffect, useMemo, useRef } from 'react';

import { useCallbackConst } from '../use-callback-const';
import { useForceUpdate } from '../use-force-update';
import { useValueRef } from '../use-value-ref';

export type TimerHookStatus = 'idle' | 'running' | 'paused' | 'expired';

export interface TimerHook {
  /**
   * Starts the timer. If the timer is currently in a paused state, then it will
   * resume based on the original remaining length.
   */
  start: () => void;

  /**
   * Pauses the timer. This function has no effect if the timer has not yet
   * started ticking.
   */
  pause: () => void;

  /**
   * Resumes the timer. This function has no effect if the timer has not yet
   * started ticking.
   */
  resume: () => void;

  /**
   * Restarts the timer with new parameters.
   *
   * @param newLength - Optionally provide a new timer length (in milliseconds).
   * @param newTick - Optionally provide a new tick length (in milliseconds).
   */
  restart: (options?: RestartTimerOptions) => void;

  /**
   * A function returning the amount of time (in milliseconds) remaining in the
   * timer. If the timer is idle, this function returns `0`.
   */
  getRemaining: () => number;

  /**
   * A function returning the number of ticks that have accumulated since the
   * start of the currently-running timer.
   */
  getTickCount: () => number;

  /**
   * Returns a string enum indicating the current timer state
   * (one of: `"idle"`, `"running"`, `"paused"`, or `"expired"`).
   */
  getStatus: () => TimerHookStatus;

  /**
   * A static value that updates whenever the underlying timer state changes.
   * You can give this value to the dependency list `React.useEffect` to trigger
   * an effect.
   */
  key: number;
}

export interface RestartTimerOptions {
  length?: number;
  tick?: number;
}

export interface UseTimerOptions {
  length: number;
  tick?: number;
  autoStart?: boolean;
}

/**
 * Returns a timer that works inside the React lifecycle.
 *
 * @param length - The total length of the timer (in milliseconds).
 * @param tick - The interval at which to update the timer (in milliseconds).
 * @param autoStart - If `true`, the timer will immediately start ticking using
 * the initially-provided `length` and `tick` values.
 */
export function useTimer(options: UseTimerOptions): TimerHook {
  const { length, tick = 1000, autoStart = false } = options;

  const optionsRef = useValueRef({ length, tick });

  const currentStatus = useRef<TimerHookStatus>(autoStart ? 'running' : 'idle');
  const currentLength = useRef(autoStart ? length : 0);
  const currentTick = useRef(tick);
  const tickCount = useRef(0);

  const forceUpdate = useForceUpdate();

  const start = useCallbackConst(() => {
    if (currentStatus.current === 'idle' || currentStatus.current === 'expired') {
      currentLength.current = optionsRef.current.length || 0;
      currentTick.current = optionsRef.current.tick || 0;
      tickCount.current = 0;
      currentStatus.current = 'running';
      forceUpdate();
    }

    if (currentStatus.current === 'paused') {
      currentStatus.current = 'running';
      forceUpdate();
    }
  });

  const pause = useCallbackConst(() => {
    if (currentStatus.current === 'running') {
      currentStatus.current = 'paused';
      forceUpdate();
    }
  });

  const resume = useCallbackConst(() => {
    if (currentStatus.current === 'paused') {
      currentStatus.current = 'running';
      forceUpdate();
    }
  });

  const restart = useCallbackConst((newOptions: RestartTimerOptions = {}) => {
    currentLength.current = (newOptions.length ?? optionsRef.current.length) || 0;
    currentTick.current = (newOptions.tick ?? optionsRef.current.tick) || 0;
    tickCount.current = 0;
    currentStatus.current = 'running';
    forceUpdate();
  });

  // Update the timer.
  useEffect(() => {
    if (currentStatus.current === 'running' && currentLength.current > 0) {
      const interval = currentLength.current - currentTick.current < 0 ? currentLength.current : currentTick.current;

      const id = setTimeout(() => {
        currentLength.current -= interval;
        tickCount.current++;
        forceUpdate();
      }, interval);

      return () => clearTimeout(id);
    }

    if (currentStatus.current === 'running' && currentLength.current <= 0) {
      currentLength.current = 0;
      currentStatus.current = 'expired';
      forceUpdate();
    }

    return undefined;
  }, [forceUpdate.key]);

  return useMemo<TimerHook>(() => {
    return {
      start,
      pause,
      resume,
      restart,
      getRemaining: () => currentLength.current || 0,
      getTickCount: () => tickCount.current || 0,
      getStatus: () => currentStatus.current,
      key: forceUpdate.key,
    };
  }, [forceUpdate.key]);
}

/**
 * Execute an effect if the supplied timer ticks.
 *
 * @param timer - The `TimerHook` object from which to trigger the effect.
 * @param effect - Imperative function that can return a cleanup function.
 */
export function useTimerTick(timer: TimerHook, effect: EffectCallback) {
  useEffect(() => {
    if (timer.getTickCount() > 0) {
      return effect();
    }
    return undefined;
  }, [timer.getTickCount()]);
}

/**
 * Execute an effect if the supplied timer expires (completes its countdown).
 *
 * @param timer - The `TimerHook` object from which to trigger the effect.
 * @param effect - Imperative function that can return a cleanup function.
 */
export function useTimerExpire(timer: TimerHook, effect: EffectCallback) {
  useEffect(() => {
    if (timer.getStatus() === 'expired') {
      return effect();
    }
    return undefined;
  }, [timer.getStatus()]);
}
