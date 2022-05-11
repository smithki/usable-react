# `useClipboard`

Returns a void, asynchronous `copy` function that when called with a string or `Event`, will copy the text value of its argument to the user's clipboard. A `ref` is also provided in the result, which can optionally be attached to an `<input>` element, from which the `copy` function will derive text content as a fallback. As an argument to the `useClipboard` itself, you can provide an optional `onCopy` handler which will invoke any time a `copy` event is successful.

## Examples

```tsx
const { copy } = useClipboard();

await copy('hello world');
```

```tsx
const { copy, ref } = useClipboard(() => {
  console.log('Successfully copied content from ref!');
});

return <>
  <input type="text" ref={ref} />
  <button onClick={() => copy()}>Copy to clipboard</button>
</>;
```
