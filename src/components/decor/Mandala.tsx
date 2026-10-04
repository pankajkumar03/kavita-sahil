import { C } from "./palette";

const stroke = {
  pathLength: 1,
  fill: "none",
  stroke: C.gold,
  strokeWidth: 0.8,
  vectorEffect: "non-scaling-stroke" as const,
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Gold line mandala. With `draw`, each stroke draws itself (see .mandala-draw in CSS). */
export function Mandala({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`mandala ${draw ? "mandala-draw" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx={60} cy={60} r={6} {...stroke} />
      <circle cx={60} cy={60} r={13} {...stroke} />
      {range(8).map((i) => (
        <path key={`a${i}`} d="M60 47C65 38 65 29 60 20 55 29 55 38 60 47Z" transform={`rotate(${i * 45} 60 60)`} {...stroke} />
      ))}
      {range(8).map((i) => (
        <path
          key={`b${i}`}
          d="M60 47C62 41 62 36 60 32 58 36 58 41 60 47Z"
          transform={`rotate(${i * 45 + 22.5} 60 60)`}
          {...stroke}
        />
      ))}
      <circle cx={60} cy={60} r={41} {...stroke} />
      {range(16).map((i) => (
        <path
          key={`c${i}`}
          d="M60 19C62.5 15 62.5 11 60 7 57.5 11 57.5 15 60 19Z"
          transform={`rotate(${i * 22.5} 60 60)`}
          {...stroke}
        />
      ))}
      {range(16).map((i) => (
        <circle
          key={`d${i}`}
          cx={60}
          cy={14}
          r={0.9}
          fill={C.gold}
          className="mandala-dot"
          transform={`rotate(${i * 22.5 + 11.25} 60 60)`}
        />
      ))}
    </svg>
  );
}
