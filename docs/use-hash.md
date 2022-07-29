# `useHash`

Returns an MD5-compliant hash of any value given to this hook as its argument. Most client-side structures are hashable based on their serialized contents. This is handy for translating complex objects into a primitive string value for accurately detecting updates between renders as a dependency provided to `useEffect`.

## Example

```tsx
const someDerivedState = { /* a complex, deeply-nested, non-memoized object */ };

const hash = useHash(someDerivedState);

useEffect(() => {
  console.log(
    "executes when `someDerivedState` updates, even though it isn't memoized."
  );
}, [hash])
```
