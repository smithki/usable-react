# `useTimer`

Creates a timer that works inside the React component lifecycle. A timer can be configured with a total `length` (in milliseconds), a `tick` value  (in milliseconds) representing the frequency a timer state updates, and an `autoStart` boolean value indicating whether to immediately initiate the countdown. Returns a `Timer` object with the following fields:

- `start`: A callback function which starts a timer from scratch.
- `pause`: A callback function which pauses the timer. This function has no effect if the timer has not yet started.
- `resume`: A callback function which resumes the timer from a paused state. This function has no effect if the timer has not yet started.
- `reset`: A callback function which resets the timer. An updated timer length and tick value can be provided as arguments. You will need to call `Timer.start()` to restart the countdown.
- `getRemaining`: A callback function returning the amount of time (in milliseconds) remaining in the timer.
- `getLength`: A callback function returning the total expected length of the timer (in milliseconds).
- `isRunning`: A callback function returning a `boolean` indicating whether the timer is currently running.
- `key`: A static value that updates whenever the timer state changes. You can provide this value to a `useEffect` dependency list to trigger effects.

The `useTimer` module also exports additional utility hooks to integrate with timers:

- `useTimerEffect`: Executes a side-effect each time the supplied timer "ticks".
- `useTimerComplete`: Executes a side-effect when the supplied timer finishes its countdown.

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

useTimerEffect(timer, () => {
  // logs every 1 second!
  console.log('tick tock tick tock');
}, [/* effect dependencies */]);
```

```tsx
const timer = useTimer({ ..., length: 5000 });

useTimerComplete(timer, () => {
  // logs after 5 seconds!
  console.log('ding ding ding!');
}, [/* effect dependencies */]);
```


