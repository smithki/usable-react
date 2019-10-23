import { usePrevious } from './usePrevious';

/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update.
 */
export function useCompare<T>(value: T) {
  const prevVal = usePrevious(value);
  return prevVal !== value;
}
