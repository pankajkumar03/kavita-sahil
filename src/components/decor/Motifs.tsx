import { Leaf } from "./Botanicals";
import { C } from "./palette";

/* Small single motifs: lotus, paisley, diya, leaf branch. */

export function Lotus({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true" focusable="false">
      <g
        fill={filled ? C.goldSoft : "none"}
        fillOpacity={filled ? 0.25 : 0}
        stroke={C.gold}
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M32 36C22 36 10 32 4 24 14 23 24 28 32 36Z" />
        <path d="M32 36C42 36 54 32 60 24 50 23 40 28 32 36Z" />
        <path d="M32 36C24 32 16 24 14 13 22 16 29 25 32 36Z" />
        <path d="M32 36C40 32 48 24 50 13 42 16 35 25 32 36Z" />
        <path d="M32 4C38 13 38 26 32 36 26 26 26 13 32 4Z" />
      </g>
      <path d="M12 40H52" stroke={C.gold} strokeWidth={0.8} />
      <circle cx={32} cy={40} r={1.4} fill={C.gold} />
    </svg>
  );
}

export function Paisley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={C.gold} strokeWidth={0.9} strokeLinecap="round">
        <path d="M22 56C8 52 2 38 6 26 10 14 22 8 30 14 37 19 36 30 28 32 22 34 18 28 22 24" />
        <path d="M20 49C12 45 9 36 12 28 15 20 23 17 27 21" />
        <path d="M18 42C14 38 14 32 17 28" />
      </g>
      <circle cx={5} cy={40} r={0.9} fill={C.gold} />
      <circle cx={7} cy={47} r={0.9} fill={C.gold} />
      <circle cx={12} cy={52} r={0.9} fill={C.gold} />
      <circle cx={23} cy={25} r={1.4} fill={C.gold} />
    </svg>
  );
}

export function Diya({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 46" className={className} aria-hidden="true" focusable="false">
      <path
        className="diya-flame"
        d="M30 3C35 11 34.5 18 30 21.5 25.5 18 25 11 30 3Z"
        fill={C.goldSoft}
        stroke={C.gold}
        strokeWidth={0.7}
      />
      <path d="M30 10C32 14 32 17 30 19 28 17 28 14 30 10Z" fill={C.red} fillOpacity={0.55} />
      <path
        d="M6 25C10 37 50 37 54 25 40 29 20 29 6 25Z"
        fill={C.gold}
        fillOpacity={0.18}
        stroke={C.gold}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
      <path d="M54 25C57 24 59 22 59 20" fill="none" stroke={C.gold} strokeWidth={0.9} strokeLinecap="round" />
      <path d="M14 30C22 32 38 32 46 30" fill="none" stroke={C.gold} strokeWidth={0.5} strokeDasharray="1.5 2.5" />
      <path d="M22 38Q30 42 38 38" fill="none" stroke={C.gold} strokeWidth={0.9} strokeLinecap="round" />
    </svg>
  );
}

const BRANCH_LEAVES = [
  [24, 19, -30, 0.8],
  [46, 18, 30, 0.85],
  [70, 20, -28, 0.9],
  [94, 22, 28, 0.85],
  [118, 22, -26, 0.75],
  [138, 21, 24, 0.65],
];

export function LeafBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} aria-hidden="true" focusable="false">
      <path d="M4 22C40 15 100 27 156 20" fill="none" stroke={C.sage} strokeWidth={0.8} />
      {BRANCH_LEAVES.map(([x, y, r, s]) => (
        <Leaf key={x} x={x} y={y} r={r} s={s} />
      ))}
      <circle cx={156} cy={20} r={1.6} fill={C.gold} />
    </svg>
  );
}
