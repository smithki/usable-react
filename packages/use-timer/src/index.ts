import { EffectCallback, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useCompare } from '@usable-react/use-compare';

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

  /**
   * A function returning the amount of time (in milliseconds) remaining in the
   * timer.
   */
  getRemaining: () => number;

  /**
   * A function returning the total expected length of the timer (in
   * milliseconds).
   */
  getLength: () => number;

  /**
   * A function returning `true` or `false` indicating whether the timer is
   * currently running.
   */
  isRunning: () => boolean;

  /**
   * References a static value that updates whenever the timer state changes.
   * You can give this value to the dependency list `React.useEffect` to trigger
   * an effect.
   */
  key: number;
}

/**
 * Returns a timer that works inside the React lifecycle.
 *
 * @param length - The total length of the timer (in milliseconds).
 * @param tick - The interval at which to update the timer (in milliseconds).
 */
export function useTimer(options: { length: number; tick?: number; autoStart?: boolean }): TimerHook {
  const { length, tick = 1000, autoStart = false } = options;

  const remaining = useRef(length);
  const isRunning = useRef(autoStart);
  const isStarted = useRef(autoStart);
  const lengthRef = useRef(length);
  const tickRef = useRef(tick);

  const [key, forceUpdate] = useReducer((x: number) => x + 1, 0) as [number, () => void];

  // Save the latest `tick` value.
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // Save the latest `length` value.
  useEffect(() => {
    lengthRef.current = length;
  }, [length]);

  // Build timer functionality callbacks.

  const start = useCallback(() => {
    if (!isRunning.current && !isStarted.current) {
      isRunning.current = true;
      isStarted.current = true;
      forceUpdate();
    }
  }, []);

  const pause = useCallback(() => {
    if (isRunning.current) {
      isRunning.current = false;
      forceUpdate();
    }
  }, []);

  const resume = useCallback(() => {
    if (!isRunning.current && isStarted.current) {
      isRunning.current = true;
      forceUpdate();
    }
  }, []);

  const reset = useCallback((newLength?: number, newTick?: number) => {
    if (newTick) tickRef.current = newTick;
    if (newLength) lengthRef.current = newLength;
    if (isRunning.current) isRunning.current = false;
    remaining.current = newLength || lengthRef.current;
    isStarted.current = false;
    forceUpdate();
  }, []);

  // Update the timer.
  useEffect(() => {
    if (isRunning.current && remaining.current > 0) {
      const id = setTimeout(() => {
        remaining.current -= tickRef.current;
        forceUpdate();
      }, tickRef.current);

      return () => clearTimeout(id);
    }

    if (isRunning.current && remaining.current === 0) {
      isRunning.current = false;
      forceUpdate();
    }

    if (isRunning.current && remaining.current < 0) {
      remaining.current = 0;
      isRunning.current = false;
      forceUpdate();
    }

    return undefined;
  }, [key]);

  return useMemo<TimerHook>(
    () => ({
      start,
      pause,
      resume,
      reset,
      getRemaining: () => remaining.current,
      getLength: () => lengthRef.current,
      isRunning: () => isRunning.current,
      key,
    }),
    [start, pause, resume, reset, key],
  );
}

/**
 * Execute an effect if the supplied timer ticks.
 *
 * @param timer - The `TimerHook` object to base effects from.
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - If present, effect will only activate if the values in the list change.
 */
export function useTimerEffect(timer: TimerHook, effect: EffectCallback, deps: readonly any[] = []) {
  const didTimerChange = useCompare(timer.getRemaining());
  const savedCallback = useRef(effect);

  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  useEffect(() => {
    if (timer.isRunning() && didTimerChange && timer.getRemaining() > 0) {
      return savedCallback.current();
    }

    return undefined;
  }, [timer.key, ...deps]);
}

/**
 * Execute an effect if the supplied timer completes.
 *
 * @param timer - The `TimerHook` object to base effects from.
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - If present, effect will only activate if the values in the list change.
 */
export function useTimerComplete(timer: TimerHook, effect: EffectCallback, deps: readonly any[] = []) {
  const didTimerChange = useCompare(timer.getRemaining());
  const savedCallback = useRef(effect);

  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  useEffect(() => {
    if (didTimerChange && timer.getRemaining() <= 0) {
      return savedCallback.current();
    }

    return undefined;
  }, [timer.key, ...deps]);
}
