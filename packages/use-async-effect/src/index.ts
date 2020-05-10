import { DependencyList, useEffect, useCallback, useRef, useMemo } from 'react';
import { useIsMounted } from '@usable-react/use-is-mounted';

type NonVoid<T> = T extends void ? never : T;

type NarrowedAsyncEffect<TContext, TResult, TVisited extends string | void, TNarrow extends string> = Omit<
  AsyncEffect<TContext, TResult, TVisited | TNarrow>,
  NonVoid<TVisited> | TNarrow
>;

interface AsyncEffect<TContext, TResult, TVisited extends string | void = void> {
  /**
   * Registers a callback to execute when the async handler resolves. Analagous
   * to `Promise.then`.
   */
  fullfilled(
    onfulfilled?: ((value: TResult, context: Partial<TContext>) => void) | null,
  ): NarrowedAsyncEffect<TContext, TResult, TVisited, 'fullfilled'>;

  /**
   * Registers a callback to execute when the async handler rejects. Analagous
   * to `Promise.catch`.
   */
  rejected(
    onrejected?: ((reason: any, context: Partial<TContext>) => void) | null,
  ): NarrowedAsyncEffect<TContext, TResult, TVisited, 'rejected'>;

  /**
   * Registers a callback to execute when the async handler completes, whether
   * successfully or not. Analagous to `Promise.finally`.
   */
  settled(
    onsettled?: ((context: Partial<TContext>) => void) | null,
  ): NarrowedAsyncEffect<TContext, TResult, TVisited, 'settled'>;

  /**
   * Registers a callback to execute when the underlying `React.useEffect` is
   * cleaned up.
   */
  cleanup(
    onfulfilled?: ((context: Partial<TContext>) => void) | null,
  ): NarrowedAsyncEffect<TContext, TResult, TVisited, 'cleanup'>;
}

/**
 * Makes asynchronous work inside the React lifecycle easy with automatic guards
 * against updating internal component state if the component is unmounted
 * before the async work is finished.
 */
export function useAsyncEffect<TContext extends { [key: string]: any } = { [key: string]: any }, TResult = any>(
  handler: (context: Partial<TContext>) => Promise<TResult>,
  deps?: DependencyList,
): AsyncEffect<TContext, TResult> {
  const thenCallback = useRef<any>();
  const registerThenCb = useCallback(onfulfilled => {
    thenCallback.current = onfulfilled;
    return chain;
  }, []);

  const catchCallback = useRef<any>();
  const registerCatchCb = useCallback(onrejected => {
    catchCallback.current = onrejected;
    return chain;
  }, []);

  const finallyCallback = useRef<any>();
  const registerFinallyCb = useCallback(onsettled => {
    finallyCallback.current = onsettled;
    return chain;
  }, []);

  const cleanupCallback = useRef<any>();
  const registerCleanupCb = useCallback(oncleanup => {
    cleanupCallback.current = oncleanup;
    return chain;
  }, []);

  const chain: any = useMemo(() => {
    return {
      fullfilled: registerThenCb,
      rejected: registerCatchCb,
      settled: registerFinallyCb,
      cleanup: registerCleanupCb,
    };
  }, []);

  const isMounted = useIsMounted();
  useEffect(() => {
    const context: any = {};

    handler(context)
      .then(value => {
        if (isMounted() && thenCallback.current) thenCallback.current(value, context);
      })
      .catch(err => {
        if (isMounted() && catchCallback.current) catchCallback.current(err, context);
      })
      .finally(() => {
        if (isMounted() && finallyCallback.current) finallyCallback.current(context);
      });

    if (cleanupCallback.current) return () => cleanupCallback.current(context);
    return undefined;
  }, deps);

  return chain;
}
