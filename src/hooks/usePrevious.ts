import { useEffect, useRef } from 'react';

/**
 * Returns the previous state of the given `value`.
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
