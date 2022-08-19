# `useMicrotaskEffect`

Schedules an effect with [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask).

## Example

```tsx
useMicrotaskEffect(() => {
  console.log('doot doot doot!')
}, [/* effect dependencies */]);
```
