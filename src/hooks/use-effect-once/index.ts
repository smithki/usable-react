import { EffectCallback, useEffect, useRef } from 'react';

import { useForceUpdate } from '../use-force-update';

/**
 * Exactly like `useEffect`, except that the effect only once
 * (even in React >=v18 strict mode).
 *
 * Based on this workaround from AG Grid:
 *   https://blog.ag-grid.com/avoiding-react-18-double-mount/
 */
export function useEffectOnce(effect: EffectCallback) {
  const destroyFunc = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const forceUpdate = useForceUpdate();

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // Only execute the effect first time around...
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // Force one render after the effect is run...
    forceUpdate();

    return () => {
      // If the comp didn't render since the useEffect
      // was called, we know it's the dummy React cycle
      if (!renderAfterCalled.current) return;
      destroyFunc.current?.();
    };
  }, []);
}
