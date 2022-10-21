# `useCallbackConst`

Creates a callback with a constant value over the lifecycle of a component.

## Example

```tsx
const immutableCallback = useCallbackConst(() => {
  console.log(
    `I don't have any local state dependencies
    and I won't trigger unncessary re-renders.`
  );
});

<button onClick={immutableCallback}>Click me to increment: {count}</button>
```
