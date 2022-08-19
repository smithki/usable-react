# `useResizeObserver`

Creates a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) to run an effect anytime the content of a given ref element's dimensions change.

## Example

```tsx
const ref = useRef(null);

useResizeObserver(
  ref,
  () => console.log('resized!'),
  [/* effect dependencies */],
);

<div ref={ref}>Watch me with ResizeObserver</div>
```
