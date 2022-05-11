# `useHashCompare`

Tracks the hashed value of a given argument (using [`useHash`](./use-hash.md)) from a previous render, then returns a boolean indicating whether the hash has changed.

## Example

```tsx
const someDerivedState = { /* a complex, deeply-nested, non-memoized object */ };

const hashDidChange = useHashCompare(someDerivedState);
// => true | false
```
