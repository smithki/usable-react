import { useRef } from 'react';

import { useCallbackConst } from '../use-callback-const';
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

  return useCallbackConst(() => isMountedRef.current);
}
