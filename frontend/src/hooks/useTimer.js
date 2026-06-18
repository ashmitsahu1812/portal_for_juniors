import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer — countdown timer hook for quizzes.
 * @param {number} durationSeconds  Total seconds to count down from.
 * @param {function} onExpire       Callback fired when timer hits 0.
 */
export function useTimer(durationSeconds, onExpire) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onExpire]);

  const formatted = {
    minutes: String(Math.floor(remaining / 60)).padStart(2, '0'),
    seconds: String(remaining % 60).padStart(2, '0'),
  };

  const percentLeft = Math.round((remaining / durationSeconds) * 100);

  return { remaining, formatted, percentLeft, isRunning, start, pause, reset };
}
