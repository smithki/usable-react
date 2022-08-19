import { usePrevious } from '../use-previous';

/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update.
 *
 * @param value - The value to compare against the previous render.
 */
export function useCompare<T>(value: T) {
  const prevVal = usePrevious(value);
  return prevVal !== value;
}
