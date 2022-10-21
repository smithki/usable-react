# `useTimer`

Creates a timer that works inside the React component lifecycle. A timer can be configured with a total `length` (in milliseconds), a `tick` value  (in milliseconds) representing the frequency a timer state updates, and an `autoStart` boolean value indicating whether to immediately initiate the countdown. Returns a `Timer` object with the following fields:

- `start`: A callback function which starts the timer ticking. If the timer is currently in a paused state, then it will resume based on the original, remaining length.
- `pause`: A callback function which pauses the timer. This function has no effect if the timer has not yet started ticking.
- `resume`: A callback function which resumes the timer from a paused state. This function has no effect if the timer has not yet started ticking.
- `restart`: A callback function which restarts the timer. An updated timer length and tick value can be provided as arguments.
- `getRemaining`: A callback function which returns the amount of time (in milliseconds) remaining in the timer. If the timer is idle, this function returns `0`.
- `getTickCount`: A callback function returning the number of ticks that have accumulated since the start of the currently-running timer
- `getStatus`: A callback function returning a string enum indicating the current timer state (one of: `"idle"`, `"running"`, `"paused"`, or `"expired"`).
- `key`: A static value that updates whenever the underlying timer state changes. You can give this value to the dependency list `React.useEffect` to trigger an effect.

The `useTimer` module also exports additional utility hooks to integrate with timers:

- `useTimerTick`: Executes a side-effect each time the supplied timer "ticks".
- `useTimerExpire`: Executes a side-effect when the supplied timer finishes its countdown.

## Examples

```tsx
const timer = useTimer({
  length: 5000, // 5 seconds, represented as milliseconds
  tick: 1000, // Check the timer progress every 1 seconds
  autoStart: true, // Whether to start the countdown immediately
});
```

```tsx
const timer = useTimer({ ..., tick: 1000 });

useTimerTick(timer, () => {
  // logs every 1 second!
  console.log('tick tock tick tock');
});
```

```tsx
const timer = useTimer({ ..., length: 5000 });

useTimerExpire(timer, () => {
  // logs after 5 seconds!
  console.log('ding ding ding!');
});
```


