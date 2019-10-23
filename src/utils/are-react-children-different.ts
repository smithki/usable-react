import React, { ReactElement } from 'react';

/**
 * Checks if old children and new children are different based on React keys.
 *
 * @source https://github.com/reactjs/react-transition-group/blob/master/src/SwitchTransition.js#L6
 */
export const areReactChildrenDifferent = (
  oldChildren: ReactElement | ReactElement[],
  newChildren: ReactElement | ReactElement[],
) => {
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
};
