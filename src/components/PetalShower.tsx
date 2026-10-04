import { useEffect, useRef } from "react";
import { invitation } from "../config/invitation";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Falling flower petals (rose, marigold, blush) drawn on one canvas above the page.
 * - `burstPetals(n)` from anywhere starts a shower (used on "Open Invitation" and the closing section)
 * - a few ambient petals keep drifting while the invitation is open
 * Pointer events pass straight through; disabled entirely for reduced-motion users.
 */

const BURST_EVENT = "petals:burst";

export function burstPetals(count = 60) {
  window.dispatchEvent(new CustomEvent(BURST_EVENT, { detail: count }));
}

const COLORS = [
  ["#E7A9A6", "#C9706F"], // rose
  ["#F1C6C1", "#D99A96"], // blush
  ["#E9B44C", "#C98E22"], // marigold
  ["#F0CF7E", "#D2A548"], // soft marigold
  ["#B8434F", "#8F2635"], // deep rose
];

// A rounded petal, tip at the top (unit size ~ 1)
const PETAL = new Path2D("M0 -1 C0.62 -0.72 0.7 0.32 0 1 C-0.7 0.32 -0.62 -0.72 0 -1Z");
const VEIN = new Path2D("M0 -0.75 Q0.08 0 0 0.8");

interface Petal {
  x: number;
  y: number;
  size: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rot: number;
  vRot: number;
  flip: number;
  vFlip: number;
  color: [string, string];
  alpha: number;
  delay: number; // seconds before it starts falling (staggers a burst)
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makePetal(w: number, h: number, fromTop: boolean, delay = 0): Petal {
  const size = rand(6, 12) * (w < 600 ? 0.85 : 1);
  return {
    x: rand(-20, w + 20),
    y: fromTop ? rand(-h * 0.25, -20) : rand(-40, h),
    size,
    vy: rand(38, 78) * (size / 9),
    swayAmp: rand(14, 42),
    swayFreq: rand(0.6, 1.4),
    phase: rand(0, Math.PI * 2),
    rot: rand(0, Math.PI * 2),
    vRot: rand(-1.4, 1.4),
    flip: rand(0, Math.PI * 2),
    vFlip: rand(1.5, 3.5),
    color: COLORS[(Math.random() * COLORS.length) | 0] as [string, string],
    alpha: rand(0.75, 0.95),
    delay,
  };
}

export function PetalShower({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { petals: enabled, ambientPetals } = invitation.effects;
  // Read inside the animation loop, so opening the invitation doesn't restart the canvas mid-shower
  const ambientRef = useRef(0);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    ambientRef.current = active ? Math.max(0, ambientPetals) : 0;
    startRef.current();
  }, [active, ambientPetals]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || reduced || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const petals: Petal[] = [];
    let raf = 0;
    let last = performance.now();

    const draw = (p: Petal, t: number) => {
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x + sway, p.y);
      ctx.rotate(p.rot);
      // Turning over as it falls: squash one axis, darker when seen from behind
      const turn = Math.cos(p.flip);
      ctx.scale(p.size * Math.max(0.18, Math.abs(turn)), p.size);
      ctx.fillStyle = turn > 0 ? p.color[0] : p.color[1];
      ctx.fill(PETAL);
      ctx.lineWidth = 0.06;
      ctx.strokeStyle = p.color[1];
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.stroke(VEIN);
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      let airborne = 0;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        p.y += p.vy * dt;
        p.rot += p.vRot * dt;
        p.flip += p.vFlip * dt;
        if (p.y > h + 30) {
          petals.splice(i, 1);
          continue;
        }
        airborne++;
        draw(p, t);
      }
      // Top up the gentle ambient fall
      const ambient = ambientRef.current;
      if (airborne < ambient && Math.random() < 0.04) petals.push(makePetal(w, h, true));

      if (petals.length || ambient) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const start = () => {
      if (!raf && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onBurst = (e: Event) => {
      const count = Math.min(140, (e as CustomEvent<number>).detail || 60);
      for (let i = 0; i < count; i++) {
        const p = makePetal(w, h, true, Math.pow(Math.random(), 1.6) * 2.4); // most released early
        p.y = rand(-60, -12); // start just above the screen so the shower is seen at once
        p.vy *= 1.25; // a touch quicker than the ambient drift
        petals.push(p);
      }
      start();
    };
    window.addEventListener(BURST_EVENT, onBurst);

    startRef.current = start;
    start();

    // Save battery: stop drawing in a background tab
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener(BURST_EVENT, onBurst);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, reduced]);

  if (!enabled || reduced) return null;
  return <canvas ref={canvasRef} className="petal-shower" aria-hidden="true" />;
}
