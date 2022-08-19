import { useLayoutEffect } from 'react';

import { CAN_USE_DOM } from '../../utils/can-use-dom';

export const useIsomorphicLayoutEffect: typeof useLayoutEffect = (...args) => {
  return CAN_USE_DOM ? useLayoutEffect(...args) : () => {};
};
