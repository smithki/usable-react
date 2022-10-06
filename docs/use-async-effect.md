
# `useAsyncEffect`

Enables asynchronous effects with some guardrails to protect against memory-leaks if your asynchronous business resolves _after_ the React component has unmounted.

## Example

```tsx
useAsyncEffect({
  execute: async (signal) => {
    return fetch('...', { signal }).then(res => res.json());
  },

  onFulfilled: (value) => {
    // Equivalent to `Promise.then`
    console.log(value); // Do something stateful with your JSON!
  },

  onRejected: (reason) => {
    // Equivalent to `Promise.catch`
    // ...
  },

  onSettled: () => {
    // Equivalent to `Promise.finally`
    // ...
  },

  onCleanup: () => {
    // Defines the same behavior as a function returned by `useEffect`
    // ...
  },
}, [/* effect dependencies */]);

// You can optionally pass a factory function to create the initialization object.
// This is handy if you want to share some context between async callbacks.
useAsyncEffect(() => {
  const context = {
    hello: 'world',
  };

  return {
    execute: async () => { ... },
    onFulfilled: () => { ... },
    onRejected: () => { ... },
    onSettled: () => { ... },
    onCleanup: () => { ... },
  }
})
```
