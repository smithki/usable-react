# ⚓️ `usable-react`

[![code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat)](https://github.com/airbnb/javascript)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

> Basic React hooks to get any project off the ground.

## 🔗 Installation

Install via `yarn`:

```sh
yarn add usable-react

# or, install hooks individually:
yarn add @usable-react/use-compare
yarn add @usable-react/use-debounced
# ...and so on :)
```

Install via `npm`:

```sh
npm install usable-react

# or, install hooks individually:
npm install @usable-react/use-dom-event
npm install @usable-react/use-force-update
# ...and so on :)
```

## Hooks

`usable-react` is managed as a monorepo so that hooks can be used collectively, or optimized as separate dependencies.

| Package Name | Description |
| ------------ | ----------- |
| [`usable-react`](./packages/usable-react) | A package containing all the hooks! |
| [`@usable-react/use-compare`](./packages/use-compare) | Check if a value has changed since the last render. |
| [`@usable-react/use-debounced`](./packages/use-debounced) | Debounce an incoming change to the given value. |
| [`@usable-react/use-deferred-children`](./packages/use-deferred-children) | Get a copy of the given React `children`, deferred to the next update. |
| [`@usable-react/use-dom-event`](./packages/use-dom-event) | Create event listeners outside the React lifecycle for a given DOM element. |
| [`@usable-react/use-effect-after-mount`](./packages/use-effect-after-mount) | Just like `useEffect`, but only executes _after_ mounting! |
| [`@usable-react/use-effect-trigger`](./packages/use-effect-trigger) | An effect you can trigger with a function call! |
| [`@usable-react/use-filter`](./packages/use-filter) | Perform a fuzzy search on a dataset using [`fuse.js`](https://github.com/krisk/fuse). |
| [`@usable-react/use-force-update`](./packages/use-force-update) | Force a component to re-render. |
| [`@usable-react/use-hash`](./packages/use-hash) | Get the MD5 hash of an arbitrary object (based on [`object-hash`](https://github.com/puleos/object-hash)). |
| [`@usable-react/use-hash-compare`](./packages/use-hash-compare) | Just like `useCompare`, but using the value's MD5 hash. |
| [`@usable-react/use-initial-render`](./packages/use-initial-render) | Just like `useEffect`, but only executes on a component's initial render. |
| [`@usable-react/use-interval`](./packages/use-interval) | Execute an effect on an interval (with automatic cleanup). |
| [`@usable-react/use-previous`](./packages/use-previous) | Returns the previous value of the given source. |
| [`@usable-react/use-timer`](./packages/use-timer) | Contains several hooks to easily create timers within the React lifecycle. |

## Contributing

`usable-react` is at an early stage of development, so contributing is a great way to both move the project forward and have your ideas represented! Here are some steps to open a PR:

1. Fork it!
2. Create a branch based off `development` named with a package directory (or directories), leading label, and a descriptive title:
    - `{package}/{label}/{descriptive title}`
    - For features: `usable-react/feature/my-brand-spankin-new-thing` or `use-hash/feature/my-brand-spankin-new-thing`
    - For bug fixes: `usable-react/fix/my-bug-fix` or something like `use-timer/fix/my-bug-fix`
3. Set up your local development environment:
    1. `yarn install`
    2. `yarn bootstrap`
    3. `PKG=$PACKAGE_TARGET yarn dev`
3. Make your changes! Commit early and often and [write good commit messages](https://chris.beams.io/posts/git-commit/).
4. Open a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) so that a core contributor (probably [@smithki](https://github.com/smithki)) can review the code and merge your changes!

As aforementioned, this project is still taking shape :baby: More formal contributor processes will undoubtedly be added over time according to the project's needs!

## Development Scripts

| NPM Script | Usage | Description |
| ---------- | ----- | ----------- |
| `bootstrap` | `yarn bootstrap` | Install dependencies/set up a local development environment. |
| `exec` | `PKG=$PACKAGE_TARGET yarn exec -- ...` | Execute commands in the specified package. |
| `dev` | `PKG=$PACKAGE_TARGET yarn dev` | Start the specified package in development mode, or all packages if `$PKG` is omitted. |
| `build` | `PKG=$PACKAGE_TARGET yarn build` | Build the specified package for production, or all packages if `$PKG` is omitted. |
| `clean` | `PKG=$PACKAGE_TARGET yarn clean` | Run cleaning scripts for the specified package (NOTE: removes `node_modules`), or all packages if `$PKG` is omitted. |
| `lint` | `PKG=$PACKAGE_TARGET yarn lint` | Run the linter for the specified package, or all packages if `$PKG` is omitted. |
| `test` | `PKG=$PACKAGE_TARGET yarn test` | Run tests for the specified package, or all packages if `$PKG` is omitted. |
| `release` | `yarn release` | Publishes all packages with unreleased versions. |
| `release_canary` | `yarn release_canary` | Publishes pre-release versions for all packages. |

