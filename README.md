# ⚓️ `usable-react`

[![code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat)](https://github.com/airbnb/javascript)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

> Basic React hooks to get any project off the ground.

## 🔗 Installation

Install via `yarn`:

```sh
yarn add usable-react
```

Install via `npm`:

```sh
npm install usable-react
```

## Usage

### `useAsyncEffect`

Enables safe usage of asynchronous effects with automatic protection against memory-leaks should your asynchronous business resolve after a component has unmounted.

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

