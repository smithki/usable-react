import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import { useCompare } from '@usable-react/use-compare';
import { useHash } from '@usable-react/use-hash';
import { useTimer, useTimerComplete } from '@usable-react/use-timer';
import { useEffectTrigger } from '../../usable-react/src';

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
  searchOptions?: Fuse.FuseOptions<TData>;
}

/**
 * Peform a fuzzy search on a dataset (`haystack`), returning the results that
 * match most closely to the given `needle`.
 */
export function useFilter<TData = any>({ needle, haystack, debounce, searchOptions }: UseFilterOptions<TData> = {}) {
  const [results, setResults] = useState<TData[]>([]);
  const cooldownTimer = useTimer({ length: 0, tick: 100, autoStart: false });

  const optionsWithDefaults: Fuse.FuseOptions<TData> = useMemo(
    () => ({
      keys: [],
      ...searchOptions,
    }),
    [searchOptions],
  );

  const haystackHash = useHash(haystack);
  const optionsHash = useHash(optionsWithDefaults);

  const didNeedleChange = useCompare(needle);
  const didHaystackChange = useCompare(haystackHash);
  const didOptionsChange = useCompare(optionsHash);

  const search = useEffectTrigger(() => {
    const fuse = new Fuse<TData, Fuse.FuseOptions<TData>>(haystack || [], optionsWithDefaults);
    if (needle) setResults(fuse.search(needle) as TData[]);
  }, [needle, haystackHash, optionsHash, debounce]);

  // Execute a search if the needle/haystack changes.
  useEffect(() => {
    if (!cooldownTimer.isRunning && (didNeedleChange || didHaystackChange || didOptionsChange)) {
      cooldownTimer.reset(debounce);
      cooldownTimer.start();
      search();
    }
  }, [needle, haystackHash, optionsHash, debounce, search]);

  useTimerComplete(cooldownTimer, () => search(), [search]);

  return results;
}
