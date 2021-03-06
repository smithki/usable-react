import { useReducer } from 'react';

/**
 * Returns a function that forces a local component re-render when called.
 */
export function useForceUpdate() {
  const [_, forceUpdate] = useReducer((x: number) => x + 1, 0);
  return forceUpdate as () => void;
}
