/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-shadow */

import { MutableRefObject, RefObject, useEffect, useRef } from 'react';

import { isDocument, isElement, isRefObject, isWindow } from '../../utils/instance-of';
import { useCallbackConst } from '../use-const';

export interface AddEventListenerFunction<
  T extends HTMLElement | Window | Document,
  EventMap extends HTMLElementEventMap | WindowEventMap | DocumentEventMap,
> {
  <K extends keyof EventMap>(
    eventName: K,
    listener: (this: T, event: EventMap[K]) => any,
    deps?: React.DependencyList,
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
export type UseDomEventAddListenerFunction<T extends HTMLElement | Window | Document | null> = T extends HTMLElement
  ? AddEventListenerFunction<T, HTMLElementEventMap>
  : T extends Window
  ? AddEventListenerFunction<T, WindowEventMap>
  : T extends Document
  ? AddEventListenerFunction<T, DocumentEventMap>
  : never;

/**
 * Creates a React hook that registers DOM event listeners on the given
 * `target`. The effect returns a `void` function that can be used to remove
 * the event listener manually. Event listeners created this way are
 * automatically cleaned up before the component unmounts.
 */
export function useDomEventListeners<T extends HTMLElement | Window | Document | null>(
  taget: T | MutableRefObject<T> | RefObject<T>,
): UseDomEventAddListenerFunction<T>;
export function useDomEventListeners<T extends HTMLElement | Window | Document | null>(
  taget: () => T | MutableRefObject<T> | RefObject<T>,
): UseDomEventAddListenerFunction<T>;
export function useDomEventListeners<T extends HTMLElement | Window | Document | null>(
  target: T | (() => T) | MutableRefObject<T> | RefObject<T>,
): UseDomEventAddListenerFunction<T> {
  return ((...eventListenerParams: any[]) => {
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
      const element = typeof target === 'function' ? target() : target;

      // Bail out early if `element` is null.
      if (!element) return undefined;

      // Handle events from an `element` given as a valid node.
      if (isWindow(element) || isDocument(element) || isElement(element)) {
        const options = typeof savedOptions.current === 'boolean' ? savedOptions.current : { ...savedOptions.current };
        const listener = (e: any) => savedListener.current(e);
        element.addEventListener(eventName, listener, options);
        removeListenerRef.current = () => {
          element.removeEventListener(eventName, listener, options);
        };
        return removeListenerRef.current;
      }

      // Handle events from an `element` given as a React ref.
      if (isRefObject<T>(element)) {
        if (!!element.current && isElement(element.current)) {
          const el = element.current;
          const options =
            typeof savedOptions.current === 'boolean' ? savedOptions.current : { ...savedOptions.current };
          const listener = (e: any) => savedListener.current(e);
          el.addEventListener(eventName, listener, options);
          removeListenerRef.current = () => {
            el.removeEventListener(eventName, listener, options);
          };
          return removeListenerRef.current;
        }
      }

      return undefined;
    }, [eventName, typeof target !== 'function' && target, ...deps]);

    return useCallbackConst(() => removeListenerRef.current());
  }) as UseDomEventAddListenerFunction<T>;
}
