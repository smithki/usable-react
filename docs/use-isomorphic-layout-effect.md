# `useIsomorphicLayoutEffect`

Same as React's `useLayoutEffect`, except that it will only attempt to run client-side (thus silencing React's warning against `useLayoutEffect` during server-side rendering).

## Example

```tsx
useIsomorphicLayoutEffect({
  // do something synchronous!
}, [/* effect dependencies */]);
```
