import { useEffect, useRef } from "react";
import { invitation } from "../config/invitation";
import { burstPetals } from "./PetalShower";
import { Diya, FloralCorner, GoldDivider, HaveliSkyline } from "./decor";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function FinalSection() {
  const { bride, groom } = invitation;
  const ref = useRef<HTMLElement>(null);

  // A last shower of petals as the guest reaches the closing blessing (once)
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          burstPetals(50);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="section final" aria-labelledby="final-title">
      <FloralCorner corner="top-left" className="final__floral" />
      <FloralCorner corner="top-right" className="final__floral" />
      <HaveliSkyline className="final__skyline" />
      <div className="container container--narrow final__inner">
        <p className="eyebrow" id="final-title" data-reveal>
          With love and blessings
        </p>
        <p className="final__names" data-reveal style={d(120)}>
          <span>{bride.name}</span>
          <span className="amp" aria-label="and">
            &amp;
          </span>
          <span>{groom.name}</span>
        </p>
        <p className="final__thanks" data-reveal style={d(240)}>
          Thank you for being a part of this beautiful beginning.
        </p>
        <div data-reveal style={d(320)}>
          <Diya className="final__diya" />
        </div>
        <div data-reveal style={d(460)}>
          <GoldDivider variant="lotus" />
        </div>
      </div>
    </section>
  );
}
