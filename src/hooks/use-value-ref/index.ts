import { useEffect, useRef } from 'react';

/**
 * Converts `value` to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency.
 *
 * Returns a ref object with a constant value over the lifecycle of a component.
 */
export function useValueRef<T>(value: T) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  });

  return valueRef;
}
