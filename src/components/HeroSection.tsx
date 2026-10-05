import { invitation } from "../config/invitation";
import { getDateParts } from "../lib/event";
import { ArchFrame, FloralCorner, LeafBranch, Paisley } from "./decor";
import { SmartImage } from "./SmartImage";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function HeroSection() {
  const { bride, groom, event, hero } = invitation;
  const date = getDateParts();

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__text">
          <p className="deva hero__deva" lang="hi" data-reveal>
            ॥ शुभ सगाई ॥
          </p>
          <h2 id="hero-title" className="hero__names">
            <span className="hero__name" data-reveal style={d(120)}>
              {bride.name}
            </span>
            <span className="amp-row" data-reveal style={d(240)} aria-label="and">
              <span className="amp-line" aria-hidden="true" />
              <span className="amp" aria-hidden="true">
                &amp;
              </span>
              <span className="amp-line" aria-hidden="true" />
            </span>
            <span className="hero__name" data-reveal style={d(340)}>
              {groom.name}
            </span>
          </h2>
          <p className="hero__ceremony" data-reveal style={d(460)}>
            {event.title}
          </p>

          <p className="hero__date" data-reveal style={d(560)}>
            {date.dayNumber} <span aria-hidden="true">·</span> {date.month} <span aria-hidden="true">·</span> {date.year}
          </p>
        </div>

        <div className="hero__visual">
          <FloralCorner corner="top-left" className="hero__floral hero__floral--tl" />
          <FloralCorner corner="bottom-right" className="hero__floral hero__floral--br" />
          <Paisley className="hero__paisley hero__paisley--l" />
          <Paisley className="hero__paisley hero__paisley--r" />
          <ArchFrame className="hero__arch">
            <div className="hero__photo">
              <SmartImage
                src={hero.image}
                position={hero.imagePosition}
                alt={`${bride.name} and ${groom.name}`}
                label="The couple"
                priority
                sizes="(min-width: 1024px) 460px, 80vw"
              />
            </div>
          </ArchFrame>
          <LeafBranch className="hero__branch" />
        </div>
      </div>

      <a href="#families" className="scroll-cue" aria-label="Scroll to explore the invitation">
        <span>Scroll to explore</span>
        <span className="scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  );
}
