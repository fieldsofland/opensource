import { Block, InstallButton } from "./shared/CodeBlockParts";

const INSTALL_CMD = "npm i @matthewklahn/dease";

const JS_SNIPPET = `import {
  EASE_IN_SNAPPY, DUR_S, CARD_TRANSITION,
  STAGGER_CONTAINER, STAGGER_ITEM, scaleEase,
} from "dease";

// Spread preset directly
<motion.div {...CARD_TRANSITION} />

// Custom curve + duration
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: DUR_S[3], ease: EASE_IN_SNAPPY }}
/>

// Scale intensity (0 = linear, 1 = original)
transition={{ ease: scaleEase(EASE_IN_SNAPPY, 0.6) }}

// Stagger children
<motion.ul variants={STAGGER_CONTAINER} initial="hidden" animate="visible">
  {items.map(i => <motion.li key={i.id} variants={STAGGER_ITEM} />)}
</motion.ul>`;

const UTILS_SNIPPET = `import {
  CURVES, CURVES_CSS, transition,
  createStagger, prefersReducedMotion,
  EASE_IN_SNAPPY_CSS,
} from "dease";

// Build CSS transition strings
transition("transform", 200, EASE_IN_SNAPPY_CSS)
// → "transform 200ms cubic-bezier(0.1, 0, 0, 1)"

// Multi-property
transition(["transform", "opacity"], 300, EASE_IN_SNAPPY_CSS)

// Look up curves by name
CURVES.EASE_IN_SNAPPY       // [0.1, 0, 0, 1]
CURVES_CSS.EASE_IN_SNAPPY   // "cubic-bezier(…)"

// Custom stagger timing
const { container, item } = createStagger({
  staggerDelay: 0.08, distance: 16, duration: 0.3,
});

// Respect user motion preferences
if (!prefersReducedMotion()) { animate(); }`;

const CSS_SNIPPET = `@import "dease/css";

.card {
  transition:
    transform var(--dur-2) var(--ease-in-snappy),
    opacity var(--dur-1) var(--ease-in-smooth);
}

.toggle {
  transition: all var(--toggle-duration) var(--toggle-ease);
}`;

export function CodeBlock() {
  return (
    <section id="get-started">
      <p className="section-label">Get Started</p>

      <InstallButton command={INSTALL_CMD} />

      <div className="code-grid">
        <Block title="JavaScript / TypeScript" code={JS_SNIPPET} language="tsx" />
        <Block title="Utilities" code={UTILS_SNIPPET} language="tsx" />
        <Block title="CSS" code={CSS_SNIPPET} language="css" />
      </div>
    </section>
  );
}
