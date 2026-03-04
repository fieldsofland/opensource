import { Prose } from "./Prose";

const COMPARISONS = [
  {
    label: "Translation",
    type: "translate" as const,
    cssDefault: { name: "ease", value: "ease" },
    dease: {
      name: "EASE_IN_SNAPPY",
      value: "cubic-bezier(0.1, 0, 0, 1)",
    },
  },
  {
    label: "Scale",
    type: "scale" as const,
    cssDefault: { name: "ease-in-out", value: "ease-in-out" },
    dease: { name: "EASE_IN_SMOOTH", value: "cubic-bezier(0.6, 0, 0, 1)" },
  },
  {
    label: "Rotation",
    type: "rotate" as const,
    cssDefault: { name: "linear", value: "linear" },
    dease: {
      name: "EASE_QUAD_60",
      value: "cubic-bezier(0.6, 0, 0.3, 1)",
    },
  },
  {
    label: "Combined",
    type: "combined" as const,
    cssDefault: { name: "ease", value: "ease" },
    dease: {
      name: "EASE_IN_DEFAULT",
      value: "cubic-bezier(0.4, 0, 0, 1)",
    },
  },
];

function ComparisonRow({
  label,
  type,
  cssDefault,
  dease,
}: (typeof COMPARISONS)[number]) {
  const animClass = `comp-anim-${type}`;

  return (
    <div className="comp-row">
      <span className="comp-row-label">{label}</span>
      <div className="comp-pair">
        <div className="comp-lane">
          <div className="comp-lane-header">
            <span className="comp-tag">CSS Default</span>
            <code className="comp-value">{cssDefault.name}</code>
          </div>
          <div className="comp-track">
            <div
              className={`comp-box ${animClass}`}
              style={{ animationTimingFunction: cssDefault.value }}
            />
          </div>
        </div>
        <div className="comp-lane">
          <div className="comp-lane-header">
            <span className="comp-tag comp-tag-tf">Dease</span>
            <code className="comp-value">{dease.name}</code>
          </div>
          <div className="comp-track">
            <div
              className={`comp-box ${animClass}`}
              style={{ animationTimingFunction: dease.value }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Comparison() {
  return (
    <section id="comparison">
      <p className="section-label">Weight & Feel</p>
      <Prose>
        <p>
          Good easing creates <strong>perceived mass</strong>. Elements that
          decelerate into position feel like they have weight. Elements that move
          at constant speed feel like they're on rails, mechanical, not physical.
        </p>
        <p>
          Easing also communicates hierarchy. Fast, snappy curves say "minor
          adjustment." Slower curves with clear deceleration say "pay attention,
          something changed." <strong>The curve is the tone of voice.</strong>
        </p>
        <p>
          Watch the same motion with a CSS default and a Dease curve.
          Same keyframes, same duration, different feel entirely.
        </p>
      </Prose>
      <div className="comp-grid">
        {COMPARISONS.map((c) => (
          <ComparisonRow key={c.type} {...c} />
        ))}
      </div>

      <style>{`
        .comp-grid {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .comp-row-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 12px;
          display: block;
        }
        .comp-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .comp-lane {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .comp-lane-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .comp-tag {
          font-size: 11px;
          color: var(--text-muted);
        }
        .comp-tag-tf {
          color: var(--accent);
        }
        .comp-track {
          height: 56px;
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          background: var(--bg-raised);
        }
        .comp-box {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background: var(--accent);
          opacity: 0.7;
          position: absolute;
          top: 8px;
          left: 8px;
        }
        .comp-value {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Translation */
        @keyframes comp-translate {
          0%   { transform: translateX(0); }
          35%  { transform: translateX(calc(100cqw - 56px)); }
          50%  { transform: translateX(calc(100cqw - 56px)); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        .comp-track {
          container-type: inline-size;
        }
        .comp-anim-translate {
          animation: comp-translate 3.6s infinite;
        }

        /* Scale */
        @keyframes comp-scale {
          0%   { transform: scale(0.5); }
          35%  { transform: scale(1); }
          50%  { transform: scale(1); }
          85%  { transform: scale(0.5); }
          100% { transform: scale(0.5); }
        }
        .comp-anim-scale {
          position: relative;
          margin: 0 auto;
          left: auto;
          animation: comp-scale 3.6s infinite;
        }

        /* Rotation */
        @keyframes comp-rotate {
          0%   { transform: rotate(0deg); }
          35%  { transform: rotate(180deg); }
          50%  { transform: rotate(180deg); }
          85%  { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .comp-anim-rotate {
          position: relative;
          margin: 0 auto;
          left: auto;
          animation: comp-rotate 3.6s infinite;
        }

        /* Combined: rotate + slide + scale */
        @keyframes comp-combined {
          0%   { transform: translateX(0) rotate(0deg) scale(0.6); }
          35%  { transform: translateX(calc(100cqw - 56px)) rotate(90deg) scale(1); }
          50%  { transform: translateX(calc(100cqw - 56px)) rotate(90deg) scale(1); }
          85%  { transform: translateX(0) rotate(0deg) scale(0.6); }
          100% { transform: translateX(0) rotate(0deg) scale(0.6); }
        }
        .comp-anim-combined {
          animation: comp-combined 3.6s infinite;
        }

        @media (max-width: 600px) {
          .comp-pair {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
