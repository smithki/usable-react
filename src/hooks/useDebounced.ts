import { useEffect, useState } from 'react';

/**
 * Debounces the given value. If `delay` is zero, the value is updated
 * synchronously.
 */
export function useDebounced<T>(value: T, delay: number = 300) {
  const isSynchronous = delay === 0;
  const [debouncedValue, setDebouncedValue] = useState<T>((undefined as unknown) as T);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, isSynchronous, value]);

  return isSynchronous ? value : debouncedValue;
}
