# `useMeasurement`

A set of hooks for gleaning arbitrary measurements from DOM elements.

- `useMeasurement` allows the consumer to get any arbitrary measurement from the ref element.
- `useElementHeight` and `useElementWidth` provide shortcuts to `offsetHeight` and `offsetWidth`, respectively.

## Example

```tsx
const ref = useRef(null);

const scrollHeight = useMeasurement({
  ref,
  getMeasurement: (element) => element.scrollHeight,
  defaultValue: 0,
});

<div ref={ref}>Measure me!</div>
```

```tsx
const ref = useRef(null);
const divHeight = useElementHeight(ref);
<div ref={ref}>I'm {divHeight} pixels tall!</div>
```

```tsx
const ref = useRef(null);
const divHeight = useElementWidth(ref);
<div ref={ref}>I'm {divWidth} pixels wide!</div>
```
