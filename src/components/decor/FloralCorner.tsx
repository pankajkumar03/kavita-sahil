import { Bud, Jasmine, Leaf, Marigold, Rose, Sprig } from "./Botanicals";
import { C } from "./palette";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const flip: Record<Corner, string> = {
  "top-left": "none",
  "top-right": "scaleX(-1)",
  "bottom-left": "scaleY(-1)",
  "bottom-right": "scale(-1,-1)",
};

const TOP_LEAVES = [
  [56, 16, -28, 1.1],
  [84, 17, 32, 1],
  [116, 18, -24, 0.9],
  [150, 22, 30, 0.8],
  [186, 27, -20, 0.7],
];
const SIDE_LEAVES = [
  [16, 56, 118, 1.1],
  [17, 84, 58, 1],
  [18, 116, 114, 0.9],
  [22, 150, 60, 0.8],
  [27, 186, 110, 0.7],
];
const DOTS = [
  [120, 40],
  [40, 122],
  [160, 36],
  [34, 164],
  [80, 80],
];

/** Line-art rose, marigold & jasmine cluster with foliage running along two edges. */
export function FloralCorner({ corner = "top-left", className = "" }: { corner?: Corner; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`floral-corner floral-corner--${corner} ${className}`}
      style={{ transform: flip[corner] }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 12C70 18 130 14 230 34" fill="none" stroke={C.sage} strokeWidth={0.8} />
      <path d="M12 8C18 70 14 130 34 230" fill="none" stroke={C.sage} strokeWidth={0.8} />
      {TOP_LEAVES.map(([x, y, r, s]) => (
        <Leaf key={`t${x}`} x={x} y={y} r={r} s={s} />
      ))}
      {SIDE_LEAVES.map(([x, y, r, s]) => (
        <Leaf key={`l${y}`} x={x} y={y} r={r} s={s} />
      ))}
      <Sprig x={40} y={40} r={42} s={0.95} count={6} />
      <Rose x={30} y={30} s={1.45} />
      <Marigold x={72} y={25} s={0.85} />
      <Marigold x={25} y={72} s={0.72} />
      <Rose x={60} y={58} s={0.72} />
      <Jasmine x={104} y={24} s={0.9} />
      <Jasmine x={23} y={106} s={0.85} />
      <Jasmine x={92} y={50} s={0.7} />
      <Bud x={134} y={26} r={70} s={0.9} />
      <Bud x={26} y={140} r={-160} s={0.9} />
      {DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={C.gold} />
      ))}
    </svg>
  );
}
