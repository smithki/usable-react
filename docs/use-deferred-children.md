# `useDeferredChildren`

Saves a copy of `children` given to a component, deferred to the next render tick. This can be useful if your component requires some element or state to be present in the DOM before rendering a particular React tree.

## Example

```tsx
const deferredChildren = useDeferredChildren(props.children);

// `deferredChildren` are always 1 render tick "behind" schedule.
return <div>{deferredChildren}</div>
```
