# `useConst`

Returns a constant value over the lifecycle of a component.

## Example

```tsx
const [count, setCount] = useState(123);
const initialState = useConst(state);

useEffect(() => {
  console.log(initialState);
  // => 123 (always — even after invoking setCount)
}, [count])

<button onClick={() => setState((curr) => curr + 1))}>Click me to increment: {count}</button>
```
