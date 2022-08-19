import { EffectCallback, DependencyList } from 'react';

import { CAN_USE_DOM } from '../../utils/can-use-dom';
import { ElementOrRef, resolveElement } from '../../utils/element-refs';
import { useDomEventListeners } from '../use-dom-event-listeners';
import { useEffectTrigger } from '../use-effect-trigger';

export function useClickOutside<T extends ElementOrRef>(
  element: T,
  effect: EffectCallback,
  deps?: DependencyList,
): void;

export function useClickOutside<T extends ElementOrRef>(
  elements: T[],
  effect: EffectCallback,
  deps?: DependencyList,
): void;

export function useClickOutside(
  elements: ElementOrRef | ElementOrRef[],
  effect: EffectCallback,
  deps: DependencyList = [],
): void {
  const elList = Array.isArray(elements) ? elements : [elements];
  const triggerClickOutside = useEffectTrigger(effect, deps);
  const addWindowListener = useDomEventListeners(CAN_USE_DOM ? window : null);

  addWindowListener('click', (e) => {
    const shouldTriggerEffect = elList.every((el) => {
      const resolvedElement = resolveElement(el);
      return !!resolvedElement && !resolvedElement.contains(e.target as Node);
    });

    if (shouldTriggerEffect) {
      triggerClickOutside();
    }
  });
}
