import { invitation } from "../config/invitation";
import { asset } from "../lib/asset";
import { getDateParts } from "../lib/event";
import { ArchFrame, FloralCorner, LeafBranch, Mandala, Paisley } from "./decor";
import { SmartImage } from "./SmartImage";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function Ornaments() {
  return (
    <>
      <FloralCorner corner="top-left" className="hero__floral hero__floral--tl" />
      <FloralCorner corner="bottom-right" className="hero__floral hero__floral--br" />
      <Paisley className="hero__paisley hero__paisley--l" />
      <Paisley className="hero__paisley hero__paisley--r" />
    </>
  );
}

function ScrollCue() {
  return (
    <a href="#families" className="scroll-cue" aria-label="Scroll to explore the invitation">
      <span>Scroll to explore</span>
      <span className="scroll-cue__line" aria-hidden="true" />
    </a>
  );
}

/** The names, ceremony and date — shared by both layouts. */
function HeroText() {
  const { bride, groom, event } = invitation;
  const date = getDateParts();
  return (
    <>
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
    </>
  );
}

export function HeroSection() {
  const { bride, groom, hero } = invitation;

  // With a couple photo: text beside the arched photo
  if (hero.image) {
    return (
      <section id="home" className="hero" aria-labelledby="hero-title">
        <div className="hero__inner container">
          <div className="hero__text">
            <HeroText />
          </div>
          <div className="hero__visual">
            <Ornaments />
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
        <ScrollCue />
      </section>
    );
  }

  // No photo: the names themselves sit inside the arch, centred like a printed card
  return (
    <section id="home" className="hero hero--card" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__visual">
          <Ornaments />
          <ArchFrame className="hero__arch">
            <div className="hero-card">
              <Mandala className="hero-card__mandala" />
              <div className="hero-card__text">
                {hero.emblem && (
                  <img
                    src={asset(hero.emblem)}
                    alt="Shri Ganesh"
                    className="hero-card__emblem"
                    data-reveal
                    decoding="async"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <HeroText />
              </div>
            </div>
          </ArchFrame>
          <LeafBranch className="hero__branch" />
        </div>
        <ScrollCue />
      </div>
    </section>
  );
}
