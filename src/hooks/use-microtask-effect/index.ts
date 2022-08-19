import { DependencyList } from 'react';

import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect';

export function useMicrotaskEffect(task: () => void, deps?: DependencyList) {
  useIsomorphicLayoutEffect(() => {
    queueMicrotask(task);
  }, deps);
}
