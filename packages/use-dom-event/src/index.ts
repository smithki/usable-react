/* eslint-disable no-shadow */

import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from 'react';
import { isDocument, isElement, isRefObject, isWindow } from './type-guards';

interface AddEventListenerFunction<
  T extends HTMLElement | Window | Document,
  EventMap extends HTMLElementEventMap | WindowEventMap | DocumentEventMap
> {
  <K extends keyof EventMap>(
    eventName: K,
    listener: (this: T, event: EventMap[K]) => any,
    dep?: React.DependencyList,
    options?: boolean | AddEventListenerOptions | undefined,
  ): UseDomEventRemoveListenerFunction;

  <K extends keyof EventMap>(
    eventName: K,
    listener: (this: T, event: EventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined,
    deps?: React.DependencyList,
  ): UseDomEventRemoveListenerFunction;

  <K extends keyof EventMap>(
    eventName: K,
    listener: (this: T, event: EventMap[K]) => any,
    depsOrOptions?: React.DependencyList | boolean | AddEventListenerOptions | undefined,
    optionsOrDeps?: React.DependencyList | boolean | AddEventListenerOptions | undefined,
  ): UseDomEventRemoveListenerFunction;
}

export type UseDomEventRemoveListenerFunction = () => void;
export type UseDomEventAddListenerFunction<T extends HTMLElement | Window | Document> = T extends HTMLElement
  ? AddEventListenerFunction<T, HTMLElementEventMap>
  : T extends Window
  ? AddEventListenerFunction<T, WindowEventMap>
  : T extends Document
  ? AddEventListenerFunction<T, DocumentEventMap>
  : never;

/**
 * Creates a React hook that registers DOM event listeners on the given
 * `element`. The effect returns a `void` function that can be used to remove
 * the event listener manually. Event listeners created this way are
 * automatically cleaned up before the component unmounts.
 */
export function useDomEvent<T extends HTMLElement | Window | Document>(
  element: T | MutableRefObject<T> | RefObject<T>,
) {
  const addListener: UseDomEventAddListenerFunction<T> = ((...eventListenerParams: any[]) => {
    const [eventName, listener, depsOrOptions, optionsOrDeps] = eventListenerParams;

    const deps: React.DependencyList = (Array.isArray(depsOrOptions) ? depsOrOptions : optionsOrDeps) || [];
    const options: boolean | AddEventListenerOptions | undefined = Array.isArray(depsOrOptions)
      ? optionsOrDeps
      : depsOrOptions;

    const savedListener = useRef(listener);
    const savedOptions = useRef(options);
    const removeListenerRef = useRef(() => {});

    useEffect(() => {
      savedListener.current = listener;
    }, [listener]);

    useEffect(() => {
      savedOptions.current = options;
    }, [options]);

    useEffect(() => {
      if (isWindow(element) || isDocument(element) || isElement(element)) {
        const listener = (e: any) => savedListener.current(e);
        element.addEventListener(eventName, listener, savedOptions.current);
        removeListenerRef.current = () => {
          element.removeEventListener(eventName, listener, savedOptions.current);
        };
        return removeListenerRef.current;
      }

      if (isRefObject<T>(element)) {
        if (!!element.current && isElement(element.current)) {
          const listener = (e: any) => savedListener.current(e);
          element.current.addEventListener(eventName, listener, savedOptions.current);
          removeListenerRef.current = () => {
            element.current!.removeEventListener(eventName, listener, savedOptions.current);
          };
          return removeListenerRef.current;
        }
      }

      return undefined;
    }, [eventName, element, ...deps]);

    return useCallback(() => removeListenerRef.current(), []);
  }) as UseDomEventAddListenerFunction<T>;

  return addListener;
}
