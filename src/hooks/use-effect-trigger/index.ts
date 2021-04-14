import { DependencyList, EffectCallback, useEffect, useReducer, useRef } from 'react';
import { useCompare } from '../use-compare';

/**
 * Exactly like `useEffect`, except that it returns a memoized function to
 * trigger the effect in question. The effect only executes when the trigger
 * updates regardless of the given `deps`.
 *
 * A few use-cases for this hook include:
 *
 * 1. Deferring an effect to the next render tick.
 * 2. Sequencing asynchronous effects.
 * 3. Executing an effect after marshalling arbitrary state/data required for
 *    the effect to proceed.
 */
export function useEffectTrigger(effect: EffectCallback, deps: DependencyList = []) {
  const [i, trigger] = useReducer((x: number) => x + 1, 0);
  const didTriggerUpdate = useCompare(i);
  const savedCallback = useRef(effect);

  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  useEffect(() => {
    if (didTriggerUpdate) {
      return savedCallback.current();
    }

    return undefined;
  }, [i, ...deps]);

  return trigger as () => void;
}
