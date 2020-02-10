import createHash from 'object-hash';
import { useEffect, useState } from 'react';

/**
 * Returns a hash of the given `value`.
 */
export function useHash<T>(value: T) {
  const [hash, setHash] = useState<string>(createHash(typeof value === 'undefined' ? null : ''));
  useEffect(() => {
    if (value) {
      setHash(createHash(value));
    }
  }, [value]);
  return hash;
}
