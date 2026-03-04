import { Block, InstallButton } from "../shared/CodeBlockParts";

const INSTALL_CMD = "npm i directional-persistence";

const PILL_SNIPPET = `import { useTrackingPill } from "directional-persistence";

function TabNav() {
  const { containerRef, pillRef, track, hide } = useTrackingPill({
    mode: "glide",     // or "snap"
    duration: 150,
    easing: "ease-out",
  });

  return (
    <nav ref={containerRef} onMouseLeave={hide}>
      <div ref={pillRef} className="pill" />
      {tabs.map(tab => (
        <button
          key={tab}
          onMouseEnter={e => track(e.currentTarget)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}`;

const ACTIVE_PILL_SNIPPET = `import { useTrackingPill } from "directional-persistence";

function TabNav() {
  const {
    containerRef,
    hoverPillRef,
    activePillRef,
    trackHover,
    hideHover,
    trackActive,
  } = useTrackingPill({ mode: "glide" });

  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);

  useEffect(() => {
    if (tabRefs.current[selected]) trackActive(tabRefs.current[selected]);
  }, []);

  return (
    <nav ref={containerRef} onMouseLeave={() => hideHover()}>
      <div ref={hoverPillRef} className="hover-pill" />
      <div ref={activePillRef} className="active-pill" />
      {tabs.map((tab, i) => (
        <button
          key={tab}
          ref={el => { tabRefs.current[i] = el; }}
          onMouseEnter={e => trackHover(e.currentTarget)}
          onClick={e => {
            setSelected(i);
            hideHover(true);
            trackActive(e.currentTarget);
          }}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}`;

const GROUP_SNIPPET = `import {
  DirectionalGroup,
  useGroupItem,
  useGroupContent,
} from "directional-persistence";

function NavItem({ index, label }) {
  const { triggerProps, isActive } = useGroupItem(index);
  return <button {...triggerProps}>{label}</button>;
}

function NavContent({ index }) {
  const { direction, contentProps } = useGroupContent(index);
  // direction: "forward" | "backward" | null
  return <div {...contentProps}>Content for {index}</div>;
}

function Nav() {
  return (
    <DirectionalGroup openDelay={75} closeDelay={150}>
      {items.map((item, i) => (
        <div key={item}>
          <NavItem index={i} label={item} />
          <NavContent index={i} />
        </div>
      ))}
    </DirectionalGroup>
  );
}`;

const GRID_SNIPPET = `import { useGridHighlight } from "directional-persistence";

function IconGrid({ icons }) {
  const {
    containerRef,
    highlightRef,
    getItemRef,
    activeIndex,
    select,
  } = useGridHighlight({
    count: icons.length,
    hitRadius: 40,
    duration: 200,
  });

  return (
    <div ref={containerRef} className="grid">
      <div ref={highlightRef} className="highlight" />
      {icons.map((icon, i) => (
        <div
          key={icon.name}
          ref={getItemRef(i)}
          className={i === activeIndex ? "active" : ""}
          onClick={() => select(i)}
        >
          {icon.element}
        </div>
      ))}
    </div>
  );
}`;

const CSS_SNIPPET = `@import "directional-persistence/styles";

/* The default animations use data attributes: */
/* [data-direction='forward']  → slide in from right */
/* [data-direction='backward'] → slide in from left  */
/* [data-direction='none']     → fade in (first open) */

/* Customize with your own animations: */
[data-direction='forward'] {
  animation: my-slide-right var(--dur-2) var(--ease-in-snappy) both;
}
[data-direction='backward'] {
  animation: my-slide-left var(--dur-2) var(--ease-in-snappy) both;
}`;

export function DPCodeBlock() {
  return (
    <section id="dp-get-started">
      <p className="section-label">Get Started</p>

      <InstallButton command={INSTALL_CMD} />

      <div className="code-grid">
        <Block title="Tracking Pill" code={PILL_SNIPPET} language="tsx" />
        <Block title="Active Tracking Pill" code={ACTIVE_PILL_SNIPPET} language="tsx" />
        <Block title="Directional Group" code={GROUP_SNIPPET} language="tsx" />
        <Block title="Grid Highlight" code={GRID_SNIPPET} language="tsx" />
        <Block title="CSS Animations" code={CSS_SNIPPET} language="css" />
      </div>
    </section>
  );
}
