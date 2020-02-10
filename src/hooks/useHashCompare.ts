import { useCompare } from './useCompare';
import { useHash } from './useHash';

/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update based on a hash of its contents.
 */
export function useHashCompare<T = any>(value: T) {
  const hash = useHash(value);
  const didHashChange = useCompare(hash);
  return didHashChange;
}
