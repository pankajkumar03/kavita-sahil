import { invitation } from "../config/invitation";
import { ArchFrame, FloralCorner, GoldDivider, Mandala } from "./decor";
import { SmartImage } from "./SmartImage";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

interface Person {
  name: string;
  image: string;
  relation: string;
  parents: string;
  familyName: string;
}

/** "Mr. A B & Mrs. C D" stacks as name / & / name; "Mr. & Mrs. X" stays on one line. */
function Parents({ text }: { text: string }) {
  const parts = text.split(" & ");
  const stack = parts.length === 2 && parts.every((p) => p.trim().includes(" "));
  if (!stack) return <p className="family-col__parents">{text}</p>;
  return (
    <p className="family-col__parents">
      <span className="block">{parts[0]}</span>
      <span className="family-col__and">&amp;</span>
      <span className="block">{parts[1]}</span>
    </p>
  );
}

/** One side of the card: portrait, name, and the family they come from. */
function FamilyColumn({ person, role, delay }: { person: Person; role: "Bride" | "Groom"; delay: number }) {
  return (
    <article className="family-col" data-reveal style={d(delay)}>
      <ArchFrame className="family-col__arch">
        <SmartImage
          src={person.image}
          alt={`${person.name}, the ${role.toLowerCase()}`}
          label={`${role}'s portrait`}
          sizes="(min-width: 768px) 260px, 38vw"
        />
      </ArchFrame>
      <h3 className="family-col__name">{person.name}</h3>
      <p className="family-col__role">The {role}</p>
      <GoldDivider variant="diamond" className="family-col__divider" />
      <p className="family-col__relation">{person.relation}</p>
      <Parents text={person.parents} />
      <p className="family-col__family">({person.familyName})</p>
    </article>
  );
}

export function FamilyBlessings() {
  const { bride, groom, text } = invitation;
  return (
    <section id="families" className="section families" aria-labelledby="families-title">
      <FloralCorner corner="top-left" className="section-floral section-floral--tl" />
      <FloralCorner corner="bottom-right" className="section-floral section-floral--br" />
      <div className="container">
        <header className="section-heading">
          <p className="deva families__deva" lang="hi" data-reveal>
            शुभ आशीर्वाद
          </p>
          <h2 id="families-title" className="section-title section-title--caps" data-reveal style={d(80)}>
            With the blessings of our families
          </h2>
          <p className="families__intro" data-reveal style={d(160)}>
            Together with the love and blessings of our families, we invite you to celebrate the engagement of
          </p>
        </header>

        <div className="families__row">
          <FamilyColumn person={bride} role="Bride" delay={120} />
          <div className="families__amp" data-reveal style={d(220)} aria-hidden="true">
            <Mandala className="families__mandala" />
            <span className="amp">&amp;</span>
          </div>
          <FamilyColumn person={groom} role="Groom" delay={320} />
        </div>

        <p className="families__tagline" data-reveal style={d(200)}>
          {text.tagline}
        </p>
      </div>
    </section>
  );
}
