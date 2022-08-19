# `useIntersectionObserver`

Creates an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to measure when a given ref element enters the viewport.

## Example

```tsx
const ref = useRef(null);

useIntersectionObserver({
  ref
  threshold: [0, 1],
  handleEntry: (entry) => {
    if ((entry?.isIntersecting) {
      // do something upon intersection!
    }
  },
}, [/* effect dependencies */]);

<div ref={ref}>Watch me with IntersectionObserver</div>
```
