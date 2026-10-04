import type { ReactNode } from "react";
import { ARCH_D, C } from "./palette";

/** The haveli arch as a stretchable hairline outline. */
export function DecorativeArch({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d={ARCH_D} fill="none" stroke={C.gold} strokeOpacity={opacity} strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Content (usually a photo) cut into a haveli arch, with a double gold outline. */
export function ArchFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`arch-frame ${className}`}>
      <DecorativeArch className="arch-frame__line arch-frame__line--outer" opacity={0.55} />
      <DecorativeArch className="arch-frame__line arch-frame__line--inner" />
      <div className="arch-frame__mask">{children}</div>
    </div>
  );
}

function CornerKnot({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`deco-border__corner ${className}`} aria-hidden="true" focusable="false">
      <g fill="none" stroke={C.gold} strokeWidth={0.9}>
        <path d="M2 14C2 7 7 2 14 2" />
        <path d="M6 14C6 9.6 9.6 6 14 6" />
        <path d="M14 2V10M2 14H10" />
      </g>
      <circle cx={14} cy={14} r={1.6} fill={C.gold} />
    </svg>
  );
}

/** Traditional double-rule border with knotted corners, like a printed card. */
export function DecorativeBorder({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`deco-border ${className}`}>
      <span className="deco-border__inner" aria-hidden="true" />
      <CornerKnot className="is-tl" />
      <CornerKnot className="is-tr" />
      <CornerKnot className="is-bl" />
      <CornerKnot className="is-br" />
      {children}
    </div>
  );
}
