import { DependencyList, useEffect, useRef, useState } from 'react';

import { ElementOrRef, resolveElement } from '../../utils/element-refs';
import { useCallbackConst } from '../use-const';
import { useIsMounted } from '../use-is-mounted';

function hasIntersectionObserver() {
  return typeof window.IntersectionObserver !== 'undefined';
}

export interface UseIntersectionObserverOptions<T extends ElementOrRef<Element>> extends IntersectionObserverInit {
  ref: T;
  freezeOnceVisible?: boolean;
  handleEntry?: (entry: IntersectionObserverEntry) => void;
}

/**
 * Use an intersection observer to detect if
 * the given element `ref` is within the viewport.
 *
 * Based on `useIntersectionObserver` from `usehooks-ts`
 *
 * @see the LICENSE file at:
 *   https://github.com/juliencrn/usehooks-ts/blob/master/LICENSE
 *
 * Modifications from original source:
 *   - Add support for effect dependencies
 *   - Skip the callback intersection callback if component is not mounted
 */
export function useIntersectionObserver<T extends ElementOrRef<Element>>(
  {
    ref,
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    handleEntry,
  }: UseIntersectionObserverOptions<T>,
  deps: DependencyList = [],
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const handleEntryRef = useRef<UseIntersectionObserverOptions<T>['handleEntry']>(() => {});
  useEffect(() => {
    handleEntryRef.current = handleEntry;
  }, [handleEntry]);

  const isMounted = useIsMounted();
  const updateEntry = useCallbackConst<IntersectionObserverCallback>(([newEntry]) => {
    if (newEntry && isMounted()) {
      setEntry(newEntry);
      handleEntryRef.current?.(newEntry);
    }
  });

  useEffect(() => {
    const node = resolveElement<Element>(ref);

    if (!hasIntersectionObserver() || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen, ...deps]);

  return entry;
}
