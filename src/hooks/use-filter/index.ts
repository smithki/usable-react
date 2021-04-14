import Fuse from 'fuse.js';
import { useState } from 'react';
import { useHash } from '../use-hash';
import { useDebouncedEffect } from '../use-debounced-effect';

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

  const options: Fuse.IFuseOptions<TData> = {
    keys: [],
    ...searchOptions,
  };

  const haystackHash = useHash(haystack);
  const optionsHash = useHash(options);

  // Execute a search if the needle/haystack changes.
  useDebouncedEffect(
    () => {
      if (needle) {
        const fuse = new Fuse<TData>(haystack || [], options);
        if (needle) setResults(fuse.search(needle).map((i) => i.item));
      }
    },
    debounce,
    [needle, haystackHash, optionsHash],
  );

  return results;
}
