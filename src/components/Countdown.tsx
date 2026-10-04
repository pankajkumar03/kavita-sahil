import { useMemo } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { getEventStart } from "../lib/event";
import { FloralCorner, GoldDivider } from "./decor";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function Unit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="count-tile" data-reveal style={d(delay)}>
      <span className="count-tile__value" aria-hidden="true">
        {/* keyed so each new value runs the fade-up transition */}
        <span key={text} className="count-tile__digit">
          {text}
        </span>
      </span>
      <span className="count-tile__label">{label}</span>
    </div>
  );
}

export function Countdown() {
  const target = useMemo(() => getEventStart(), []);
  const left = useCountdown(target);
  if (!left) return null; // invalid date in config — hide rather than show nonsense

  return (
    <section className="section countdown" aria-labelledby="countdown-title">
      <FloralCorner corner="top-right" className="section-floral section-floral--tr" />
      <div className="container">
        <header className="section-heading">
          <h2 id="countdown-title" className="section-title section-title--caps" data-reveal>
            {left.done ? "The celebration has begun" : "Counting down to the day"}
          </h2>
          <div data-reveal style={d(100)}>
            <GoldDivider variant="diamond" />
          </div>
        </header>

        {left.done ? (
          <p className="countdown__done" data-reveal>
            Thank you for your blessings — we're so glad you're part of this day.
          </p>
        ) : (
          <>
            <div className="countdown__grid">
              <Unit value={left.days} label="Days" delay={80} />
              <Unit value={left.hours} label="Hours" delay={180} />
              <Unit value={left.minutes} label="Minutes" delay={280} />
              <Unit value={left.seconds} label="Seconds" delay={380} />
            </div>
            {/* Announce once per minute-ish, not every second */}
            <p className="sr-only" aria-live="off">
              {left.days} days, {left.hours} hours and {left.minutes} minutes to go.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
