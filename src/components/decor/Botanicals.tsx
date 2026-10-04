import { C } from "./palette";

interface Place {
  x: number;
  y: number;
  r?: number;
  s?: number;
}

const t = ({ x, y, r = 0, s = 1 }: Place) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

export function Leaf(p: Place) {
  return (
    <g transform={t(p)}>
      <path d="M0 0C5-6 15-6.5 21 0 15 6.5 5 6 0 0Z" fill={C.sage} fillOpacity={0.28} stroke={C.sage} strokeWidth={0.7} />
      <path d="M1.5 0H18" stroke={C.sage} strokeWidth={0.45} opacity={0.75} />
    </g>
  );
}

export function Rose(p: Place) {
  return (
    <g transform={t(p)}>
      <circle r={13} fill={C.blush} />
      <path d="M-13 3C-15 11-5 16 3 15S15 7 13-2" fill="none" stroke={C.maroon} strokeOpacity={0.45} strokeWidth={0.8} />
      <path
        d="M-9 4C-11-6-1-12 7-8S12 5 4 8-6 5-4-1 3-5 4 0"
        fill="none"
        stroke={C.red}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
      <path d="M-2-12C4-15 11-11 12-5" fill="none" stroke={C.red} strokeOpacity={0.55} strokeWidth={0.7} />
    </g>
  );
}

const MARIGOLD_PETALS = Array.from({ length: 14 }, (_, i) => i * (360 / 14));

export function Marigold(p: Place) {
  return (
    <g transform={t(p)}>
      {MARIGOLD_PETALS.map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-8.5}
          rx={3.4}
          ry={4.6}
          transform={`rotate(${a})`}
          fill={C.goldSoft}
          fillOpacity={0.55}
          stroke={C.gold}
          strokeWidth={0.5}
        />
      ))}
      <circle r={5.5} fill={C.goldSoft} stroke={C.gold} strokeWidth={0.6} />
      <circle r={2.2} fill={C.gold} />
    </g>
  );
}

export function Jasmine(p: Place) {
  return (
    <g transform={t(p)}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-5.5}
          rx={2.6}
          ry={5}
          transform={`rotate(${a})`}
          fill={C.white}
          stroke={C.gold}
          strokeWidth={0.55}
        />
      ))}
      <circle r={1.6} fill={C.gold} />
    </g>
  );
}

export function Bud(p: Place) {
  return (
    <g transform={t(p)}>
      <path d="M0 0C-3-4-3-9 0-12 3-9 3-4 0 0Z" fill={C.blush} stroke={C.red} strokeOpacity={0.6} strokeWidth={0.6} />
      <path d="M0 0C-2 2-4 2-5 1M0 0C2 2 4 2 5 1" fill="none" stroke={C.sage} strokeWidth={0.6} />
    </g>
  );
}

/** A sprig of round eucalyptus-style leaves along a line. */
export function Sprig({ count = 5, ...p }: Place & { count?: number }) {
  return (
    <g transform={t(p)}>
      <path d={`M0 0Q${count * 6} -4 ${count * 12} 0`} fill="none" stroke={C.sage} strokeWidth={0.6} />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={8 + i * 11}
          cy={i % 2 ? 4 : -5}
          r={3.4 - i * 0.35}
          fill={C.sage}
          fillOpacity={0.2}
          stroke={C.sage}
          strokeWidth={0.55}
        />
      ))}
    </g>
  );
}
