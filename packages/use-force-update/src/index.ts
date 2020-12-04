import { useReducer } from 'react';

/**
 * Returns a memoized function that forces a local component re-render when
 * invoked.
 */
export function useForceUpdate() {
  const [_, forceUpdate] = useReducer((x: number) => x + 1, 0);
  return forceUpdate;
}
