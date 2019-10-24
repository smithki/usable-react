import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from 'react';
import { isDocument, isElement, isRefObject, isWindow } from '../utils/type-guards';

export type UseDomEventRemoveListenerFunction = () => void;

export type UseDomEventAddListenerFunction<T extends HTMLElement | Window | Document> = T extends HTMLElement
  ? <K extends keyof HTMLElementEventMap>(
      eventName: K,
      listener: (this: T, event: HTMLElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions | undefined,
    ) => UseDomEventRemoveListenerFunction
  : (T extends Window
      ? <K extends keyof WindowEventMap>(
          eventName: K,
          listener: (this: T, event: WindowEventMap[K]) => any,
          options?: boolean | AddEventListenerOptions,
        ) => UseDomEventRemoveListenerFunction
      : (T extends Document
          ? <K extends keyof DocumentEventMap>(
              eventName: K,
              listener: (this: T, event: DocumentEventMap[K]) => any,
              options?: boolean | AddEventListenerOptions,
            ) => UseDomEventRemoveListenerFunction
          : never));

/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update.
 */
export function useDomEvent<T extends HTMLElement | Window | Document>(
  element: T | MutableRefObject<T> | RefObject<T>,
) {
  const addListener: UseDomEventAddListenerFunction<T> = ((...eventListenerParams: any[]) => {
    const [type, listener, options] = eventListenerParams as Parameters<T['addEventListener']>;
    const savedListener = useRef(listener);
    const savedOptions = useRef(options);

    useEffect(() => {
      savedListener.current = listener;
    }, [listener]);

    useEffect(() => {
      savedOptions.current = options;
    }, [options]);

    useEffect(() => {
      if (isWindow(element) || isDocument(element) || isElement(element)) {
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

    const removeListener = useCallback(() => {
      if (isWindow(element) || isDocument(element) || isElement(element)) {
        element.removeEventListener(type, listener);
      }

      if (isRefObject<T>(element)) {
        if (!!element.current && isElement(element.current)) {
          element.current!.removeEventListener(type, listener);
        }
      }
    }, [type, element]);

    return removeListener;
  }) as UseDomEventAddListenerFunction<T>;

  return addListener;
}
