# `useEffectTrigger`

Registers a side effect with the same signature as React's `useEffect`, but the effect will only execute when the manual trigger function returned by this hook is invoked.

A few use-cases for this hook include:

1. Deferring an effect to the next render tick.
2. Sequencing asynchronous effects.
3. Executing an effect after marshalling arbitrary state/data required for
   the effect to proceed.

This hook is a bit esoteric, so it helps to see how it can be used in context. For reference, `usable-react` makes use of this hook internally within [`useDebouncedEffect`](../src/hooks/use-debounced-effect/index.ts) and [`useInterval`](../src/hooks/use-interval/index.ts).

```tsx
const triggerEffect = useEffectTrigger(() => {
  // ...
}, [/* effect dependencies */]);

// Somewhere else in the component...
triggerEffect();
```
