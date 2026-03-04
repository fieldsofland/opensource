import { useState, useEffect, useRef, useCallback } from "react";
import { scaleEase } from "dease";
import { Prose } from "./Prose";

const SWEEP_MS = 3000;
const BALL_MS = 1000;
const PAUSE_MS = 1500;
const BALL_DELAY = 250;

const CURVES = [
  { name: "EASE_IN_INSTANT", value: [0.09, 0.7, 0.33, 1], desc: "Fast attack, smooth settle" },
  { name: "EASE_IN_SNAPPY", value: [0.1, 0, 0, 1], desc: "Snappy deceleration" },
  { name: "EASE_IN_DEFAULT", value: [0.4, 0, 0, 1], desc: "Standard deceleration" },
  { name: "EASE_IN_SMOOTH", value: [0.6, 0, 0, 1], desc: "Gentle, long ease-in" },
  { name: "EASE_QUAD_80", value: [0.8, 0, 0.2, 1], desc: "Aggressive symmetrical" },
  { name: "EASE_QUAD_75", value: [0.75, 0, 0.25, 1], desc: "Symmetrical toggle" },
  { name: "EASE_QUAD_60", value: [0.6, 0, 0.3, 1], desc: "Slightly asymmetric toggle" },
  { name: "EASE_QUAD_50", value: [0.5, 0, 0.5, 1], desc: "Balanced symmetrical" },
] as const;

function BezierSVG({ value }: { value: readonly [number, number, number, number] }) {
  const [x1, y1, x2, y2] = value;
  const pad = 16;
  const size = 160;
  const inner = size - pad * 2;

  const sx = (v: number) => pad + v * inner;
  const sy = (v: number) => pad + (1 - v) * inner;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="curve-svg"
      aria-hidden="true"
    >
      {/* Grid lines */}
      <line x1={pad} y1={pad} x2={pad} y2={size - pad} className="curve-grid-line" />
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} className="curve-grid-line" />

      {/* Control point handles */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(x1)} y2={sy(y1)} className="curve-handle" />
      <line x1={sx(1)} y1={sy(1)} x2={sx(x2)} y2={sy(y2)} className="curve-handle" />

      {/* The curve */}
      <path
        d={`M ${sx(0)},${sy(0)} C ${sx(x1)},${sy(y1)} ${sx(x2)},${sy(y2)} ${sx(1)},${sy(1)}`}
        className="curve-path"
      />

      {/* Control points */}
      <circle cx={sx(x1)} cy={sy(y1)} r="4" className="curve-point" />
      <circle cx={sx(x2)} cy={sy(y2)} r="4" className="curve-point" />
    </svg>
  );
}

const P1_FLOOR: Record<string, number> = {
  EASE_IN_DEFAULT: 0.6,
  EASE_IN_SMOOTH: 0.8,
};

type Phase = "sweep-down" | "pause-low" | "sweep-up" | "pause-high";

