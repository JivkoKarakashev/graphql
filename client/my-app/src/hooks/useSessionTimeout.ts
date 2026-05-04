import { useEffect, useRef, useCallback } from 'react';

interface SessionTimeoutOptions {
  accessToken: string | null;
  tokenTtlMs: number;          // how long the access token lives (15 min)
  warningBeforeMs: number;     // show warning X ms before expiry (2 min)
  onWarning: () => void;       // show the modal
  onExpired: () => void;       // force logout
}

const useSessionTimeout = ({ accessToken, tokenTtlMs, warningBeforeMs, onWarning, onExpired, }: SessionTimeoutOptions) => {
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiredTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }
    if (expiredTimer.current) {
      clearTimeout(expiredTimer.current);
    }
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();

    // Show warning 2 minutes before expiry
    warningTimer.current = setTimeout(() => {
      onWarning();
    }, tokenTtlMs - warningBeforeMs);

    // Force logout at expiry
    expiredTimer.current = setTimeout(() => {
      onExpired();
    }, tokenTtlMs);
  }, [tokenTtlMs, warningBeforeMs, onWarning, onExpired, clearTimers]);

  useEffect(() => {
    if (accessToken) {
      startTimers();
    } else {
      clearTimers();
    }
    return clearTimers;
  }, [accessToken]); // restart timers whenever token changes (after refresh)

  return { resetTimers: startTimers, clearTimers };
};

export default useSessionTimeout;