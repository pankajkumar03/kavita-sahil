import { invitation } from "../config/invitation";
import { GoldDivider, LeafBranch, Lotus, Mandala } from "./decor";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function BlessingSection() {
  const { text } = invitation;
  return (
    <section className="section blessing" aria-label="Traditional blessing">
      <Mandala className="blessing__mandala" />
      <LeafBranch className="blessing__branch blessing__branch--l" />
      <LeafBranch className="blessing__branch blessing__branch--r" />
      <div className="container container--narrow blessing__inner">
        <div data-reveal>
          <Lotus className="blessing__lotus" filled />
        </div>
        <p className="blessing__hindi deva" lang="hi" data-reveal style={d(120)}>
          {text.blessingHindi}
        </p>
        <p className="blessing__english" data-reveal style={d(240)}>
          {text.blessingEnglish}
        </p>
        <div data-reveal style={d(320)}>
          <GoldDivider variant="paisley" />
        </div>
      </div>
    </section>
  );
}
