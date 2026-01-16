import React, { useEffect, useRef } from 'react';
import { AmbienceState } from '../../src/types';

interface CanvasBackgroundProps {
  ambience: AmbienceState;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ ambience }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      const rw = Math.min(4000, rect.width || 0);
      const rh = Math.min(4000, rect.height || 0);

      if (rw > 0 && rh > 0) {
        canvas.width = (rw * dpr) | 0;
        canvas.height = (rh * dpr) | 0;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const rnd = (seed: number) => {
      let z = seed;
      return () => ((z = (z * 1664525 + 1013904223) >>> 0) / 4294967296);
    };

    const noise2D = (u: number, v: number, seed: number) => {
      const s = Math.sin(u * 12.9898 + v * 78.233 + seed * .1) * 43758.5453123;
      return s - Math.floor(s);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      timeRef.current += .006;
      const t0 = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const cx0 = w * .52;
      const cy0 = h * .36;
      const hue = ambience.h;

      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(cx0, cy0, 0, cx0, cy0, Math.max(w, h) * .92);
      const k = ambience.g;

      g.addColorStop(0, `hsla(${hue},90%,58%,${.12 * k})`);
      g.addColorStop(.35, `hsla(${(hue + 42) % 360},92%,56%,${.08 * k})`);
      g.addColorStop(.65, `hsla(${(hue + 120) % 360},92%,55%,${.06 * k})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (let li = 0; li < 4; li++) {
        const s = 1 + li * .25;
        const al = (.16 - li * .03) * ambience.a;
        const hu2 = (hue + li * 28 + Math.sin(t0 * .9 + li) * 18) % 360;

        ctx.globalCompositeOperation = li ? "lighter" : "screen";
        ctx.beginPath();

        const amp = h * (.08 + li * .02) * (0.7 + ambience.a * .7);
        const y0 = h * (.28 + li * .11);

        for (let xx = -24; xx <= w + 24; xx += 10) {
          const nx = (xx / w) * 2 - 1;
          const n = noise2D(nx * 2.2 * s + t0 * .7, li * 1.7 + t0 * .2, 11 + li * 17);
          const wb = Math.sin(nx * 5.2 + t0 * (1.1 + li * .2)) * .6;
          const y = y0 + (n - .5) * amp + wb * amp * .22;
          if (xx === -24) {
            ctx.moveTo(xx, y);
          } else {
            ctx.lineTo(xx, y);
          }
        }

        ctx.lineTo(w + 40, h + 50);
        ctx.lineTo(-40, h + 50);
        ctx.closePath();

        const f = ctx.createLinearGradient(0, y0 - amp, 0, y0 + amp * 1.2);
        f.addColorStop(0, `hsla(${hu2},92%,60%,0)`);
        f.addColorStop(.45, `hsla(${hu2},92%,62%,${al})`);
        f.addColorStop(1, `hsla(${(hu2 + 45) % 360},92%,62%,0)`);
        ctx.fillStyle = f;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "lighter";
      const rc = rnd(424242);
      const N = Math.round(5 + ambience.t * 9);

      for (let i = 0; i < N; i++) {
        const ph = rc() * Math.PI * 2;
        const sp = .25 + rc() * .55;
        const yb = h * (.14 + rc() * .58);
        const xb = w * (.08 + rc() * .84);
        const len = w * (.2 + rc() * .26);
        const amp = h * (.05 + rc() * .085);
        const th = 1 + rc() * 1.15;
        const ttt = t0 * sp + ph;

        ctx.beginPath();
        for (let s = 0; s <= 44; s++) {
          const u = s / 44;
          const xx = xb + (u - .5) * len;
          const yy = yb + Math.sin(u * 6 + ttt) * amp * (.6 + ambience.t * .65);
          if (s) {
            ctx.lineTo(xx, yy);
          } else {
            ctx.moveTo(xx, yy);
          }
        }

        const hu3 = (ambience.h + 60 + i * 12 + Math.sin(ttt) * 24) % 360;
        ctx.strokeStyle = `hsla(${hu3},92%,62%,${.1 * ambience.t})`;
        ctx.lineWidth = th;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [ambience.g, ambience.h, ambience.a, ambience.t]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
