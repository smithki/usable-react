# `useInterval`

Executes a side-effect on an interval (represented as milliseconds). The default interval is 1000ms.

## Example

```tsx
useInterval(() => {
  console.log('it has been 1000ms since the last time this was logged!');
}, [/* effect dependencies */], 1000);
```
