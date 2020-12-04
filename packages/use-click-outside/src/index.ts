import { EffectCallback, DependencyList } from 'react';
import { useDomEvent } from '@usable-react/use-dom-event';
import { useEffectTrigger } from '@usable-react/use-effect-trigger';

export function useClickOutside(element: HTMLElement | null, effect: EffectCallback, deps?: DependencyList): void;
export function useClickOutside(elements: (HTMLElement | null)[], effect: EffectCallback, deps?: DependencyList): void;
export function useClickOutside(
  elements: HTMLElement | null | (HTMLElement | null)[],
  effect: EffectCallback,
  deps: DependencyList = [],
): void {
  const elList = Array.isArray(elements) ? elements : [elements];
  const triggerClickOutside = useEffectTrigger(effect, deps);

  const addWindowListener = useDomEvent(window);
  addWindowListener('click', (e) => {
    if (elList.every((el) => !!el && !el.contains(e.target as any))) triggerClickOutside();
  });
}
