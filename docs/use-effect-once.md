# `useEffectOnce`

Same as React's `useEffect`, except that it will only run on the the initial render (even in React >=v18).

## Example

```tsx
useEffectOnce(() => {
  console.log('doot doot doot!')
});
```
