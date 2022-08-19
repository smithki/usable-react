import { MutableRefObject, RefObject } from 'react';

import { isElement, isRefObject } from './instance-of';

export type ReactRef<T> = MutableRefObject<T> | RefObject<T>;
export type ElementOrRef<T extends Node = Element> = T | ReactRef<T> | null;

export function resolveElement<T extends Node = Element>(value: ElementOrRef<T>): T | null {
  if (isRefObject(value)) return value.current ?? null;
  if (isElement(value)) return value ?? null;
  return null;
}
