# `useCallbackRef`

Converts a callback to a ref to avoid triggering re-renders when passed as a
prop or avoid re-executing effects when passed as a dependency.

Returns a new callback with a constant value over the lifecycle of a component.

## Example

```tsx
const [state, setState] = useState(0);

const logState = useCallbackRef(() => {
  console.log('state:', state);
});

useEffect(() => {
  logState();
  // => "state: 1"
  // => "state: 2"
  // => "state: 3"
  // => "state: 4"
  // => ...
}, [state]);

<button onClick={() => setState((curr) => curr + 1)}>Click me to increment: {count}</button>
```
