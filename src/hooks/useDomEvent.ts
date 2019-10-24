import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { isElement, isRefObject, isWindow } from '../utils/type-guards';

/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update.
 */
export function useDomEvent<T extends HTMLElement | Window | Document>(
  element: T | RefObject<T> | MutableRefObject<T>,
  ...eventListenerParams: Parameters<T['addEventListener']>
) {
  const [type, listener, options] = eventListenerParams;
  const savedListener = useRef(listener);
  const savedOptions = useRef(options);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    savedOptions.current = options;
  }, [options]);

  useEffect(() => {
    if (isWindow(element) || isElement(element)) {
      const listener = (e: any) => (savedListener.current as any)(e);
      element.addEventListener(type, listener);
      return () => {
        element.removeEventListener(type, listener);
      };
    }

    if (isRefObject<T>(element)) {
      if (!!element.current && isElement(element.current)) {
        const listener = (e: any) => (savedListener.current as any)(e);
        element.current.addEventListener(type, listener);
        return () => {
          element.current!.removeEventListener(type, listener);
        };
      }
    }

    return;
  }, [type, element]);
}
