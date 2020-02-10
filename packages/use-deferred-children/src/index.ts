import React, { ReactElement, useEffect, useState } from 'react';
import { useInitialRender } from '@usable-react/use-initial-render';

/**
 * Checks if old children and new children are different based on React keys.
 *
 * @source https://github.com/reactjs/react-transition-group/blob/master/src/SwitchTransition.js#L6
 */
function areReactChildrenDifferent(
  oldChildren: ReactElement | ReactElement[],
  newChildren: ReactElement | ReactElement[],
) {
  if (oldChildren === newChildren) return false;

  if (
    React.isValidElement(oldChildren) &&
    React.isValidElement(newChildren) &&
    oldChildren.key != null &&
    oldChildren.key === newChildren.key
  ) {
    return false;
  }

  return true;
}

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
