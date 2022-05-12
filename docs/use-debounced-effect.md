# `useDebouncedEffect`

Executes a side-effect based on its dependency array, but debounced by a given delay (represented as milliseconds). If delay is `0`, then the effect is executed synchronously. The default delay is 0ms.

## Example

```tsx
const [state, setState] = useState();

useDebouncedEffect(() => {
  console.log('I am executed 500ms after `state` updates');
}, 500, [state]);

// Somewhere in the component...
setState('y0lo');
```
