import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FADE_IN_OUT,
  FADE_IN_OUT_SMOOTH,
  SMOOTH_EASE_IN_ENTER,
  CARD_TRANSITION,
  BOTTOM_SHEET_BACKDROP,
  BOTTOM_SHEET_SLIDE,
  STAGGER_CONTAINER,
  STAGGER_ITEM,
} from "dease";
import { Prose } from "./Prose";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

/** Hover-triggered card — entrance animation always completes before exit can fire.
 *  On mobile: autoplay loop when the card is in the middle 50% of the viewport. */
function HoverCard({
  name,
  curve,
  children,
  minDisplay = 400,
  entranceDuration = 350,
  exitDuration = 300,
}: {
  name: string;
  curve: string;
  children: (visible: boolean) => React.ReactNode;
  minDisplay?: number;
  entranceDuration?: number;
  exitDuration?: number;
}) {
  const [visible, setVisible] = useState(false);
  const showTimeRef = useRef(0);
  const entranceDoneRef = useRef(true);
  const wantsHideRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const entranceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // ── Desktop: hover logic ──────────────────────────────
  function scheduleHide() {
    const elapsed = Date.now() - showTimeRef.current;
    const wait = Math.max(0, minDisplay - elapsed);
    if (wait === 0) {
      setVisible(false);
    } else {
      timerRef.current = setTimeout(() => setVisible(false), wait);
    }
  }

  function show() {
    clearTimeout(timerRef.current);
    clearTimeout(entranceTimerRef.current);
    wantsHideRef.current = false;
    entranceDoneRef.current = false;
    setVisible(true);
    showTimeRef.current = Date.now();

    entranceTimerRef.current = setTimeout(() => {
      entranceDoneRef.current = true;
      if (wantsHideRef.current) {
        wantsHideRef.current = false;
        scheduleHide();
      }
    }, entranceDuration);
  }

  function hide() {
    clearTimeout(timerRef.current);
    if (!entranceDoneRef.current) {
      wantsHideRef.current = true;
      return;
    }
    scheduleHide();
  }

  // ── Mobile: IntersectionObserver autoplay loop ────────
  const loopTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const inViewRef = useRef(false);
  const loopVisibleRef = useRef(false);

  useEffect(() => {
    if (!isMobile) return;
    const el = cardRef.current;
    if (!el) return;

    function tick() {
      if (!inViewRef.current) return;
      loopVisibleRef.current = !loopVisibleRef.current;
      setVisible(loopVisibleRef.current);
      const wait = loopVisibleRef.current
        ? entranceDuration + minDisplay
        : exitDuration + 400;
      loopTimerRef.current = setTimeout(tick, wait);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = inViewRef.current;
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasInView) {
          loopVisibleRef.current = false;
          clearTimeout(loopTimerRef.current);
          // Start first cycle after a brief pause
          loopTimerRef.current = setTimeout(tick, 200);
        } else if (!entry.isIntersecting && wasInView) {
          clearTimeout(loopTimerRef.current);
          loopVisibleRef.current = false;
          setVisible(false);
        }
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(loopTimerRef.current);
    };
  }, [isMobile, entranceDuration, minDisplay, exitDuration]);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearTimeout(entranceTimerRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      className="preset-card"
      onMouseEnter={isMobile ? undefined : show}
      onMouseLeave={isMobile ? undefined : hide}
    >
      <div className="preset-stage">{children(visible)}</div>
      <div className="preset-footer">
        <div className="preset-footer-left">
          <span className="mono preset-name">{name}</span>
          <span className="preset-curve">{curve}</span>
        </div>
        <span className="preset-replay">{isMobile ? "auto" : "hover to preview"}</span>
      </div>
    </div>
  );
}

function FadeDemo() {
  return (
    <HoverCard name="FADE_IN_OUT" curve="easeInOut" entranceDuration={200}>
      {(visible) => (
        <AnimatePresence mode="wait">
          {visible && <motion.div key="fade" className="demo-box" {...FADE_IN_OUT} />}
        </AnimatePresence>
      )}
    </HoverCard>
  );
}

