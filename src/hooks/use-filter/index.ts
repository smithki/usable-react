import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useCompare } from '../use-compare';
import { useHash } from '../use-hash';
import { useTimer, useTimerComplete } from '../use-timer';
import { useEffectTrigger } from '../use-effect-trigger';

interface UseFilterOptions<TData> {
  /**
   * The search term that will be used to query the `haystack`.
   */
  needle?: string;

  /**
   * The data to search.
   */
  haystack?: TData[];

  /**
   * Debounces the (perhaps costly) fuzzy search operation. Use this option if
   * performance is a concern.
   */
  debounce?: number;

  /**
   * Fuse.js options -> see https://fusejs.io/
   */
  searchOptions?: Fuse.IFuseOptions<TData>;
}

/**
 * Peform a fuzzy search on a dataset (`haystack`), returning the results that
 * match most closely to the given `needle`.
 */
export function useFilter<TData = any>({ needle, haystack, debounce, searchOptions }: UseFilterOptions<TData> = {}) {
  const [results, setResults] = useState<TData[]>([]);
  const cooldownTimer = useTimer({ length: 0, tick: 100, autoStart: false });

  const options: Fuse.IFuseOptions<TData> = {
    keys: [],
    ...searchOptions,
  };

  const haystackHash = useHash(haystack);
  const optionsHash = useHash(options);

  const didNeedleChange = useCompare(needle);
  const didHaystackChange = useCompare(haystackHash);
  const didOptionsChange = useCompare(optionsHash);

  const triggerSearch = useEffectTrigger(() => {
    const fuse = new Fuse<TData>(haystack || [], options);
    if (needle) setResults(fuse.search(needle).map((i) => i.item));
  }, [needle, haystackHash, optionsHash, debounce]);

  // Execute a search if the needle/haystack changes.
  useEffect(() => {
    if (!cooldownTimer.isRunning() && (didNeedleChange || didHaystackChange || didOptionsChange)) {
      cooldownTimer.reset(debounce);
      cooldownTimer.start();
      triggerSearch();
    }
  }, [needle, haystackHash, optionsHash, debounce]);

  useTimerComplete(cooldownTimer, () => triggerSearch(), []);

  return results;
}
