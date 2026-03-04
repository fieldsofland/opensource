import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EASE_IN_SNAPPY_CSS,
  EASE_IN_DEFAULT,
  EASE_IN_DEFAULT_CSS,
  EASE_IN_SMOOTH_CSS,
  EASE_QUAD_60_CSS,
} from "dease";
import { useActiveTrackingPill } from "directional-persistence";
import NumberFlow, { type Format } from "@number-flow/react";
import { Prose } from "./Prose";

/* ── Animated number (counts up from 0 on mount) ──────────── */

function AnimatedValue({
  value,
  prefix,
  suffix,
  format,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: Format;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <NumberFlow
      value={display}
      prefix={prefix}
      suffix={suffix}
      format={format}
      transformTiming={{ duration: 750, easing: EASE_IN_DEFAULT_CSS }}
    />
  );
}

const NAV_ITEMS = ["Overview", "Analytics", "Reports", "Settings"];

/* ── Staggered blur + opacity variants ─────────────────────── */

const GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
  exit: {},
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 8 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.35, ease: EASE_IN_DEFAULT },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.15 },
  },
};

/* ── Shared constants ──────────────────────────────────────── */

const MINI_CURVES = [
  { name: "SNAPPY", css: "cubic-bezier(0.1, 0, 0, 1)" },
  { name: "DEFAULT", css: "cubic-bezier(0.4, 0, 0, 1)" },
  { name: "SMOOTH", css: "cubic-bezier(0.6, 0, 0, 1)" },
];

const RING_R = 32;
const RING_C = 2 * Math.PI * RING_R;
const RING_PCT = 73;
const RING_OFFSET = RING_C * (1 - RING_PCT / 100);

/* ── Overview Cards ────────────────────────────────────────── */

const TASKS = [
  { label: "Install package", done: true },
  { label: "Import curves", done: true },
  { label: "Add transitions", done: false },
];

function ChecklistCard() {
  const [tasks, setTasks] = useState(TASKS);
  function toggle(i: number) {
    setTasks((prev) => prev.map((t, j) => (j === i ? { ...t, done: !t.done } : t)));
  }
  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-checklist">
        <span className="widget-checklist-title">Setup</span>
        {tasks.map((t, i) => (
          <button
            key={t.label}
            className="widget-checklist-row"
            onClick={() => toggle(i)}
            type="button"
          >
            <span className="widget-check" data-done={t.done}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                <path
                  d="M2.5 6l2.5 2.5 4.5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="widget-checklist-label" data-done={t.done}>{t.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ProgressRingCard() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setActive(true), 330);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-ring">
        <div className="widget-ring-graphic">
          <svg className="widget-ring-svg" viewBox="0 0 80 80">
            <circle className="widget-ring-bg" cx="40" cy="40" r={RING_R} />
            <circle
              className="widget-ring-fill"
              cx="40"
              cy="40"
              r={RING_R}
              strokeDasharray={RING_C}
              strokeDashoffset={active ? RING_OFFSET : RING_C}
            />
          </svg>
          <span className="widget-ring-pct">
            <AnimatedValue value={active ? RING_PCT : 0} suffix="%" />
          </span>
        </div>
        <span className="widget-ring-label">Progress</span>
      </div>

    </motion.div>
  );
}

function CurveSlidersCard() {
  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-curves">
        <span className="widget-curves-title">Curves</span>
        {MINI_CURVES.map((c) => (
          <div key={c.name} className="widget-curves-row">
            <span className="widget-curves-name">{c.name}</span>
            <div className="widget-curves-track">
              <div
                className="widget-curves-ball"
                style={{ animationTimingFunction: c.css }}
              />
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}

function ActivityCard() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setActive(true), 330);
    return () => clearTimeout(id);
  }, []);
  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-activity">
        <span className="widget-activity-title">Activity</span>
        <div className="widget-activity-row">
          <span className="widget-activity-label">Deploys</span>
          <span className="widget-activity-value"><AnimatedValue value={active ? 12 : 0} /></span>
        </div>
        <div className="widget-activity-row">
          <span className="widget-activity-label">Errors</span>
          <span className="widget-activity-value"><AnimatedValue value={active ? 2 : 0} /></span>
        </div>
        <div className="widget-activity-row">
          <span className="widget-activity-label">Uptime</span>
          <span className="widget-activity-value"><AnimatedValue value={active ? 99.9 : 0} suffix="%" format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} /></span>
        </div>
      </div>

    </motion.div>
  );
}

