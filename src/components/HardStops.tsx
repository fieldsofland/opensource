import { X, Check } from "lucide-react";
import { Prose } from "./Prose";

// CSS ease-in: cubic-bezier(0.42, 0, 1, 1)
const CSS_EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];
// Dease EASE_IN_DEFAULT: cubic-bezier(0.4, 0, 0, 1)
const DEASE_DEFAULT: [number, number, number, number] = [0.4, 0, 0, 1];

const PAD = 28;
const SIZE = 220;
const INNER = SIZE - PAD * 2;

const sx = (v: number) => PAD + v * INNER;
const sy = (v: number) => PAD + (1 - v) * INNER;

function TangentCurve({
  tag,
  name,
  value,
  desc,
  bad,
}: {
  tag: string;
  name: string;
  value: [number, number, number, number];
  desc: string;
  bad?: boolean;
}) {
  const [x1, y1, x2, y2] = value;

  const d2x = x2 - 1, d2y = y2 - 1;
  const h2Len = Math.sqrt(d2x * d2x + d2y * d2y);

  // Backward tangent direction at endpoint for arc + tangent handle
  // For a cubic bezier, tangent at t=1 is 3(P3-P2).
  // When P2=P3, this is zero, so we fall back to the 2nd-derivative
  // direction: 6(P1 - 2P2 + P3), whose approach direction is P3-P1.
  let dx = 1 - x2;
  let dy = 1 - y2;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    dx = 1 - x1;
    dy = 1 - y1;
  }
  const len = Math.sqrt(dx * dx + dy * dy);
  const ndx = dx / len;
  const ndy = dy / len;

  // Angle arc for the bad case
  const arcR = 22;
  const arcHx = sx(1) - arcR;
  const arcTx = sx(1) - ndx * arcR;
  const arcTy = sy(1) + ndy * arcR;

  const css = `cubic-bezier(${value.join(", ")})`;

  return (
    <div className="hs-card">
      <div className="hs-header">
        <span className={`hs-tag${bad ? "" : " hs-tag-dease"}`}>{tag}</span>
        <code className="hs-code">{name}</code>
      </div>
      <div className={`hs-pill ${bad ? "hs-pill-bad" : "hs-pill-good"}`}>
        {bad ? <X size={12} strokeWidth={2.5} /> : <Check size={12} strokeWidth={2.5} />}
        {bad ? "Hard Stop" : "Smooth Arrival"}
      </div>
      <div className="hs-stage">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="hs-svg">
          <defs>
            {bad ? (
              <linearGradient id="hs-curve-grad-bad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--hs-red)" />
              </linearGradient>
            ) : (
              <linearGradient id="hs-curve-grad-good" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--hs-green)" />
              </linearGradient>
            )}
          </defs>
          {/* Grid axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} className="hs-grid" />
          <line x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} className="hs-grid" />

          {/* Final position dashed line at y=1 */}
          <line
            x1={PAD}
            y1={sy(1)}
            x2={SIZE - PAD}
            y2={sy(1)}
            className="hs-final-line"
          />

          {/* Diagonal reference line (linear identity) */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} className="hs-diag" />

          {/* The bezier curve */}
          <path
            d={`M ${sx(0)},${sy(0)} C ${sx(x1)},${sy(y1)} ${sx(x2)},${sy(y2)} ${sx(1)},${sy(1)}`}
            className="hs-curve"
            style={{ stroke: bad ? "url(#hs-curve-grad-bad)" : "url(#hs-curve-grad-good)" }}
          />

          {/* Angle arc between tangent and horizontal (bad case only) */}
          {bad && (
            <path
              d={`M ${arcHx},${sy(1)} A ${arcR},${arcR} 0 0,0 ${arcTx},${arcTy}`}
              className="hs-arc"
            />
          )}

          {/* Handles + dots rendered last so they sit on top */}
          {/* Top-right control point handle (when P2 ≠ endpoint) */}
          {h2Len > 0.01 && (
            <>
              <line x1={sx(1)} y1={sy(1)} x2={sx(x2)} y2={sy(y2)} className="hs-handle-good" />
              <circle cx={sx(x2)} cy={sy(y2)} r="6" className="hs-ep-good" />
            </>
          )}

          {/* Tangent direction handle for bad case (when P2 = endpoint) */}
          {bad && h2Len <= 0.01 && (
            <>
              <line
                x1={sx(1)} y1={sy(1)}
                x2={sx(1 - ndx * 0.7)} y2={sy(1 - ndy * 0.7)}
                className="hs-handle-bad"
              />
              <circle
                cx={sx(1 - ndx * 0.7)} cy={sy(1 - ndy * 0.7)}
                r="6" className="hs-ep-bad"
              />
            </>
          )}

          {/* Endpoint dot */}
          <circle
            cx={sx(1)} cy={sy(1)} r="7"
            className={bad ? "hs-ep-bad" : "hs-ep-good"}
          />

        </svg>
      </div>

      {/* Motion track */}
      <div className="hs-track">
        <div className="hs-ball" style={{ "--hs-curve": css } as React.CSSProperties} />
      </div>

      <div className="hs-desc">{desc}</div>
    </div>
  );
}

