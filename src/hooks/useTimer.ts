import { EffectCallback, useCallback, useEffect, useRef, useState } from 'react';
import { useCompare } from './useCompare';

export interface TimerHook {
  /**
   * Starts the timer. It is recommended to invoke this function inside another
   * React hook or `useEffect` to avoid unpredictable behavior.
   */
  start: () => void;

  /**
   * Stops the timer. It is recommended to invoke this function inside another
   * React hook or `useEffect` to avoid unpredictable behavior.
   */
  stop: () => void;

  /**
   * Resets the timer. It is recommended to invoke this function inside another
   * React hook or `useEffect` to avoid unpredictable behavior.
   */
  reset: () => void;

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
  const isRunning = useRef(false);

  const start = useCallback(() => {
    isRunning.current = true;
  }, []);

  const stop = useCallback(() => {
    isRunning.current = false;
  }, []);

  const reset = useCallback(() => {
    setRemaining(length);
  }, []);

  useEffect(() => {
    if (!!isRunning.current && remaining > 0) {
      const timeout = setTimeout(() => {
        setRemaining(remaining - tick);
      }, tick);

      return () => clearTimeout(timeout);
    }

    if (remaining < 0) {
      setRemaining(0);
      stop();
    }

    if (remaining === 0 && !!isRunning.current) {
      stop();
    }

    return;
  }, [remaining]);

  return { start, stop, reset, remaining, length, isRunning: !!isRunning.current };
}

/**
 * Execute an effect if the supplied timer ticks.
 *
 * @param timer - The `TimerHook` object to base effects from.
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - If present, effect will only activate if the values in the list change.
 */
export function useTimerEffect(timer: TimerHook, effect: EffectCallback, deps: readonly any[] = []) {
  const { isRunning, remaining, length } = timer;
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
