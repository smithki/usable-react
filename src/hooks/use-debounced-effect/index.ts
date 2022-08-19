import { DependencyList, EffectCallback, useEffect } from 'react';

import { useEffectTrigger } from '../use-effect-trigger';
import { useInitialRender } from '../use-initial-render';

/**
 * Debounces an effect.
 * If `delay` is zero, the effect is executed synchronously.
 *
 * The effect executes synchronously on the first render.
 */
export function useDebouncedEffect(effect: EffectCallback, delay = 0, deps: DependencyList = []) {
  const isInitialRender = useInitialRender();
  const triggerEffect = useEffectTrigger(effect, deps);

  useEffect(() => {
    if (isInitialRender || !delay) {
      return effect();
    }

    const timeout = setTimeout(() => {
      triggerEffect();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, ...deps]);
}
