import { useState, useEffect, useRef, useCallback } from "react";
import { scaleEase } from "dease";
import { Prose } from "./Prose";

const BASE_CURVE = [0.6, 0, 0, 1] as const; // EASE_IN_SMOOTH
const P1_FLOOR = 0.8;
const SLIDER_MIN = 0.5;
const SWEEP_MS = 3000;
const BALL_MS = 1000;
const PAUSE_MS = 1500;
const BALL_DELAY = 250;

function LargeBezierSVG({ value }: { value: readonly [number, number, number, number] }) {
  const [x1, y1, x2, y2] = value;
  const pad = 24;
  const size = 200;
  const inner = size - pad * 2;

  const sx = (v: number) => pad + v * inner;
  const sy = (v: number) => pad + (1 - v) * inner;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="dyn-svg"
      aria-hidden="true"
    >
      {/* Grid lines */}
      <line x1={pad} y1={pad} x2={pad} y2={size - pad} className="dyn-grid-line" />
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} className="dyn-grid-line" />

      {/* Identity line (linear reference) */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} className="dyn-identity" />

      {/* Control point handles */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(x1)} y2={sy(y1)} className="dyn-handle" />
      <line x1={sx(1)} y1={sy(1)} x2={sx(x2)} y2={sy(y2)} className="dyn-handle" />

      {/* The curve */}
      <path
        d={`M ${sx(0)},${sy(0)} C ${sx(x1)},${sy(y1)} ${sx(x2)},${sy(y2)} ${sx(1)},${sy(1)}`}
        className="dyn-path"
      />

      {/* Control points */}
      <circle cx={sx(x1)} cy={sy(y1)} r="4" className="dyn-point" />
      <circle cx={sx(x2)} cy={sy(y2)} r="4" className="dyn-point" />
    </svg>
  );
}

type Phase = "sweep-down" | "pause-low" | "sweep-up" | "pause-high";