function CurveCard({ name, value, desc }: (typeof CURVES)[number]) {
  const isEaseIn = name.startsWith("EASE_IN_");
  const sliderMin = isEaseIn ? 0.5 : 0.4;
  const [intensity, setIntensity] = useState(1);
  const [ballAtEnd, setBallAtEnd] = useState(false);
  const dragging = useRef(false);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startPhase = useCallback((phase: Phase) => {
    if (dragging.current) return;

    if (phase === "sweep-down" || phase === "sweep-up") {
      const start = Date.now();
      const from = phase === "sweep-down" ? 1 : sliderMin;
      const to = phase === "sweep-down" ? sliderMin : 1;

      const tick = () => {
        if (dragging.current) return;
        const p = Math.min(1, (Date.now() - start) / SWEEP_MS);
        const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
        const val = from + (to - from) * eased;
        setIntensity(parseFloat(val.toFixed(3)));

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          const next: Phase = phase === "sweep-down" ? "pause-low" : "pause-high";
          startPhase(next);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      timerRef.current = setTimeout(() => {
        if (dragging.current) return;
        setBallAtEnd((prev) => !prev);
        timerRef.current = setTimeout(() => {
          if (dragging.current) return;
          const next: Phase = phase === "pause-low" ? "sweep-up" : "sweep-down";
          startPhase(next);
        }, PAUSE_MS - BALL_DELAY);
      }, BALL_DELAY);
    }
  }, [sliderMin]);

  useEffect(() => {
    startPhase("sweep-down");
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, [startPhase]);

  const onPointerDown = () => {
    dragging.current = true;
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
  };
  const onPointerUp = () => {
    dragging.current = false;
    startPhase("sweep-down");
  };

  const rawScaled = scaleEase(value, intensity);
  const floor = P1_FLOOR[name];
  let scaled: [number, number, number, number];
  if (isEaseIn) {
    const t = (intensity - sliderMin) / (1 - sliderMin);
    const p1x = floor != null ? value[0] * (floor + t * (1 - floor)) : value[0];
    scaled = [p1x, value[1], rawScaled[2], rawScaled[3]];
  } else {
    scaled = rawScaled;
  }
  const r = (v: number) => parseFloat(v.toFixed(4));
  const css = `cubic-bezier(${r(scaled[0])}, ${r(scaled[1])}, ${r(scaled[2])}, ${r(scaled[3])})`;

  return (
    <div className="curve-card">
      <div className="curve-stage">
        <BezierSVG value={scaled} />
      </div>
      <div className="curve-intensity">
        <span className="curve-intensity-label">Intensity</span>
        <input
          type="range"
          min={sliderMin}
          max="1"
          step="0.001"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onDoubleClick={() => setIntensity(1)}
          className="curve-slider"
          style={{ "--fill": `${((intensity - sliderMin) / (1 - sliderMin)) * 100}%` } as React.CSSProperties}
          aria-label={`Intensity for ${name}`}
        />
        <span className="curve-intensity-value mono">{intensity.toFixed(2)}</span>
      </div>
      <div className="curve-track">
        <div
          className="curve-bar"
          data-at-end={ballAtEnd}
          style={{ "--curve": css, "--ball-ms": `${BALL_MS}ms` } as React.CSSProperties}
        />
      </div>
      <div className="curve-footer">
        <div className="curve-footer-left">
          <span className="mono curve-name">{name}</span>
          <span className="curve-desc">{desc}</span>
        </div>
        <div className="curve-bezier">
          <span className="curve-bezier-label">cubic-bezier</span>
          <div className="curve-bezier-values">
            <span className="curve-bezier-val mono">{scaled[0].toFixed(2)}</span>
            <span className="curve-bezier-val mono">{scaled[1].toFixed(2)}</span>
            <span className="curve-bezier-val mono">{scaled[2].toFixed(2)}</span>
            <span className="curve-bezier-val mono">{scaled[3].toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CurveDemo() {
  return (
    <section id="curves">
      <p className="section-label">The Curves</p>
      <Prose>
        <p>
          These aren't generated or pulled from a spec. Each curve is{" "}
          <strong>hand-shaped</strong> from years of tweaking
          motion in real products, tuned by feel until it sits right. Every
          control point is intentional.
        </p>
        <p>
          <strong>Eight curves is all you really need.</strong> Most libraries
          ship dozens of options nobody can keep straight. These eight cover
          every common UI pattern. Fewer choices, faster decisions, more
          consistent motion.
        </p>
        <p>
          <strong>Every curve is dynamic.</strong> Drag the intensity slider on
          any card to scale it from its full shape down toward linear using{" "}
          <code>scaleEase</code>. Watch the dot loop to see how the feel changes
          in real time.
        </p>
      </Prose>
      <div className="curve-grid">
        {CURVES.map((c) => (
          <CurveCard key={c.name} {...c} />
        ))}
      </div>

      <style>{`
        .curve-grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .curve-card {
          background: var(--bg-raised);
          border: none;
          border-radius: 12px;
          overflow: hidden;
          padding-top: 16px;
          box-shadow: inset 0 0 0 1px var(--border);
          transition: box-shadow 0.15s var(--ease-in-default);
        }
        .curve-card:hover {
          box-shadow: var(--card-hover-shadow);
        }
        .curve-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px 12px;
        }
        .curve-svg {
          width: 100%;
          max-width: 160px;
          height: auto;
        }
        .curve-grid-line {
          stroke: var(--border);
          stroke-width: 1;
        }
        .curve-handle {
          stroke: var(--text-muted);
          stroke-width: 1.5;
          stroke-dasharray: 2 2;
          opacity: 0.5;
        }
        .curve-path {
          fill: none;
          stroke: var(--accent);
          stroke-width: 2;
          stroke-linecap: round;
        }
        .curve-point {
          fill: var(--accent);
        }
        .curve-intensity {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px 8px;
        }
        .curve-intensity-label {
          font-size: 10px;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-right: 4px;
        }
        .curve-slider {
          flex: 1;
          height: 4px;
          appearance: none;
          background: linear-gradient(
            to right,
            var(--accent) 0%,
            var(--accent) var(--fill),
            var(--bg-hover) var(--fill),
            var(--bg-hover) 100%
          );
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .curve-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
        }
        .curve-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          cursor: pointer;
        }
        .curve-intensity-value {
          font-size: 10px;
          color: var(--text-muted);
          min-width: 28px;
          text-align: right;
        }
        .curve-track {
          --inset: 4px;
          height: 24px;
          margin: 12px 16px 20px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          container-type: inline-size;
        }
        .curve-bar {
          position: absolute;
          top: var(--inset);
          left: var(--inset);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          transform: translateX(0);
          transition: transform var(--ball-ms) var(--curve);
        }
        .curve-bar[data-at-end="true"] {
          transform: translateX(calc(100cqw - 16px - var(--inset) * 2));
        }
        .curve-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          gap: 8px;
        }
        .curve-footer-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .curve-name {
          font-size: 11px;
          color: var(--accent);
        }
        .curve-desc {
          font-size: 10px;
          color: var(--text-muted);
        }
        .curve-bezier {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }
        .curve-bezier-label {
          font-size: 10px;
          color: var(--text-muted);
        }
        .curve-bezier-values {
          display: flex;
          gap: 6px;
        }
        .curve-bezier-val {
          flex: 1;
          font-size: 10px;
          color: var(--text-muted);
          background: var(--bg-hover);
          padding: 2px 8px;
          border-radius: 6px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .curve-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
