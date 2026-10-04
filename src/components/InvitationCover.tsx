import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { invitation } from "../config/invitation";
import { DecorativeArch, DecorativeBorder, FloralCorner, GoldDivider, HaveliSkyline, Mandala } from "./decor";

interface Props {
  leaving: boolean;
  onOpen: () => void;
}

/** The sealed card guests see first. Elements arrive one by one (see .cover-step delays in CSS). */
export function InvitationCover({ leaving, onOpen }: Props) {
  const { bride, groom, text } = invitation;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Give keyboard users the button once it has appeared
    const id = window.setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), 3600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className={`cover ${leaving ? "is-leaving" : ""}`} aria-labelledby="cover-title">
      <div className="cover__panel cover__panel--left" aria-hidden="true" />
      <div className="cover__panel cover__panel--right" aria-hidden="true" />

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

          <h1 id="cover-title" className="cover__names">
            <span className="cover-step s-3">{bride.name}</span>
            <span className="amp-row cover-step s-4" aria-label="and">
              <span className="amp-line" aria-hidden="true" />
              <span className="amp" aria-hidden="true">
                &amp;
              </span>
              <span className="amp-line" aria-hidden="true" />
            </span>
            <span className="cover-step s-5">{groom.name}</span>
          </h1>

          <p className="cover__blessing cover-step s-6">With the blessings of our families</p>
          <div className="cover-step s-6">
            <GoldDivider variant="lotus" className="cover__divider" />
          </div>

          <button ref={buttonRef} type="button" className="btn btn--primary cover__open cover-step s-7" onClick={onOpen}>
            <span>Open Invitation</span>
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </button>
        </div>
      </DecorativeBorder>
    </section>
  );
}
