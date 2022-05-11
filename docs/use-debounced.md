# `useDebounced`

Debounces the given value by a delay (represented in milliseconds). If delay is `0`, then the value is returned synchronously. The default delay is 300ms.

## Example

```tsx
const [state, setState] = useState();

// Debounce `state` by 500ms.
const debouncedState = useDebounced(state, 500);
```
