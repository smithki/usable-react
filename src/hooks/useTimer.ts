import { EffectCallback, useCallback, useEffect, useRef, useState } from 'react';
import { useCompare } from './useCompare';

export interface TimerHook {
  /**
   * Starts the timer.
   */
  start: () => void;

  /**
   * Pauses the timer. This function has no effect if the timer has not yet
   * started.
   */
  pause: () => void;

  /**
   * Resumes the timer. This function has no effect if the timer has not yet
   * started.
   */
  resume: () => void;

  /**
   * Resets the timer.
   *
   * @param newLength - Optionally provide a new timer length (in milliseconds).
   * @param newTick - Optionally provide a new tick length (in milliseconds).
   */
  reset: (newLength?: number, newTick?: number) => void;

  /** The amount of time (in milliseconds) remaining in the timer. */
  remaining: number;

  /** The total expected length of the timer (in milliseconds). */
  length: number;

  /** A flag indicating whether the timer is currently running. */
  isRunning: boolean;
}

/**
 * Returns a timer that works inside the React lifecycle.
 *
 * @param length - The total length of the timer (in milliseconds).
 * @param tick - The interval at which to update the timer (in milliseconds).
 */
export function useTimer(length: number, tick: number = 1000): TimerHook {
  const [remaining, setRemaining] = useState(length);
  const [isRunning, setIsRunning] = useState(false);
  const [lengthState, setLengthState] = useState(length);
  const [tickState, setTickState] = useState(tick);
  const isStarted = useRef(false);

  const start = useCallback(() => {
    if (!isRunning && !isStarted.current) {
      setIsRunning(true);
      isStarted.current = true;
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && isStarted.current) setIsRunning(false);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (!isRunning && isStarted.current) setIsRunning(true);
  }, [isRunning]);

  const reset = useCallback(
    (newLength?: number, newTick?: number) => {
      if (newTick) setTickState(newTick);
      if (newLength) setLengthState(newLength);
      if (isRunning) setIsRunning(false);
      setRemaining(newLength || lengthState);
      isStarted.current = false;
    },
    [lengthState],
  );

  useEffect(() => {
    if (isRunning && remaining > 0) {
      const timeout = setTimeout(() => {
        setRemaining(remaining - tickState);
      }, tickState);

      return () => clearTimeout(timeout);
    }

    if (isRunning && remaining === 0) {
      setIsRunning(false);
    }

    if (isRunning && remaining < 0) {
      setRemaining(0);
      setIsRunning(false);
    }

    return;
  }, [remaining, isRunning, tickState]);

  return {
    start,
    pause,
    resume,
    reset,
    remaining,
    isRunning,
    length: lengthState,
  };
}

/**
 * Execute an effect if the supplied timer ticks.
 *
 * @param timer - The `TimerHook` object to base effects from.
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - If present, effect will only activate if the values in the list change.
 */
export function useTimerEffect(timer: TimerHook, effect: EffectCallback, deps: readonly any[] = []) {
  const { isRunning, remaining } = timer;
  const didTimerChange = useCompare(remaining);

  useEffect(() => {
    if (isRunning && didTimerChange && remaining > 0) {
      return effect();
    }
  }, [remaining, isRunning, ...deps]);
}

/**
 * Execute an effect if the supplied timer completes.
 *
 * @param timer - The `TimerHook` object to base effects from.
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - If present, effect will only activate if the values in the list change.
 */
export function useTimerComplete(timer: TimerHook, effect: EffectCallback, deps: readonly any[] = []) {
  const { remaining } = timer;
  const didTimerChange = useCompare(remaining);

  useEffect(() => {
    if (didTimerChange && remaining <= 0) {
      return effect();
    }
  }, [remaining, ...deps]);
}
