import { ReactElement, useEffect, useState } from 'react';
import { areReactChildrenDifferent } from '../utils/are-react-children-different';
import { useInitialRender } from './useInitialRender';

/**
 * Get a copy of the given `children`, deferred to the next update.
 */
export function useDeferredChildren(children: ReactElement | ReactElement[]) {
  const [nextChildren, setNextChildren] = useState(children);
  const isInitialRender = useInitialRender();

  useEffect(() => {
    if (!isInitialRender && areReactChildrenDifferent(nextChildren, children)) {
      setNextChildren(children);
    }
  }, [nextChildren, children]);

  return nextChildren;
}
