import { DependencyList, useEffect, useRef } from 'react';

import { ReactRef } from '../../utils/element-refs';
import { useIsMounted } from '../use-is-mounted';

function hasResizeObserver() {
  return typeof window.ResizeObserver !== 'undefined';
}

/**
 * Based on `useResizeObserver` from `@react-aria/utils`
 *
 * @see the LICENSE file at the root of this source tree:
 *   https://github.com/adobe/react-spectrum/blob/d667676bd59eeb00eb087597579315841c352077/packages/%40react-aria/utils/src/useResizeObserver.ts
 *
 * Modifications from original source:
 *   - Add support for effect dependencies
 *   - Skip the callback intersection callback if component is not mounted
 */
export function useResizeObserver<T extends Element>(
  ref: ReactRef<T>,
  onResize: () => void = () => {},
  deps: DependencyList = [],
) {
  const isMounted = useIsMounted();

  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const listener = () => onResizeRef.current();

    if (!hasResizeObserver()) {
      window.addEventListener('resize', listener, false);
      return () => {
        window.removeEventListener('resize', listener, false);
      };
    }

    const resizeObserverInstance = new window.ResizeObserver((entries) => {
      if (!entries.length || !isMounted()) return;
      onResizeRef.current();
    });

    resizeObserverInstance.observe(element);

    return () => {
      if (element) {
        resizeObserverInstance.unobserve(element);
      }
    };
  }, [ref, ...deps]);
}
