import { useCallback, useEffect, useRef, useState } from "react";

interface Countdown {
  remaining: number;
  fraction: number;
  running: boolean;
  start: () => void;
  pause: () => void;
}

export function useCountdown(durationSec: number, onExpire?: () => void): Countdown {
  const [remaining, setRemaining] = useState(durationSec);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef(0);
  const rafRef = useRef<number>();
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const stopRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
  };

  const loop = useCallback(() => {
    const left = Math.max(0, (endAtRef.current - performance.now()) / 1000);
    setRemaining(left);
    if (left <= 0) {
      setRunning(false);
      stopRaf();
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(() => {
    expiredRef.current = false;
    endAtRef.current = performance.now() + durationSec * 1000;
    setRemaining(durationSec);
    setRunning(true);
    stopRaf();
    rafRef.current = requestAnimationFrame(loop);
  }, [durationSec, loop]);

  const pause = useCallback(() => {
    setRunning(false);
    stopRaf();
  }, []);

  useEffect(() => stopRaf, []);

  return {
    remaining,
    fraction: durationSec > 0 ? Math.max(0, Math.min(1, remaining / durationSec)) : 0,
    running,
    start,
    pause,
  };
}
