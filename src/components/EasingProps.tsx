import { PropsTable } from "./shared/PropsTable";

export function EasingProps() {
  return (
    <section id="api">
      <p className="section-label">API</p>

      <PropsTable
        title="Curves"
        groups={[
          {
            heading: "Named Curves",
            rows: [
              {
                name: "EASE_IN_INSTANT",
                type: "EasingCurve",
                description: "Near-instant snap, fast attack, smooth settle",
                default: "[0.09, 0.7, 0.33, 1]",
              },
              {
                name: "EASE_IN_SNAPPY",
                type: "EasingCurve",
                description: "Snappy deceleration, default interactive transitions",
                default: "[0.1, 0, 0, 1]",
              },
              {
                name: "EASE_IN_DEFAULT",
                type: "EasingCurve",
                description: "Standard deceleration",
                default: "[0.4, 0, 0, 1]",
              },
              {
                name: "EASE_IN_SMOOTH",
                type: "EasingCurve",
                description: "Gentle, long ease-in",
                default: "[0.6, 0, 0, 1]",
              },
              {
                name: "EASE_QUAD_80",
                type: "EasingCurve",
                description: "Aggressive symmetrical, snappy toggles",
                default: "[0.8, 0, 0.2, 1]",
              },
              {
                name: "EASE_QUAD_75",
                type: "EasingCurve",
                description: "Symmetrical, toggle transitions",
                default: "[0.75, 0, 0.25, 1]",
              },
              {
                name: "EASE_QUAD_60",
                type: "EasingCurve",
                description: "Slightly asymmetric, toggle/state transitions",
                default: "[0.6, 0, 0.3, 1]",
              },
              {
                name: "EASE_QUAD_50",
                type: "EasingCurve",
                description: "Balanced symmetrical, entrance effects",
                default: "[0.5, 0, 0.5, 1]",
              },
            ],
          },
          {
            heading: "Lookup Maps",
            rows: [
              {
                name: "CURVES",
                type: "Record<CurveName, EasingCurve>",
                description: "All curves as JS tuples, keyed by name",
              },
              {
                name: "CURVES_CSS",
                type: "Record<CurveName, string>",
                description: "All curves as cubic-bezier() strings, keyed by name",
              },
            ],
          },
          {
            heading: "Types",
            rows: [
              {
                name: "EasingCurve",
                type: "readonly [number, number, number, number]",
                description: "Cubic-bezier control-point tuple [x1, y1, x2, y2]",
              },
              {
                name: "CurveName",
                type: "string union",
                description:
                  '"EASE_IN_INSTANT" | "EASE_IN_SNAPPY" | "EASE_IN_DEFAULT" | "EASE_IN_SMOOTH" | "EASE_QUAD_80" | …',
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="Durations"
        groups={[
          {
            heading: "Arrays",
            rows: [
              {
                name: "DUR",
                type: "readonly number[]",
                description:
                  "Duration tiers in ms: [0, 100, 200, 350, 500, 750, 1000, 1500, 2000]",
              },
              {
                name: "DUR_S",
                type: "readonly number[]",
                description:
                  "Same tiers in seconds: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1, 1.5, 2]",
              },
            ],
          },
          {
            heading: "Individual Constants (ms)",
            rows: [
              { name: "DUR_0", type: "number", default: "0" },
              { name: "DUR_1", type: "number", default: "100" },
              { name: "DUR_2", type: "number", default: "200" },
              { name: "DUR_3", type: "number", default: "350" },
              { name: "DUR_4", type: "number", default: "500" },
              { name: "DUR_5", type: "number", default: "750" },
              { name: "DUR_6", type: "number", default: "1000" },
              { name: "DUR_7", type: "number", default: "1500" },
              { name: "DUR_8", type: "number", default: "2000" },
            ],
          },
        ]}
      />

      <PropsTable
        title="scaleEase / scaleEaseCSS"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "curve",
                type: "EasingCurve",
                description: "The curve to scale",
              },
              {
                name: "intensity",
                type: "number",
                description: "0 = linear, 1 = original, >1 = exaggerated",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "scaleEase",
                type: "[number, number, number, number]",
                description: "Scaled cubic-bezier tuple",
              },
              {
                name: "scaleEaseCSS",
                type: "string",
                description: 'CSS cubic-bezier() string, e.g. "cubic-bezier(0.1, 0, 0, 1)"',
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="transition()"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "props",
                type: "string | string[]",
                description: "CSS property name(s) to transition",
              },
              {
                name: "durationMs",
                type: "number",
                description: "Duration in milliseconds",
              },
              {
                name: "easing",
                type: "string",
                description: "CSS easing value (use *_CSS curve constants)",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "transition",
                type: "string",
                description:
                  'CSS transition value, e.g. "transform 200ms cubic-bezier(…)"',
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="createSmoothEaseInEnter()"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "distance",
                type: "number",
                default: "8",
                description: "Y-axis translate distance in px",
              },
              {
                name: "duration",
                type: "number",
                default: "0.35",
                description: "Animation duration in seconds",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "preset",
                type: "MotionProps",
                description:
                  "Framer Motion spread props (initial, animate, exit, transition)",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="createStagger()"
        groups={[
          {
            heading: "Options",
            rows: [
              {
                name: "staggerDelay",
                type: "number",
                default: "0.06",
                description: "Delay between each child in seconds",
              },
              {
                name: "startDelay",
                type: "number",
                default: "0.02",
                description: "Initial delay before first child",
              },
              {
                name: "distance",
                type: "number",
                default: "12",
                description: "Y-axis translate distance in px",
              },
              {
                name: "duration",
                type: "number",
                default: "0.35",
                description: "Each item's animation duration in seconds",
              },
              {
                name: "ease",
                type: "EasingCurve",
                default: "EASE_IN_DEFAULT",
                description: "Easing curve for each item",
              },
              {
                name: "overshoot",
                type: "number",
                default: "4",
                description: "Overshoot distance in px for springy settle effect",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "container",
                type: "MotionProps",
                description: "Spread on the parent (variants for staggerChildren)",
              },
              {
                name: "item",
                type: "MotionProps",
                description: "Spread on each child (variants for fade + slide)",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="prefersReducedMotion()"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "(none)",
                type: "-",
                description: "No parameters",
                default: "-",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "result",
                type: "boolean",
                description:
                  "true when user prefers reduced motion. SSR-safe (returns false on server).",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="Animation Presets"
        groups={[
          {
            heading: "Presets (Framer Motion spread props)",
            rows: [
              {
                name: "FADE_IN_OUT",
                type: "MotionProps",
                description: "Simple opacity fade (0.2s, easeInOut)",
              },
              {
                name: "FADE_IN_OUT_SMOOTH",
                type: "MotionProps",
                description: "Fade + scale + slide (0.8s, EASE_IN_SMOOTH)",
              },
              {
                name: "SMOOTH_EASE_IN_ENTER",
                type: "MotionProps",
                description: "Subtle enter with y + scale (0.35s, EASE_IN_DEFAULT)",
              },
              {
                name: "CARD_TRANSITION",
                type: "MotionProps",
                description: "Fast card enter/exit (0.15s, EASE_IN_SNAPPY)",
              },
              {
                name: "BOTTOM_SHEET_BACKDROP",
                type: "MotionProps",
                description: "Sheet overlay fade (0.2s)",
              },
              {
                name: "BOTTOM_SHEET_SLIDE",
                type: "MotionProps",
                description: "Sheet slide from bottom (0.35s, EASE_IN_SNAPPY)",
              },
              {
                name: "BOTTOM_SHEET_SLIDE_DAMPED",
                type: "MotionProps",
                description: "Damped sheet slide (0.3s, EASE_IN_SNAPPY)",
              },
              {
                name: "STAGGER_CONTAINER",
                type: "Variants",
                description: "Parent variants for staggerChildren (0.06s gap)",
              },
              {
                name: "STAGGER_ITEM",
                type: "Variants",
                description: "Child variants for fade + slide-up (0.35s, EASE_IN_DEFAULT)",
              },
              {
                name: "SHAKE",
                type: "AnimateProps",
                description: "Horizontal shake (0.5s, easeInOut)",
              },
            ],
          },
        ]}
      />
    </section>
  );
}
