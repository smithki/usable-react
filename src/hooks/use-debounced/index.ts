import { useEffect, useState } from 'react';

/**
 * Debounces the given value.
 * If `delay` is zero, the value is updated synchronously.
 *
 * @param value - The raw value to debounce.
 * @param delay - Number of milliseconds to debouce `value` [default: `300`].
 */
export function useDebounced<T>(value: T, delay = 300) {
  const isSynchronous = delay === 0;
  const [debouncedValue, setDebouncedValue] = useState<T>(undefined as unknown as T);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(id);
  }, [delay, isSynchronous, value]);

  return isSynchronous ? value : debouncedValue;
}
