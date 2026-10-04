import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: Date): TimeLeft {
  const ms = Math.max(0, target.getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  };
}

export function useCountdown(target: Date | null): TimeLeft | null {
  const [left, setLeft] = useState(() => (target ? diff(target) : null));
  useEffect(() => {
    if (!target) return;
    const tick = () => setLeft(diff(target));
    tick();
    const id = window.setInterval(tick, 1000);
    // Re-sync when the tab becomes visible again (timers are throttled in background tabs)
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [target]);
  return left;
}
