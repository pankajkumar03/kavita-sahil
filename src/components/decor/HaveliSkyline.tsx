import { C } from "./palette";

/* A quiet Rajasthani haveli silhouette — domes, chhatris and arched windows — built from a few shapes. */

const G = 170; // ground line

const dome = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2} ${base}C${cx - w * 0.58} ${base - h * 0.45} ${cx - w * 0.2} ${base - h * 0.7} ${cx} ${base - h}` +
  `C${cx + w * 0.2} ${base - h * 0.7} ${cx + w * 0.58} ${base - h * 0.45} ${cx + w / 2} ${base}Z`;

const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h}V${y + h * 0.42}Q${x} ${y} ${x + w / 2} ${y}Q${x + w} ${y} ${x + w} ${y + h * 0.42}V${y + h}Z`;

interface Dome {
  cx: number;
  base: number;
  w: number;
  h: number;
}

const blocks = [
  [20, 138, 80, G - 138],
  [100, 96, 24, G - 96],
  [140, 116, 90, G - 116],
  [230, 90, 140, G - 90],
  [370, 116, 90, G - 116],
  [476, 96, 24, G - 96],
  [500, 138, 80, G - 138],
  [268, 82, 64, 8],
];

const domes: Dome[] = [
  { cx: 300, base: 82, w: 64, h: 54 },
  { cx: 112, base: 96, w: 26, h: 28 },
  { cx: 488, base: 96, w: 26, h: 28 },
  { cx: 160, base: 116, w: 18, h: 18 },
  { cx: 210, base: 116, w: 18, h: 18 },
  { cx: 390, base: 116, w: 18, h: 18 },
  { cx: 440, base: 116, w: 18, h: 18 },
  { cx: 244, base: 78, w: 20, h: 20 },
  { cx: 356, base: 78, w: 20, h: 20 },
];

const windows = [
  ...[248, 272, 296, 320, 344].map((x) => [x - 6, 102, 14, 22]),
  ...[248, 272, 320, 344].map((x) => [x - 6, 136, 14, 24]),
  [285, 124, 30, 46],
  ...[156, 178, 200, 386, 408, 430].map((x) => [x, 128, 12, 20]),
  ...[34, 56, 78, 510, 532, 554].map((x) => [x - 4, 148, 10, 16]),
  [106, 112, 12, 20],
  [482, 112, 12, 20],
];

export function HaveliSkyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 172" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax meet">
      <g fill={C.gold} fillOpacity={0.13} stroke={C.gold} strokeOpacity={0.55} strokeWidth={0.8}>
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
        ))}
        {domes.map((d) => (
          <path key={`${d.cx}-${d.base}`} d={dome(d.cx, d.base, d.w, d.h)} />
        ))}
        {/* chhatri pillars on the main block */}
        {[236, 252, 348, 364].map((x) => (
          <rect key={x} x={x - 1} y={78} width={2} height={12} />
        ))}
      </g>
      <g stroke={C.gold} strokeOpacity={0.55} strokeWidth={0.8} fill="none">
        {domes.map((d) => (
          <path key={`f${d.cx}-${d.base}`} d={`M${d.cx} ${d.base - d.h}v-${d.w > 40 ? 12 : 6}`} />
        ))}
        <path d={`M0 ${G}H600`} />
        <path d="M140 122H230M370 122H460M230 96H370" strokeDasharray="2 3" />
      </g>
      <g fill={C.ivory} stroke={C.gold} strokeOpacity={0.6} strokeWidth={0.7}>
        {windows.map(([x, y, w, h]) => (
          <path key={`${x}-${y}`} d={arch(x, y, w, h)} />
        ))}
      </g>
      <circle cx={300} cy={14} r={2} fill={C.gold} fillOpacity={0.7} />
    </svg>
  );
}
