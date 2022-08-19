import { DependencyList, useEffect, useMemo } from 'react';

import { useIsMounted } from '../use-is-mounted';

export interface AsyncEffectInit<ResultType> {
  /**
   * Do something async!
   */
  execute: (signal: AbortSignal) => Promise<ResultType>;

  /**
   * Registers a callback to execute when the async handler resolves. Analagous
   * to `Promise.then`.
   */
  onFulfilled?: ((value: ResultType) => void) | null;

  /**
   * Registers a callback to execute when the async handler rejects. Analagous
   * to `Promise.catch`.
   */
  onRejected?: ((reason: any) => void) | null;

  /**
   * Registers a callback to execute when the async handler completes, whether
   * successfully or not. Analagous to `Promise.finally`.
   */
  onSettled?: (() => void) | null;

  /**
   * Registers a callback to execute when the underlying `React.useEffect` is
   * cleaned up.
   */
  onCleanup?: (() => void) | null;
}

/**
 * Makes asynchronous work inside the React lifecycle easy with automatic guards
 * against updating internal component state if the component is unmounted
 * before the async work is finished.
 */
export function useAsyncEffect<ResultType = any>(
  initFactory: () => AsyncEffectInit<ResultType>,
  deps?: DependencyList,
): void {
  const init = useMemo<AsyncEffectInit<ResultType>>(() => {
    return initFactory();
  }, deps);

  const isMounted = useIsMounted();
  useEffect(() => {
    const controller = new AbortController();

    init
      .execute(controller.signal)
      .then((value) => {
        if (isMounted() && !controller.signal.aborted) init.onFulfilled?.(value);
      })
      .catch((err) => {
        if (isMounted() && !controller.signal.aborted) init.onRejected?.(err);
      })
      .finally(() => {
        if (isMounted() && !controller.signal.aborted) init.onSettled?.();
      });

    return () => {
      controller.abort();
      init.onCleanup?.();
    };
  }, [init]);
}