export function DynamicEasing() {
  const [intensity, setIntensity] = useState(1);
  const [ballAtEnd, setBallAtEnd] = useState(false);
  const dragging = useRef(false);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startPhase = useCallback((phase: Phase) => {
    if (dragging.current) return;

    if (phase === "sweep-down" || phase === "sweep-up") {
      const start = Date.now();
      const from = phase === "sweep-down" ? 1 : SLIDER_MIN;
      const to = phase === "sweep-down" ? SLIDER_MIN : 1;

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
      // Pause phase — delay, fire ball, then resume after pause
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
  }, []);

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

  const rawScaled = scaleEase(BASE_CURVE, intensity);
  const t = (intensity - SLIDER_MIN) / (1 - SLIDER_MIN);
  const p1x = BASE_CURVE[0] * (P1_FLOOR + Math.max(0, t) * (1 - P1_FLOOR));
  const scaled: [number, number, number, number] = [p1x, BASE_CURVE[1], rawScaled[2], rawScaled[3]];
  const r = (v: number) => parseFloat(v.toFixed(4));
  const css = `cubic-bezier(${r(scaled[0])}, ${r(scaled[1])}, ${r(scaled[2])}, ${r(scaled[3])})`;

  return (
    <section id="dynamic-easing">
      <p className="section-label">Dynamic by Design</p>
      <Prose>
        <p>
          Most easing libraries hand you a static curve and wish you luck.
          Dease is different: every curve ships with a built-in intensity dial.{" "}
          <code>scaleEase(curve, intensity)</code> lerps the control points
          toward the identity line: intensity 1.0 gives you the original
          curve, lower values scale it down while preserving its character.
          <strong>One curve, infinite feels.</strong>
        </p>
        <p>
          This means you can tie easing to any dynamic value (scroll
          progress, drag distance, user preference) without swapping curves
          or maintaining lookup tables. The math is a single lerp per control
          point, so it's essentially free.
        </p>
      </Prose>

      <div className="dyn-card">
        <div className="dyn-stage">
          <LargeBezierSVG value={scaled} />
          <span className="dyn-curve-name mono">EASE_IN_SMOOTH</span>
        </div>

        <div className="dyn-controls">
          <div className="dyn-slider-row">
            <span className="dyn-slider-label">Intensity</span>
            <input
              type="range"
              min={SLIDER_MIN}
              max="1"
              step="0.001"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onDoubleClick={() => setIntensity(1)}
              className="dyn-slider"
              style={{ "--fill": `${((intensity - SLIDER_MIN) / (1 - SLIDER_MIN)) * 100}%` } as React.CSSProperties}
              aria-label="Scale intensity"
            />
            <span className="dyn-slider-value mono">{((intensity - SLIDER_MIN) / (1 - SLIDER_MIN)).toFixed(2)}</span>
          </div>

          <div className="dyn-css">
            <span className="dyn-css-label">cubic-bezier</span>
            <div className="dyn-css-values">
              <span className="dyn-css-val mono">{scaled[0].toFixed(2)}</span>
              <span className="dyn-css-val mono">{scaled[1].toFixed(2)}</span>
              <span className="dyn-css-val mono">{scaled[2].toFixed(2)}</span>
              <span className="dyn-css-val mono">{scaled[3].toFixed(2)}</span>
            </div>
          </div>

          <div className="dyn-track">
            <div
              className="dyn-ball"
              data-at-end={ballAtEnd}
              style={{ "--curve": css, "--ball-ms": `${BALL_MS}ms` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      <style>{`
        .dyn-card {
          margin-top: 32px;
          background: var(--bg-raised);
          border: none;
          border-radius: 12px;
          display: flex;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px var(--border);
        }
        .dyn-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 32px;
          border-right: 1px solid var(--border);
          flex-shrink: 0;
        }
        .dyn-curve-name {
          font-size: 11px;
          color: var(--accent);
        }
        .dyn-svg {
          width: 200px;
          height: 200px;
        }
        .dyn-grid-line {
          stroke: var(--border);
          stroke-width: 1;
        }
        .dyn-identity {
          stroke: var(--border);
          stroke-width: 1;
          stroke-dasharray: 4 4;
          opacity: 0.6;
        }
        .dyn-handle {
          stroke: var(--text-muted);
          stroke-width: 1;
          stroke-dasharray: 3 3;
          opacity: 0.5;
        }
        .dyn-path {
          fill: none;
          stroke: var(--accent);
          stroke-width: 2.5;
          stroke-linecap: round;
        }
        .dyn-point {
          fill: var(--accent);
        }
        .dyn-controls {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          overflow: hidden;
        }
        .dyn-slider-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dyn-slider-label {
          font-size: 12px;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .dyn-slider {
          flex: 1;
          min-width: 0;
          width: 0;
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
        .dyn-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
        }
        .dyn-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          cursor: pointer;
        }
        .dyn-slider-value {
          font-size: 12px;
          color: var(--text-muted);
          min-width: 32px;
          text-align: right;
        }
        .dyn-css {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dyn-css-label {
          font-size: 10px;
          color: var(--text-muted);
        }
        .dyn-css-values {
          display: flex;
          gap: 6px;
        }
        .dyn-css-val {
          flex: 1;
          font-size: 10px;
          color: var(--text);
          background: var(--bg-hover);
          padding: 3px 0;
          border-radius: 4px;
          text-align: center;
        }
        .dyn-track {
          --inset: 5px;
          height: 28px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          container-type: inline-size;
        }
        .dyn-ball {
          position: absolute;
          top: var(--inset);
          left: var(--inset);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          transform: translateX(0);
          transition: transform var(--ball-ms) var(--curve);
        }
        .dyn-ball[data-at-end="true"] {
          transform: translateX(calc(100cqw - 18px - var(--inset) * 2));
        }

        @media (max-width: 600px) {
          .dyn-card {
            flex-direction: column;
          }
          .dyn-stage {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 24px;
          }
          .dyn-svg {
            width: 160px;
            height: 160px;
          }
          .dyn-controls {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
