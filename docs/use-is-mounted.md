# `useIsMounted`

Returns a callback function that returns a `boolean` when called indicating if the current component is still mounted. This is useful for gatekeeping code paths that would set local component state after asynchronous behavior.

## Example

```tsx
const [state, setState] = useState();
const isMounted = useIsMounted();

useEffect(() => {
  someAsyncThing().then(() => {
    if (isMounted()) {
      setState(/* ... */);
    }
  });
}, [/* effect dependencies */]);
```
