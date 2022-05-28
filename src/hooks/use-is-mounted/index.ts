import { useRef, useEffect, useCallback } from 'react';
import { useEffectOnce } from '../use-effect-once';

/**
 * Returns a memoized callback that when invoked returns `boolean` indicating if
 * the local component is currently mounted.
 */
export function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffectOnce(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  });

  return useCallback(() => isMountedRef.current, []);
}
