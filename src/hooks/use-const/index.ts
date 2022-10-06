import { useRef } from 'react';

/**
 * Creates a constant value over the lifecycle of a component.
 *
 * Based on `useConst` utility from `chakra-ui`.
 *
 * @see the LICENSE file at the root of this source tree:
 *   https://github.com/chakra-ui/chakra-ui/blob/6e259a1f7008a00f7be096e6b315cb9d62ef9748/packages/hooks/src/use-const.ts
 *
 * Modifications from original source:
 *   - TypeScript improvements using overload definitions
 */
export function useConst<T>(init: T | (() => T)): T;
export function useConst<T = undefined>(): T | undefined;
export function useConst<T>(init?: T | (() => T)): T | undefined {
  // `useRef` is less expensive than `useState`.
  const ref = useRef<T | null>(null);

  if (ref.current == null) {
    ref.current = typeof init === 'function' ? (init as Function)() : init;
  }

  return ref.current as T;
}
