import { useCallbackConst } from '../use-callback-const';
import { useValueRef } from '../use-value-ref';

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency.
 *
 * Returns a new callback with a constant value over the lifecycle of a component.
 */
export function useCallbackRef<T extends (...args: any[]) => any>(callback?: T): T {
  const callbackRef = useValueRef(callback);
  return useCallbackConst(((...args) => callbackRef.current?.(...args)) as T);
}