/* ── Analytics Cards ───────────────────────────────────────── */

function StatCard({
  label, value, sub, bar, prefix, suffix, format,
}: {
  label: string; value: number; sub: string; bar: number;
  prefix?: string; suffix?: string; format?: Format;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-stat">
        <span className="widget-stat-label">{label}</span>
        <span className="widget-stat-value">
          <AnimatedValue value={value} prefix={prefix} suffix={suffix} format={format} />
        </span>
        <div className="widget-stat-bar">
          <div className="widget-stat-bar-fill" style={{ width: mounted ? `${bar}%` : "0%" }} />
        </div>
        <span className="widget-stat-sub">{sub}</span>
      </div>

    </motion.div>
  );
}

/* ── Reports Cards ─────────────────────────────────────────── */

function ReportCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-report">
        <div className="widget-report-header">
          <span className="widget-report-dot" style={{ background: color }} />
          <span className="widget-report-label">{label}</span>
        </div>
        <span className="widget-report-value">
          <AnimatedValue value={value} />
        </span>
        <span className="widget-report-sub">{sub}</span>
      </div>

    </motion.div>
  );
}

/* ── Settings Cards ────────────────────────────────────────── */

function SettingToggle({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <motion.div className="dash-card" variants={CARD_VARIANTS}>
      <div className="dash-card-inner widget-setting">
        <div className="widget-setting-text">
          <span className="widget-setting-label">{label}</span>
          <span className="widget-setting-desc">{desc}</span>
        </div>
        <button
          className="widget-toggle-track"
          data-on={on}
          onClick={() => setOn((v) => !v)}
          type="button"
          aria-label={`Toggle ${label}`}
        >
          <span className="widget-toggle-thumb" />
        </button>
      </div>

    </motion.div>
  );
}

/* ── Page content per nav item ─────────────────────────────── */

function OverviewPage() {
  return (
    <>
      <ChecklistCard />
      <ProgressRingCard />
      <CurveSlidersCard />
      <ActivityCard />
    </>
  );
}

function AnalyticsPage() {
  return (
    <>
      <StatCard label="Revenue" value={24.8} prefix="$" suffix="k" format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} sub="+12.3%" bar={74} />
      <StatCard label="Active Users" value={1429} sub="+8.1%" bar={57} />
      <StatCard label="Conversion" value={4.3} suffix="%" format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} sub="+10.2%" bar={43} />
      <StatCard label="Bounce Rate" value={24} suffix="%" sub="-2.1%" bar={24} />
    </>
  );
}

function ReportsPage() {
  return (
    <>
      <ReportCard label="Published" value={12} sub="Last: 2 days ago" color="#14b8a6" />
      <ReportCard label="In Review" value={4} sub="Avg review: 1.3 days" color="#f59e0b" />
      <ReportCard label="Drafts" value={7} sub="3 updated today" color="#6366f1" />
      <ReportCard label="Archived" value={38} sub="This quarter" color="#888" />
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <SettingToggle label="Auto-save" desc="Save changes automatically" defaultOn />
      <SettingToggle label="Compact View" desc="Reduce spacing in lists" />
      <SettingToggle label="Notifications" desc="Email and push alerts" defaultOn />
      <SettingToggle label="Beta Features" desc="Try experimental features" />
    </>
  );
}

const PAGES = [OverviewPage, AnalyticsPage, ReportsPage, SettingsPage];

/* ── Main ───────────────────────────────────────────────────── */

