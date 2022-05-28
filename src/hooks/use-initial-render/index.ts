import { useEffect, useRef } from 'react';
import { useEffectOnce } from '../use-effect-once';

/**
 * Returns a `boolean` indicating whether the current update is the intial
 * render (when the component is first mounted).
 */
export function useInitialRender() {
  const isInitialRender = useRef(true);
  useEffectOnce(() => {
    isInitialRender.current = false;
  });
  return isInitialRender.current;
}
