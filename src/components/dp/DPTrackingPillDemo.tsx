import { useTrackingPill } from "directional-persistence";
import type { TrackingPillMode } from "directional-persistence";
import { useState } from "react";
import { Prose } from "../Prose";

const TABS = ["Home", "Features", "Pricing", "About", "Contact"];

function PillNav({
  mode,
  label,
}: {
  mode: TrackingPillMode;
  label: string;
}) {
  const { containerRef, pillRef, track, hide } = useTrackingPill({
    mode,
  });
  const [selected, setSelected] = useState(0);

  return (
    <div className="dp-pill-demo-card">
      <p className="dp-pill-demo-label">{label}</p>
      <nav
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="dp-pill-nav"
        onMouseLeave={hide}
      >
        <div ref={pillRef as React.RefObject<HTMLDivElement>} className="dp-pill-indicator" />
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`dp-pill-tab${selected === i ? " selected" : ""}`}
            onMouseEnter={(e) => track(e.currentTarget)}
            onClick={() => setSelected(i)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>
      <p className="dp-pill-hint">Hover across the tabs</p>
    </div>
  );
}

export function DPTrackingPillDemo() {
  return (
    <section id="dp-tracking-pill">
      <p className="section-label">useTrackingPill</p>
      <Prose>
        <p>
          A single pill element that <strong>glides</strong> between targets as
          you hover. Two modes: <code>glide</code> smoothly transitions
          position and size, while <code>snap</code> teleports with a
          directional offset then slides into place.
        </p>
      </Prose>

      <div className="dp-pill-demos">
        <PillNav mode="glide" label="Glide mode" />
        <PillNav mode="snap" label="Snap mode" />
      </div>

      <style>{`
        .dp-pill-demos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .dp-pill-demo-card {
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
        }
        .dp-pill-demo-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: lowercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .dp-pill-nav {
          position: relative;
          display: flex;
          gap: 2px;
          background: var(--bg);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid var(--border);
        }
        .dp-pill-indicator {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--bg-hover);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
        }
        .dp-pill-tab {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 8px 0;
          font-size: 13px;
          color: var(--text-muted);
          background: none;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: color var(--dur-1) var(--ease-in-snappy);
          white-space: nowrap;
          text-align: center;
        }
        .dp-pill-tab:hover {
          color: var(--text);
        }
        .dp-pill-tab.selected {
          color: var(--accent);
        }
        .dp-pill-hint {
          margin-top: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
