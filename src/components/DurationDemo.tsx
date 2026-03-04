import { useRef, useCallback } from "react";
import { Prose } from "./Prose";

const DURATIONS = [
  { name: "DUR_0", ms: 0, css: "var(--dur-0)" },
  { name: "DUR_1", ms: 100, css: "var(--dur-1)" },
  { name: "DUR_2", ms: 200, css: "var(--dur-2)" },
  { name: "DUR_3", ms: 350, css: "var(--dur-3)" },
  { name: "DUR_4", ms: 500, css: "var(--dur-4)" },
  { name: "DUR_5", ms: 750, css: "var(--dur-5)" },
  { name: "DUR_6", ms: 1000, css: "var(--dur-6)" },
  { name: "DUR_7", ms: 1500, css: "var(--dur-7)" },
  { name: "DUR_8", ms: 2000, css: "var(--dur-8)" },
];

const PAUSE = 750;

export function DurationDemo() {
  const ballsRef = useRef<(HTMLDivElement | null)[]>([]);
  const drainTimerRef = useRef<number | null>(null);
  const fillTimeRef = useRef(0);
  const pendingDrainRef = useRef(false);

  const maxMs = DURATIONS[DURATIONS.length - 1].ms;

  const doDrain = useCallback(() => {
    ballsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = `transform ${DURATIONS[i].ms}ms var(--ease-in-snappy)`;
      el.style.transform = "translateX(0)";
    });
    pendingDrainRef.current = false;
  }, []);

  const animatingRef = useRef(false);

  const fillAll = useCallback(() => {
    if (animatingRef.current) {
      if (drainTimerRef.current) {
        clearTimeout(drainTimerRef.current);
        drainTimerRef.current = null;
      }
      pendingDrainRef.current = false;
      return;
    }

    if (drainTimerRef.current) {
      clearTimeout(drainTimerRef.current);
      drainTimerRef.current = null;
    }
    pendingDrainRef.current = false;
    animatingRef.current = true;

    ballsRef.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.transform = "translateX(0)";
    });
    void ballsRef.current[0]?.offsetWidth;

    fillTimeRef.current = Date.now();
    ballsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = `transform ${DURATIONS[i].ms}ms var(--ease-in-snappy)`;
      el.style.transform = `translateX(calc(100cqw - 24px))`;
    });

    window.setTimeout(() => {
      animatingRef.current = false;
    }, maxMs + PAUSE);
  }, [maxMs]);

  const drainAll = useCallback(() => {
    const elapsed = Date.now() - fillTimeRef.current;
    const waitUntil = maxMs + PAUSE;
    const remaining = waitUntil - elapsed;

    if (remaining > 0) {
      pendingDrainRef.current = true;
      drainTimerRef.current = window.setTimeout(doDrain, remaining);
    } else {
      doDrain();
    }
  }, [doDrain, maxMs]);

  return (
    <section id="durations">
      <p className="section-label">Timing Matters Too</p>
      <Prose>
        <p>
          The curve shapes the feel, but <strong>the duration sets the pace</strong>. Too fast
          and transitions feel jittery. Too slow and your app feels sluggish.
          These nine tiers cover every use case, from instant state changes
          to deliberate, dramatic reveals.
        </p>
      </Prose>
      <div
        className="duration-card"
        onMouseEnter={fillAll}
        onMouseLeave={drainAll}
      >
        <div className="duration-stage">
          {DURATIONS.map((d, i) => (
            <div className="duration-row" key={d.name}>
              <span className="duration-name mono">{d.name}</span>
              <div className="duration-track">
                <div
                  ref={(el) => {
                    ballsRef.current[i] = el;
                  }}
                  className="duration-ball"
                />
              </div>
              <span className="duration-ms mono">{d.ms}ms</span>
            </div>
          ))}
        </div>
        <div className="duration-footer">
          <div className="duration-footer-left">
            <span className="mono duration-footer-name">DUR_0 – DUR_8</span>
            <span className="duration-footer-curve">EASE_IN_SNAPPY</span>
          </div>
          <span className="duration-footer-hint">hover to compare</span>
        </div>
      </div>

      <style>{`
        .duration-card {
          margin-top: 32px;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          cursor: default;
          transition: box-shadow 0.15s var(--ease-in-default);
        }
        .duration-card:hover {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .duration-stage {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
        .duration-row {
          display: grid;
          grid-template-columns: 80px 1fr 50px;
          gap: 16px;
          align-items: center;
          padding: 10px 14px;
        }
        .duration-row + .duration-row {
          border-top: 1px solid var(--border);
        }
        .duration-name {
          font-size: 12px;
          color: var(--text-muted);
          text-align: left;
        }
        .duration-track {
          height: 24px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          container-type: inline-size;
          padding: 4px;
        }
        .duration-ball {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
        }
        .duration-ms {
          font-size: 12px;
          color: var(--text-muted);
          text-align: right;
        }
        .duration-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          gap: 8px;
        }
        .duration-footer-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .duration-footer-name {
          font-size: 11px;
          color: var(--accent);
        }
        .duration-footer-curve {
          font-size: 10px;
          color: var(--text-muted);
        }
        .duration-footer-hint {
          font-size: 10px;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
