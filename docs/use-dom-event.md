# `useDomEvent`

Allows your React component to hook into native DOM events that exist outside the component lifecycle. You can provide an HTML element, `window`, `document` or React ref object to serve as the event target.

## Examples

```tsx
const addWindowEvent = useDomEvent(window);

addWindowEvent('click', () => {
  console.log('window was clicked!');
}, [/* effect dependencies */]);
```

```tsx
const ref = useRef<HTMLDivElement>(null);
const addRefEvent = useDomEvent(ref);

addRefEvent('click', () => {
  console.log('ref was clicked!');
}, [/* effect dependencies */]);

return <div ref={ref}>yolo</div>
```
