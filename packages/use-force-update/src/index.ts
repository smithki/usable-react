import { useCallback, useState } from 'react';

/**
 * Returns a function that forces a local component re-render when invoked.
 */
export function useForceUpdate() {
  const [trigger, setTrigger] = useState(0);
  return useCallback(() => setTrigger(trigger + 1), [trigger]);
}
