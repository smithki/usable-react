import { useEffect, useState } from 'react';
import { createHash } from './create-hash';

/**
 * Returns a hash of the given `value`. This is useful for comparing objects
 * deeply. For example, if the contents of an array are referenced inside a
 * `useEffect`, you can pass the hashed array to the effect dependencies to
 * invoke it when the array updates.
 */
export function useHash<T>(value: T) {
  const [hash, setHash] = useState<string>(createHash(typeof value === 'undefined' ? null : ''));
  useEffect(() => {
    if (value) setHash(createHash(value));
  }, [value]);
  return hash;
}
