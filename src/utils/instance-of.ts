import { MutableRefObject, RefObject } from 'react';

export function isDocument(obj: any): obj is Document {
  return obj instanceof HTMLDocument;
}

export function isWindow(obj: any): obj is Window {
  return obj instanceof Window;
}

export function isRefObject<T>(obj: any): obj is RefObject<T> | MutableRefObject<T> {
  return obj?.hasOwnProperty('current');
}

export function isElement<T extends HTMLElement>(obj: any): obj is T {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have (works on IE7)
    return (
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.style === 'object' &&
      typeof obj.ownerDocument === 'object'
    );
  }
}
