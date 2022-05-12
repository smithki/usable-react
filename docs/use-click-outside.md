# `useClickOutside`

Execute a side-effect when the pointer clicks outside a list of given elements or element refs.

## Examples

```tsx
const ref = useRef<HTMLDivElement>(null);

useClickOutside(ref, () => {
  console.log('ref was *not* clicked!');
}, [/* effect dependencies */]);

return <div ref={ref}>yolo</div>
```

```tsx
useClickOutside(window.getElementById('carpe-diem'), () => {
  console.log('element was *not* clicked!');
}, [/* effect dependencies */]);

// Somewhere in the DOM...
<div id="carpe-diem">yolo</div>
```
