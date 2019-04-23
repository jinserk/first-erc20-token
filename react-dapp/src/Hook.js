/* https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
import { useState, useEffect, useRef } from 'react';

export function useSafeEffect(callback, deps) {
  useEffect(() => {
    let canceled = false;
    if (!canceled) return callback();
    return () => {
      canceled = true;
    }
  }, deps);
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function usePromise(promiseCreator, deps) {
  const [resolved, setResolved] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const process = async () => {
    setLoading(true);
    try {
      const result = await promiseCreator();
      setResolved(result);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e);
      setResolved(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
  }, deps);

  return [loading, resolved, error];
}
