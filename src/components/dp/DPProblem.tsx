import { useState } from "react";
import {
  DirectionalGroup,
  useGroupItem,
  useGroupContent,
} from "directional-persistence";
import { Prose } from "../Prose";

const NAV_ITEMS = ["Dashboard", "Projects", "Settings", "Profile"];

function NaiveDemo() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="dp-problem-demo">
      <p className="dp-problem-label">Naive hover</p>
      <div className="dp-problem-nav">
        {NAV_ITEMS.map((label, i) => (
          <div key={label} className="dp-problem-item-wrapper">
            <button
              className={`dp-problem-item${hovered === i ? " active" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              type="button"
            >
              {label}
            </button>
            {hovered === i && (
              <div
                className="dp-problem-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <p className="dp-problem-card-title">{label}</p>
                <p className="dp-problem-card-desc">
                  Move your cursor from trigger to card. It flickers because the
                  gap triggers a mouseleave.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersistentSlot({ index, label }: { index: number; label: string }) {
  const { triggerProps, isActive } = useGroupItem(index);
  const { direction, contentProps } = useGroupContent(index);

  return (
    <div className="dp-problem-item-wrapper">
      <button
        className={`dp-problem-item${isActive ? " active" : ""}`}
        {...triggerProps}
        type="button"
      >
        {label}
      </button>
      {isActive && (
        <div className="dp-problem-card" {...contentProps}>
          <div className="dp-problem-card-direction">
            {direction ?? "initial"}
          </div>
          <p className="dp-problem-card-title">{label}</p>
          <p className="dp-problem-card-desc">
            Smooth entry. No flicker. The card stays open while your cursor
            travels across the gap.
          </p>
        </div>
      )}
    </div>
  );
}

function PersistentDemo() {
  return (
    <div className="dp-problem-demo">
      <p className="dp-problem-label">DirectionalGroup</p>
      <DirectionalGroup openDelay={75} closeDelay={150}>
        <div className="dp-problem-nav dp-problem-nav--persistent">
          {NAV_ITEMS.map((label, i) => (
            <PersistentSlot key={label} index={i} label={label} />
          ))}
        </div>
      </DirectionalGroup>
    </div>
  );
}

export function DPProblem() {
  return (
    <section id="dp-problem">
      <p className="section-label">The Problem</p>
      <Prose>
        <p>
          Hover-triggered content is everywhere&mdash;nav menus, tooltips,
          preview cards. But <strong>the gap between trigger and content</strong>{" "}
          fires a mouseleave, killing the popover before the cursor arrives.
          Most solutions pile on timers and rectangles. Directional persistence
          solves it with two primitives.
        </p>
      </Prose>

      <div className="dp-problem-grid">
        <NaiveDemo />
        <PersistentDemo />
      </div>

      <style>{`
        .dp-problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .dp-problem-demo {
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          min-height: 280px;
        }
        .dp-problem-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: lowercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .dp-problem-nav {
          display: flex;
          gap: 4px;
        }
        .dp-problem-item-wrapper {
          position: relative;
        }
        .dp-problem-item {
          padding: 8px 14px;
          font-size: 13px;
          color: var(--text-muted);
          background: none;
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: color var(--dur-1) var(--ease-in-snappy), border-color var(--dur-1) var(--ease-in-snappy);
          white-space: nowrap;
        }
        .dp-problem-item:hover,
        .dp-problem-item.active {
          color: var(--text);
          border-color: var(--border);
        }
        .dp-problem-card {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 220px;
          padding: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          z-index: 10;
        }
        .dp-problem-card-direction {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 8px;
          padding: 2px 8px;
          background: var(--bg-raised);
          border-radius: 4px;
          display: inline-block;
        }
        .dp-problem-card-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }
        .dp-problem-card-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
