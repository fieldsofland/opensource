import { useActiveTrackingPill } from "directional-persistence";
import type { TrackingPillMode } from "directional-persistence";
import { useRef, useState, useEffect } from "react";
import { Prose } from "../Prose";

const TABS = ["Home", "Features", "Pricing", "About", "Contact"];

function ActivePillNav({
  mode,
  label,
}: {
  mode: TrackingPillMode;
  label: string;
}) {
  const {
    containerRef,
    hoverPillRef,
    activePillRef,
    trackHover,
    hideHover,
    trackActive,
  } = useActiveTrackingPill({ mode });

  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Position active pill on initial render
  useEffect(() => {
    const tab = tabRefs.current[selected];
    if (tab) trackActive(tab);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (index: number, target: HTMLElement) => {
    if (index === selected) return;
    setSelected(index);
    hideHover(true); // instant hide before active animates
    trackActive(target);
  };

  return (
    <div className="dp-apill-demo-card">
      <p className="dp-apill-demo-label">{label}</p>
      <nav
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="dp-apill-nav"
        onMouseLeave={() => hideHover()}
      >
        {/* Hover pill (behind) */}
        <div
          ref={hoverPillRef as React.RefObject<HTMLDivElement>}
          className="dp-apill-hover"
        />
        {/* Active pill (on top) */}
        <div
          ref={activePillRef as React.RefObject<HTMLDivElement>}
          className="dp-apill-active"
        />
        {TABS.map((tab, i) => (
          <button
            key={tab}
            ref={(el) => { tabRefs.current[i] = el; }}
            className={`dp-apill-tab${selected === i ? " selected" : ""}`}
            onMouseEnter={(e) => trackHover(e.currentTarget)}
            onClick={(e) => handleClick(i, e.currentTarget)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>
      <p className="dp-apill-hint">Hover to preview, click to select</p>
    </div>
  );
}

export function DPActiveTrackingPillDemo() {
  return (
    <section id="dp-active-pill">
      <p className="section-label">useTrackingPill</p>
      <Prose>
        <p>
          Two coordinated pills: a <strong>hover pill</strong> (behind) previews
          on mouseover, while an <strong>active pill</strong> (on top) persists
          on the selected item. The hover pill auto-hides when you hover the
          active tab and instantly disappears on click before the active pill
          animates to its new position.
        </p>
      </Prose>

      <div className="dp-apill-demos">
        <ActivePillNav mode="glide" label="Glide mode" />
        <ActivePillNav mode="snap" label="Snap mode" />
      </div>

      <style>{`
        .dp-apill-demos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .dp-apill-demo-card {
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
        }
        .dp-apill-demo-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: lowercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .dp-apill-nav {
          position: relative;
          display: flex;
          gap: 2px;
          background: var(--bg);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid var(--border);
        }
        .dp-apill-hover {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--bg-hover);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
        }
        .dp-apill-active {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--border);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0.55;
          z-index: 1;
        }
        .dp-apill-tab {
          position: relative;
          z-index: 2;
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
        .dp-apill-tab:hover {
          color: var(--text);
        }
        .dp-apill-tab.selected {
          color: var(--accent);
        }
        .dp-apill-hint {
          margin-top: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