export function HardStops() {
  return (
    <section id="hard-stops">
      <p className="section-label">Hard Stops</p>
      <Prose>
        <p>
          There's a problem most developers never notice but every motion
          designer knows. Standard easing curves end with a non-tangential
          edge: the curve hits the final position at an angle instead of
          easing into it. That angle is a velocity discontinuity: the object
          is still moving when it arrives, so it snaps to a halt. This is
          a <strong>hard stop</strong>.
        </p>
        <p>
          Springs try to mask this with physics simulation, but they introduce
          oscillation and ringing that's difficult to control precisely. The
          real fix is simpler: <strong>shape the curve</strong> so it arrives
          tangent to the final position. Velocity decays to zero
          continuously. No sudden corner, no overshoot needed.
        </p>
        <p>
          Compare CSS <code>ease-in</code> with Dease's{" "}
          <code>EASE_IN_DEFAULT</code> below. Look at the endpoint, where the
          curve meets the top. The dashed line is the ideal tangent direction
          (horizontal, meaning zero velocity). The CSS curve's tangent arrives
          at a steep angle. That gap is the hard stop. The Dease curve arrives
          flat, perfectly tangent, so velocity reaches zero smoothly.
        </p>
      </Prose>

      <div className="hs-comparison">
        <TangentCurve
          tag="CSS Default"
          name="ease-in"
          value={CSS_EASE_IN}
          desc="Steep arrival angle: velocity discontinuity at the endpoint creates a hard stop"
          bad
        />
        <TangentCurve
          tag="Dease"
          name="EASE_IN_DEFAULT"
          value={DEASE_DEFAULT}
          desc="Tangential arrival: velocity decays continuously to zero, no hard corner"
        />
      </div>

      <style>{`
        .hs-comparison {
          --hs-red: #e07055;
          --hs-red-bg: rgba(224, 112, 85, 0.15);
          --hs-green: #55b87a;
          --hs-green-bg: rgba(85, 184, 122, 0.15);
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .hs-card {
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }
        .hs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
        }
        .hs-tag {
          font-size: 11px;
          color: var(--text-muted);
        }
        .hs-tag-dease {
          color: var(--accent);
        }
        .hs-code {
          font-size: 11px;
          color: var(--text-muted);
        }
        .hs-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px 28px 28px;
        }
        .hs-svg {
          width: 100%;
          height: auto;
        }
        .hs-grid {
          stroke: var(--border);
          stroke-width: 1;
        }
        .hs-final-line {
          stroke: var(--text-muted);
          stroke-width: 0.75;
          stroke-dasharray: 4 3;
          opacity: 0.35;
        }
        .hs-diag {
          stroke: var(--text-muted);
          stroke-width: 0.75;
          stroke-dasharray: 4 3;
          opacity: 0.25;
        }
        .hs-handle {
          stroke: var(--text-muted);
          stroke-width: 2;
          stroke-dasharray: 3 3;
          opacity: 0.5;
        }
        .hs-handle-bad {
          stroke: var(--hs-red);
          stroke-width: 2;
          stroke-dasharray: 3 3;
          opacity: 0.7;
        }
        .hs-handle-good {
          stroke: var(--hs-green);
          stroke-width: 2;
          stroke-dasharray: 3 3;
          opacity: 0.7;
        }
        .hs-curve {
          fill: none;
          stroke: var(--accent);
          stroke-width: 2;
          stroke-linecap: round;
        }
        .hs-arc {
          fill: none;
          stroke: var(--hs-red);
          stroke-width: 1.5;
          opacity: 0.6;
        }
        .hs-ep-bad {
          fill: var(--hs-red);
        }
        .hs-ep-good {
          fill: var(--hs-green);
        }
        .hs-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 9999px;
          width: fit-content;
          margin: 18px 28px 0 auto;
        }
        .hs-pill-bad {
          background: var(--hs-red-bg);
          color: var(--hs-red);
        }
        .hs-pill-good {
          background: var(--hs-green-bg);
          color: var(--hs-green);
        }
        .hs-track {
          height: 24px;
          margin: 0 16px 16px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          container-type: inline-size;
          --inset: 4px;
        }
        .hs-ball {
          position: absolute;
          top: var(--inset);
          left: var(--inset);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          animation: hs-slide 3.6s infinite;
          animation-timing-function: var(--hs-curve);
        }
        @keyframes hs-slide {
          0%   { transform: translateX(0); }
          35%  { transform: translateX(calc(100cqw - 16px - var(--inset) * 2)); }
          50%  { transform: translateX(calc(100cqw - 16px - var(--inset) * 2)); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        .hs-desc {
          font-size: 12px;
          color: var(--text-muted);
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          line-height: 1.5;
        }
        [data-theme="light"] .hs-comparison {
          --hs-red: #c0392b;
          --hs-red-bg: rgba(192, 57, 43, 0.15);
          --hs-green: #27864a;
          --hs-green-bg: rgba(39, 134, 74, 0.15);
        }
        @media (max-width: 600px) {
          .hs-comparison {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
