import { EffectCallback, DependencyList, MutableRefObject, RefObject } from 'react';
import { CAN_USE_DOM } from '../../utils/can-use-dom';
import { isElement, isRefObject } from '../../utils/instance-of';
import { useDomEvent } from '../use-dom-event';
import { useEffectTrigger } from '../use-effect-trigger';

type ElementOrRef = Node | MutableRefObject<Node> | RefObject<Node> | null;

export function useClickOutside(element: ElementOrRef, effect: EffectCallback, deps?: DependencyList): void;
export function useClickOutside(elements: ElementOrRef[], effect: EffectCallback, deps?: DependencyList): void;
export function useClickOutside(
  elements: ElementOrRef | ElementOrRef[],
  effect: EffectCallback,
  deps: DependencyList = [],
): void {
  const elList = Array.isArray(elements) ? elements : [elements];
  const triggerClickOutside = useEffectTrigger(effect, deps);
  const addWindowListener = useDomEvent(CAN_USE_DOM ? window : null);

  addWindowListener('click', (e) => {
    const shouldTriggerEffect = elList.every((el) => {
      if (isElement(el)) {
        return !!el && !el.contains(e.target as any);
      }

      if (isRefObject<Node>(el)) {
        return !!el.current && !el.current.contains(e.target as any);
      }

      return false;
    });

    if (shouldTriggerEffect) {
      triggerClickOutside();
    }
  });
}
