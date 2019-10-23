import { useEffect, useRef } from 'react';

/**
 * Returns a `boolean` indicating whether the current update is the intial
 * render (when the component is first mounted).
 */
export function useInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, []);
  return isInitialRender.current;
}
