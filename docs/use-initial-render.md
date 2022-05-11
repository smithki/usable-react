# `useInitialRender`

Returns a `boolean` indicating whether this render tick is the initial one.

## Example

```tsx
const isInitialRender = useInitialRender();

useEffect(() => {
  if (isInitialRender) {
    console.log('this is the first render for this component');
  }
}, [/* effect dependencies */]);
```