export function DashboardDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [cardKey, setCardKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number | undefined>();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // content height + 16px top/bottom padding on .dash-main
      setBodyHeight(el.offsetHeight + 32);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const {
    containerRef,
    hoverPillRef,
    activePillRef,
    trackHover,
    hideHover,
    trackActive,
  } = useActiveTrackingPill({ mode: "snap", easing: EASE_IN_SNAPPY_CSS });

  const navRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverSuppressed = useRef(false);

  useEffect(() => {
    const el = navRefs.current[activePage];
    if (el) trackActive(el);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleSidebar() {
    setSidebarOpen((v) => !v);
  }

  function selectPage(index: number, target: HTMLElement) {
    if (index === activePage) return;
    setActivePage(index);
    hideHover(true);
    trackActive(target);
    setCardKey((k) => k + 1);
    hoverSuppressed.current = true;
    setTimeout(() => { hoverSuppressed.current = false; }, 300);
  }

  function handleHover(target: HTMLElement) {
    if (hoverSuppressed.current) return;
    trackHover(target);
  }

  const PageComponent = PAGES[activePage];

  return (
    <section id="dashboard">
      <p className="section-label">In Practice</p>
      <Prose>
        <p>
          A single transition rarely exists alone. In a real UI, multiple curves
          fire together: a sidebar slides, content reflows, cards stagger in.
          Each motion layer uses a different curve tuned to its role. Click the
          nav items to switch pages and watch the staggered blur transition.
        </p>
      </Prose>

      <div className="dash-frame">
        {/* Header */}
        <div className="dash-header">
          <button
            className="dash-toggle"
            onClick={toggleSidebar}
            type="button"
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="2" width="18" height="2" rx="1" fill="currentColor" />
              <rect y="8" width="18" height="2" rx="1" fill="currentColor" />
              <rect y="14" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
          <span className="dash-title">Dashboard</span>
        </div>

        {/* Body */}
        <div
          className="dash-body"
          style={bodyHeight !== undefined ? { height: bodyHeight } : undefined}
        >
          <div className="dash-body-inner">
            {/* Sidebar */}
            <div className="dash-sidebar" data-open={sidebarOpen}>
              <nav
                ref={containerRef as React.RefObject<HTMLDivElement>}
                className="dash-nav"
                onMouseLeave={() => hideHover()}
              >
                <div
                  ref={hoverPillRef as React.RefObject<HTMLDivElement>}
                  className="dash-nav-hover-pill"
                />
                <div
                  ref={activePillRef as React.RefObject<HTMLDivElement>}
                  className="dash-nav-active-pill"
                />
                {NAV_ITEMS.map((item, i) => (
                  <div
                    key={item}
                    ref={(el) => { navRefs.current[i] = el; }}
                    className={`dash-nav-item${activePage === i ? " active" : ""}`}
                    onMouseEnter={(e) => handleHover(e.currentTarget)}
                    onClick={(e) => selectPage(i, e.currentTarget)}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main */}
            <div className="dash-main" data-sidebar={sidebarOpen}>
              <div ref={contentRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activePage}-${cardKey}`}
                    className="dash-grid"
                    variants={GRID_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <PageComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-frame {
          margin-top: 32px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--bg);
        }

        /* Header */
        .dash-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-raised);
        }
        .dash-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 0.15s var(${EASE_IN_SNAPPY_CSS});
        }
        .dash-toggle:hover {
          border-color: var(--text-muted);
          color: var(--text);
        }
        .dash-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        /* Body layout */
        .dash-body {
          overflow: hidden;
          position: relative;
          transition: height 750ms ${EASE_IN_DEFAULT_CSS};
        }
        .dash-body-inner {
          display: flex;
          min-height: 100%;
        }

        /* Sidebar */
        .dash-sidebar {
          width: 140px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          background: var(--bg-raised);
          padding: 12px 0;
          transition: width 0.3s ${EASE_IN_DEFAULT_CSS};
          overflow: hidden;
          position: relative;
        }
        .dash-sidebar[data-open="false"] {
          width: 0;
          border-right-color: transparent;
        }
        .dash-nav {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 8px;
        }
        .dash-nav-hover-pill {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--bg-hover);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
        }
        .dash-nav-active-pill {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--border);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0.55;
          z-index: 1;
        }
        .dash-nav-item {
          position: relative;
          z-index: 2;
          font-size: 12px;
          color: var(--text-muted);
          padding: 6px 10px;
          border-radius: 4px;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.15s;
        }
        .dash-nav-item.active {
          color: var(--accent);
        }
        .dash-nav-item:hover {
          color: var(--text);
        }

        /* Main content area */
        .dash-main {
          flex: 1;
          min-width: 0;
          padding: 16px;
          position: relative;
          transition: padding-left 0.3s ${EASE_QUAD_60_CSS};
        }

        /* Card grid */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .dash-card {
          background: var(--bg-raised);
          border: none;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 0 1px var(--border);
        }
        .dash-card-inner {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ── Checklist Widget ──────────────────── */
        .widget-checklist {
          gap: 6px;
        }
        .widget-checklist-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }
        .widget-checklist-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 3px 0;
          cursor: pointer;
          color: var(--text);
        }
        .widget-check {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: transparent;
          transition: background 0.2s ${EASE_IN_SNAPPY_CSS},
                      border-color 0.2s ${EASE_IN_SNAPPY_CSS},
                      color 0.2s ${EASE_IN_SNAPPY_CSS};
        }
        .widget-check[data-done="true"] {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg);
        }
        .widget-checklist-label {
          font-size: 11px;
          color: var(--text);
          transition: opacity 0.2s ${EASE_IN_SNAPPY_CSS};
        }
        .widget-checklist-label[data-done="true"] {
          opacity: 0.4;
          text-decoration: line-through;
        }

        /* ── Progress Ring Widget ──────────────── */
        .widget-ring {
          align-items: center;
          justify-content: center;
        }
        .widget-ring-graphic {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .widget-ring-svg {
          width: 80px;
          height: 80px;
        }
        .widget-ring-bg {
          fill: none;
          stroke: var(--border);
          stroke-width: 5;
        }
        .widget-ring-fill {
          fill: none;
          stroke: var(--accent);
          stroke-width: 5;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 1s ${EASE_IN_SMOOTH_CSS};
        }
        .widget-ring-pct {
          position: absolute;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }
        .widget-ring-label {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Curve Sliders Widget ──────────────── */
        .widget-curves {
          gap: 10px;
        }
        .widget-curves-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
        }
        .widget-curves-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .widget-curves-name {
          font-size: 9px;
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
          color: var(--text-muted);
          width: 52px;
          flex-shrink: 0;
        }
        .widget-curves-track {
          --inset: 3px;
          flex: 1;
          height: 20px;
          background: var(--bg-hover);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          container-type: inline-size;
        }
        .widget-curves-ball {
          position: absolute;
          top: var(--inset);
          left: var(--inset);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          animation: widget-curves-slide 3.6s infinite;
        }
        @keyframes widget-curves-slide {
          0%   { transform: translateX(0); }
          35%  { transform: translateX(calc(100cqw - 14px - var(--inset) * 2)); }
          50%  { transform: translateX(calc(100cqw - 14px - var(--inset) * 2)); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(0); }
        }

        /* ── Activity Widget ──────────────────── */
        .widget-activity {
          gap: 6px;
        }
        .widget-activity-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }
        .widget-activity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .widget-activity-label {
          font-size: 11px;
          color: var(--text-muted);
        }
        .widget-activity-value {
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
        }

        /* ── Stat Widget (Analytics) ───────────── */
        .widget-stat {
          gap: 6px;
        }
        .widget-stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .widget-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .widget-stat-bar {
          height: 3px;
          background: var(--border);
          border-radius: 2px;
          margin-top: 4px;
        }
        .widget-stat-bar-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.8s ${EASE_IN_SMOOTH_CSS};
        }
        .widget-stat-sub {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* ── Report Widget ─────────────────────── */
        .widget-report {
          gap: 8px;
        }
        .widget-report-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .widget-report-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .widget-report-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .widget-report-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .widget-report-sub {
          font-size: 10px;
          color: var(--text-muted);
        }

        /* ── Setting Widget ────────────────────── */
        .widget-setting {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 56px;
        }
        .widget-setting-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .widget-setting-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
        }
        .widget-setting-desc {
          font-size: 10px;
          color: var(--text-muted);
        }


        @media (max-width: 600px) {
          .dash-grid {
            grid-template-columns: 1fr;
          }
          .dash-sidebar {
            width: 100px;
          }
        }
      `}</style>
    </section>
  );
}
