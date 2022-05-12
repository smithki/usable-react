
# `useAsyncEffect`

Enables asynchronous effects with some guardrails to protect against memory-leaks if your asynchronous business resolves _after_ the React component has unmounted.

## Example

```tsx
useAsyncEffect(async (ctx) => {
  ctx.hello = 'world'; // Attach anything you like to the context object!
  return fetch('...').then(res => res.json());
}, [/* effect dependencies */])
.fulfilled((value, ctx) => {
    // Equivalent to `Promise.then`
    console.log(value); // Do something with your JSON!
    console.log(ctx.hello) // => 'world'
  })
.rejected((reason, ctx) => {
    // Equivalent to `Promise.catch`
    // ...
  })
.settled((ctx) => {
    // Equivalent to `Promise.finally`
    // ...
  })
.cleanup((ctx) => {
  // Defines the same behavior as a function returned by `useEffect`
  // ...
});
```
