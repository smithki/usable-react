# `useForceUpdate`

Returns a callback function that forcibly re-renders its component. The returned function is guaranteed to be up-to-date in the component lifecycle, so it doesn't need to be given as a dependency to `useEffect` (comparable to the state dispatcher returned by `useState`). You can, however, provide the `.key` field to a React dependency array to trigger effects as a result of invoking the callback.

## Example

```tsx
const forceUpdate = useForceUpdate();

// Somewhere in the component...
forceUpdate(); // re-render!

// Somewhere else in the component...
// Trigger an effect using `forceUpdate`.
useEffect(() => {
  ...
}, [forceUpdate.key]);
```
