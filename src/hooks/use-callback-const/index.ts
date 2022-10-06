import { useConst } from '../use-const';

/**
 * Creates a callback with a constant value over the lifecycle of a component.
 */
export function useCallbackConst<T extends (...args: any[]) => any>(callback: T): T {
  return useConst<T>(() => callback);
}
