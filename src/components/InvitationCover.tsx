import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { invitation } from "../config/invitation";
import { DecorativeArch, DecorativeBorder, FloralCorner, GoldDivider, HaveliSkyline, Mandala } from "./decor";

interface Props {
  leaving: boolean;
  onOpen: () => void;
}

/** How long the arrival sequence waits for the display fonts before starting anyway. */
const FONT_WAIT_MS = 1200;
/** When the "Open Invitation" button has finished appearing (see .cover-step.s-7). */
const BUTTON_READY_MS = 3000;

/**
 * The card face. Rendered twice — once inside each door — so the card itself splits down the
 * middle when it opens. The `mirror` copy is decorative only (hidden from assistive tech).
 */
function CoverCard({ mirror, onOpen, buttonRef }: { mirror?: boolean; onOpen: () => void; buttonRef?: React.Ref<HTMLButtonElement> }) {
  const { bride, groom, text } = invitation;
  const Names = mirror ? "div" : "h1";
  return (
    <DecorativeBorder className="cover__card">
      <FloralCorner corner="top-left" className="cover__floral cover-step s-border" />
      <FloralCorner corner="top-right" className="cover__floral cover-step s-border" />
      <FloralCorner corner="bottom-left" className="cover__floral cover-step s-border" />
      <FloralCorner corner="bottom-right" className="cover__floral cover-step s-border" />
      <DecorativeArch className="cover__arch cover-step s-border" opacity={0.7} />
      <HaveliSkyline className="cover__skyline cover-step s-border" />

      <div className="cover__content">
        <Mandala draw className="cover__mandala" />
        <p className="cover__invocation deva cover-step s-1" lang="hi">
          {text.invocation}
        </p>
        <p className="eyebrow cover__eyebrow cover-step s-2">Engagement Invitation</p>

        <Names id={mirror ? undefined : "cover-title"} className="cover__names">
          <span className="cover-step s-3">{bride.name}</span>
          <span className="amp-row cover-step s-4" aria-label="and">
            <span className="amp-line" aria-hidden="true" />
            <span className="amp" aria-hidden="true">
              &amp;
            </span>
            <span className="amp-line" aria-hidden="true" />
          </span>
          <span className="cover-step s-5">{groom.name}</span>
        </Names>

        <p className="cover__blessing cover-step s-6">With the blessings of our families</p>
        <div className="cover-step s-6">
          <GoldDivider variant="lotus" className="cover__divider" />
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="btn btn--primary cover__open cover-step s-7"
          onClick={onOpen}
          tabIndex={mirror ? -1 : undefined}
        >
          <span>Open Invitation</span>
          <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
      </div>
    </DecorativeBorder>
  );
}

/**
 * The sealed card guests see first. Its pieces arrive one by one (see .cover-step in CSS), and on
 * "Open Invitation" the card splits into two doors that swing apart over a warm glow.
 */
export function InvitationCover({ leaving, onOpen }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);

  // Start the arrival sequence once the display fonts are in, so names never swap fonts mid-animation
  useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const timer = window.setTimeout(go, FONT_WAIT_MS);
    document.fonts?.ready.then(go).catch(go);
    return () => window.clearTimeout(timer);
  }, []);

  // Give keyboard users the button once it has appeared
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), BUTTON_READY_MS);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <section className={`cover ${ready ? "is-ready" : ""} ${leaving ? "is-leaving" : ""}`} aria-labelledby="cover-title">
      <div className="cover__glow" aria-hidden="true" />
      <div className="cover__door cover__door--left">
        <CoverCard onOpen={onOpen} buttonRef={buttonRef} />
      </div>
      <div className="cover__door cover__door--right" aria-hidden="true">
        <CoverCard mirror onOpen={onOpen} />
      </div>
    </section>
  );
}
