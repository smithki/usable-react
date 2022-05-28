# `useEffectAfterMount`

Same as React's `useEffect`, except that it will skip the initial render.

## Example

```tsx
useEffectAfterMount(() => {
  console.log('doot doot doot!')
}, [/* effect dependencies */]);
```
