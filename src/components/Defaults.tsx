import { Prose } from "./Prose";

const CSS_DEFAULTS = [
  { name: "linear", value: "linear" },
  { name: "ease", value: "ease" },
  { name: "ease-in", value: "ease-in" },
  { name: "ease-out", value: "ease-out" },
  { name: "ease-in-out", value: "ease-in-out" },
];

export function Defaults() {
  return (
    <section id="defaults">
      <p className="section-label">The Default Problem</p>
      <Prose>
        <p>
          CSS ships five easing keywords: <code>linear</code>, <code>ease</code>,{" "}
          <code>ease-in</code>, <code>ease-out</code>, and{" "}
          <code>ease-in-out</code>. Framer Motion defaults to spring physics or{" "}
          <code>ease</code>. Most designers never change them.
        </p>
        <p>
          The result is that every app, every marketing site, every component
          library feels subtly the same, weightless, generic. Transitions
          happen, but they don't <strong>mean</strong> anything. Buttons don't
          feel like they have mass. Modals don't feel like they're arriving from
          somewhere real.
        </p>
        <p>
          Watch all five CSS defaults run the same animation. Notice how similar
          they look, and how none of them feel particularly intentional.
        </p>
      </Prose>
      <div className="defaults-grid">
        {CSS_DEFAULTS.map((d) => (
          <div className="defaults-row" key={d.name}>
            <code className="defaults-name">{d.name}</code>
            <div className="defaults-track">
              <div
                className="defaults-bar"
                style={{ "--curve": d.value } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .defaults-grid {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .defaults-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 16px;
          align-items: center;
        }
        .defaults-name {
          font-size: 12px;
          color: var(--text-muted);
        }
        .defaults-track {
          height: 24px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          container-type: inline-size;
          padding: 4px;
        }
        .defaults-bar {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          animation: defaults-slide 3.6s infinite;
          animation-timing-function: var(--curve);
        }
        @keyframes defaults-slide {
          0%   { transform: translateX(0); }
          35%  { transform: translateX(calc(100cqw - 24px)); }
          50%  { transform: translateX(calc(100cqw - 24px)); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
