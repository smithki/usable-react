import { useCallback, useState } from 'react';

import { ElementOrRef, resolveElement } from '../../utils/element-refs';
import { useCallbackConst } from '../use-callback-const';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect';
import { useResizeObserver } from '../use-resize-observer';

export interface UseMeasurementOptions<ElementType extends HTMLElement, StateType = any> {
  ref: ElementOrRef<ElementType>;
  getMeasurement: (el: ElementType) => StateType;
  defaultValue: StateType | (() => StateType);
}

/**
 * Given an element `ref`, glean an arbitrary, stateful measurement.
 */
export function useMeasurement<ElementType extends HTMLElement, StateType = any>(
  options: UseMeasurementOptions<ElementType, StateType>,
) {
  const { ref, getMeasurement, defaultValue } = options;
  const [measurement, setMeasurement] = useState(defaultValue);

  const onResize = useCallback(() => {
    const el = resolveElement(ref);
    if (el) {
      setMeasurement(getMeasurement(el));
    }
  }, [ref, setMeasurement, getMeasurement]);

  useResizeObserver(ref, onResize);
  useIsomorphicLayoutEffect(onResize, [onResize]);

  return measurement;
}

/**
 * Given an element `ref`, glean a stateful measurement of the width.
 */
export function useElementWidth<T extends HTMLElement>(ref: ElementOrRef<T>) {
  return useMeasurement<T, number>({
    ref,
    getMeasurement: useCallbackConst((el) => {
      return el.offsetWidth;
    }),
    defaultValue: 0,
  });
}

/**
 * Given an element `ref`, glean a stateful measurement of the height.
 */
export function useElementHeight<T extends HTMLElement>(ref: ElementOrRef<T>) {
  return useMeasurement<T, number>({
    ref,
    getMeasurement: useCallbackConst((el) => {
      return el.offsetHeight;
    }),
    defaultValue: 0,
  });
}