function FadeSmoothDemo() {
  return (
    <HoverCard name="FADE_IN_OUT_SMOOTH" curve="EASE_IN_SMOOTH" entranceDuration={1000}>
      {(visible) => (
        <AnimatePresence mode="wait">
          {visible && <motion.div key="fade-smooth" className="demo-box" {...FADE_IN_OUT_SMOOTH} />}
        </AnimatePresence>
      )}
    </HoverCard>
  );
}

function EntranceDemo() {
  return (
    <HoverCard name="SMOOTH_EASE_IN_ENTER" curve="EASE_IN_DEFAULT">
      {(visible) => (
        <AnimatePresence mode="wait">
          {visible && <motion.div key="entrance" className="demo-box" {...SMOOTH_EASE_IN_ENTER} />}
        </AnimatePresence>
      )}
    </HoverCard>
  );
}

function CardDemo() {
  return (
    <HoverCard name="CARD_TRANSITION" curve="EASE_IN_SNAPPY" entranceDuration={150}>
      {(visible) => (
        <AnimatePresence mode="wait">
          {visible && <motion.div key="card" className="demo-box" {...CARD_TRANSITION} />}
        </AnimatePresence>
      )}
    </HoverCard>
  );
}

function BottomSheetDemo() {
  return (
    <HoverCard name="BOTTOM_SHEET_SLIDE" curve="EASE_IN_SNAPPY" minDisplay={500}>
      {(visible) => (
        <div className="sheet-stage">
          <AnimatePresence>
            {visible && (
              <>
                <motion.div key="bd" className="sheet-backdrop" {...BOTTOM_SHEET_BACKDROP} />
                <motion.div key="pn" className="sheet-panel" {...BOTTOM_SHEET_SLIDE} />
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </HoverCard>
  );
}

function StaggerDemo() {
  return (
    <HoverCard name="STAGGER_CONTAINER + STAGGER_ITEM" curve="EASE_IN_DEFAULT → EASE_IN_SNAPPY" minDisplay={500}>
      {(visible) => (
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key="stagger"
              className="stagger-grid"
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div key={i} className="stagger-dot" variants={STAGGER_ITEM} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </HoverCard>
  );
}


export function PresetDemo() {
  return (
    <section id="presets">
      <p className="section-label">Ready-Made Presets</p>
      <Prose>
        <p>
          For Framer Motion, we ship complete preset objects. Spread them
          directly onto <code>&lt;motion.div&gt;</code>, no configuration
          needed. Each preset pairs a curve with a duration and property set
          that works out of the box.
        </p>
      </Prose>
      <p className="preset-hint">Hover any card to preview.</p>
      <div className="preset-grid">
        <FadeDemo />
        <FadeSmoothDemo />
        <EntranceDemo />
        <CardDemo />
        <BottomSheetDemo />
        <StaggerDemo />
      </div>

      <style>{`
        .preset-hint {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .preset-hint code {
          font-size: 12px;
          color: var(--text);
          background: var(--bg-raised);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .preset-card {
          background: var(--bg-raised);
          border: none;
          border-radius: var(--radius);
          padding: 0;
          cursor: default;
          color: var(--text);
          text-align: left;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px var(--border);
          transition: box-shadow 0.15s var(--ease-in-default);
          width: 100%;
        }
        .preset-card:hover {
          box-shadow: var(--card-hover-shadow);
        }
        .preset-stage {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .preset-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          gap: 8px;
        }
        .preset-footer-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .preset-name {
          font-size: 11px;
          color: var(--accent);
        }
        .preset-curve {
          font-size: 10px;
          color: var(--text-muted);
        }
        .preset-replay {
          font-size: 10px;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Demo elements */
        .demo-box {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--text-muted);
        }

        /* Bottom sheet mini */
        .sheet-stage {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }
        .sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(128, 128, 128, 0.15);
        }
        .sheet-panel {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 60%;
          background: var(--text-muted);
          border-radius: 8px 8px 0 0;
        }

        /* Stagger */
        .stagger-grid {
          display: flex;
          gap: 8px;
        }
        .stagger-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
