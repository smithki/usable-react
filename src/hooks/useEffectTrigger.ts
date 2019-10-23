import { EffectCallback, useCallback, useEffect, useState } from 'react';
import { useCompare } from './useCompare';

/**
 * Exactly like `useEffect` except that it returns a memoized function to
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
export function useEffectTrigger(effect: EffectCallback, deps: readonly any[] = []) {
  const [trigger, setTrigger] = useState(0);
  const didTriggerUpdate = useCompare(trigger);

  useEffect(() => {
    if (didTriggerUpdate) {
      return effect();
    }
  }, [trigger, ...deps]);

  return useCallback(() => setTrigger(trigger + 1), [trigger]);
}
