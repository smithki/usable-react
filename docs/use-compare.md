# `useCompare`

Tracks the value of the given argument from a previous render, then returns a boolean indicating whether that value has changed based on a strict equality check.

## Example

```tsx
const [state, setState] = useState();

const didStateChangeSinceLastRender = useCompare(state);
// => true | false
```
