# `useFilter`

A hook-ified API wrapping [Fuse.js](https://fusejs.io) to fuzzy-search arbitrary data.

## Example

```tsx
const filteredData = useFilter({
  needle: 'my search term',
  haystack: [/* arbitrary source data */],
  debounce: 0, // So you can debounce the (perhaps costly) fuzzy filter operation.
  searchOptions: { /* fuse.js options -> see https://fusejs.io/ */ },
});
```
