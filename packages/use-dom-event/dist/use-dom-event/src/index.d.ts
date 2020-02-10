import { MutableRefObject, RefObject } from 'react';
export declare type UseDomEventRemoveListenerFunction = () => void;
export declare type UseDomEventAddListenerFunction<T extends HTMLElement | Window | Document> = T extends HTMLElement ? <K extends keyof HTMLElementEventMap>(eventName: K, listener: (this: T, event: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined) => UseDomEventRemoveListenerFunction : T extends Window ? <K extends keyof WindowEventMap>(eventName: K, listener: (this: T, event: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => UseDomEventRemoveListenerFunction : T extends Document ? <K extends keyof DocumentEventMap>(eventName: K, listener: (this: T, event: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => UseDomEventRemoveListenerFunction : never;
/**
 * Returns a `boolean` indicating whether the given `value` has changed since
 * the previous update.
 */
export declare function useDomEvent<T extends HTMLElement | Window | Document>(element: T | MutableRefObject<T> | RefObject<T>): UseDomEventAddListenerFunction<T>;
