import { PropsTable } from "../shared/PropsTable";

export function DPProps() {
  return (
    <section id="dp-api">
      <p className="section-label">API</p>

      <PropsTable
        title="useTrackingPill(options)"
        groups={[
          {
            heading: "Options",
            rows: [
              {
                name: "mode",
                type: "'glide' | 'snap'",
                default: "'glide'",
                description:
                  "Glide animates via CSS transition; snap teleports with directional offset",
              },
              {
                name: "duration",
                type: "number",
                default: "150",
                description: "Transition duration in ms",
              },
              {
                name: "easing",
                type: "string",
                default: "'cubic-bezier(0.09, 0.7, 0.33, 1)'",
                description: "CSS easing string",
              },
              {
                name: "snapOffset",
                type: "number",
                default: "8",
                description: "Directional overshoot in px (snap mode only)",
              },
              {
                name: "inset",
                type: "number",
                default: "0",
                description: "Shrink the pill by this many px on each side",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "containerRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the container element",
              },
              {
                name: "pillRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the pill/highlight element",
              },
              {
                name: "track",
                type: "(target: HTMLElement) => void",
                description: "Call to move the pill to a target element",
              },
              {
                name: "hide",
                type: "() => void",
                description: "Call to hide the pill (e.g. on mouse leave)",
              },
              {
                name: "isVisible",
                type: "boolean",
                description: "Whether the pill is currently visible",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="useTrackingPill(options)"
        groups={[
          {
            heading: "Options",
            rows: [
              {
                name: "mode",
                type: "'glide' | 'snap'",
                default: "'glide'",
                description:
                  "Glide animates via CSS transition; snap teleports with directional offset",
              },
              {
                name: "duration",
                type: "number",
                default: "150",
                description: "Transition duration in ms",
              },
              {
                name: "easing",
                type: "string",
                default: "'cubic-bezier(0.09, 0.7, 0.33, 1)'",
                description: "CSS easing string",
              },
              {
                name: "snapOffset",
                type: "number",
                default: "8",
                description: "Directional overshoot in px (snap mode only)",
              },
              {
                name: "inset",
                type: "number",
                default: "0",
                description: "Shrink the pills by this many px on each side",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "containerRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the container element (shared by both pills)",
              },
              {
                name: "hoverPillRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the hover pill element (behind the active pill)",
              },
              {
                name: "activePillRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the active pill element (on top)",
              },
              {
                name: "trackHover",
                type: "(target: HTMLElement) => void",
                description:
                  "Move hover pill to target; auto-hides when hovering the active item",
              },
              {
                name: "hideHover",
                type: "(instant?: boolean) => void",
                description:
                  "Hide hover pill. instant=true hides immediately (click); false fades (leave)",
              },
              {
                name: "trackActive",
                type: "(target: HTMLElement) => void",
                description:
                  "Move active pill to target with directional animation",
              },
              {
                name: "isHoverVisible",
                type: "boolean",
                description: "Whether the hover pill is currently visible",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="useGridHighlight(options)"
        groups={[
          {
            heading: "Options",
            rows: [
              {
                name: "count",
                type: "number",
                description: "Total number of grid items",
              },
              {
                name: "hitRadius",
                type: "number",
                default: "32",
                description: "Proximity radius in px for hover detection",
              },
              {
                name: "inset",
                type: "number",
                default: "4",
                description: "Shrink the highlight by this many px per side",
              },
              {
                name: "snapOffset",
                type: "number",
                default: "10",
                description: "Directional overshoot distance in px",
              },
              {
                name: "duration",
                type: "number",
                default: "250",
                description: "Transition duration in ms",
              },
              {
                name: "easing",
                type: "string",
                default: "'cubic-bezier(0.09, 0.7, 0.33, 1)'",
                description: "CSS easing string",
              },
              {
                name: "initialIndex",
                type: "number",
                default: "0",
                description: "Index of the initially selected item",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "containerRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the grid container",
              },
              {
                name: "highlightRef",
                type: "RefObject<HTMLElement>",
                description: "Attach to the highlight element",
              },
              {
                name: "getItemRef",
                type: "(index: number) => RefCallback",
                description: "Pass to each grid item's ref prop",
              },
              {
                name: "activeIndex",
                type: "number",
                description: "Currently highlighted item index",
              },
              {
                name: "select",
                type: "(index: number) => void",
                description: "Programmatically select an item",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="<DirectionalGroup />"
        groups={[
          {
            heading: "Props",
            rows: [
              {
                name: "children",
                type: "ReactNode",
                description: "Group items and their content panels",
              },
              {
                name: "openDelay",
                type: "number",
                default: "100",
                description: "Delay in ms before opening a new item",
              },
              {
                name: "closeDelay",
                type: "number",
                default: "100",
                description: "Delay in ms before closing on mouse leave",
              },
              {
                name: "velocitySlide",
                type: "boolean",
                default: "false",
                description:
                  "Scale slide offset (8–16px) based on transition speed",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="useGroupItem(index)"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "index",
                type: "number",
                description: "Position of this item in the group (0-based)",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "triggerProps",
                type: "object",
                description:
                  "Spread on the trigger element — includes onMouseEnter, onMouseLeave, onFocus, onBlur, data-active, ref",
              },
              {
                name: "isActive",
                type: "boolean",
                description: "Whether this item is the currently active one",
              },
            ],
          },
        ]}
      />

      <PropsTable
        title="useGroupContent(index)"
        groups={[
          {
            heading: "Parameters",
            rows: [
              {
                name: "index",
                type: "number",
                description: "Position of this content panel in the group",
              },
            ],
          },
          {
            heading: "Returns",
            rows: [
              {
                name: "direction",
                type: "'forward' | 'backward' | null",
                description:
                  "Navigation direction relative to previous active item",
              },
              {
                name: "isTransition",
                type: "boolean",
                description: "true during a direction change",
              },
              {
                name: "axis",
                type: "'horizontal' | 'vertical' | 'diagonal' | null",
                description: "Spatial axis between previous and current items",
              },
              {
                name: "contentProps",
                type: "object",
                description:
                  "Spread on the content element — includes data-direction, data-transition, data-axis, onMouseEnter, onMouseLeave",
              },
            ],
          },
        ]}
      />
    </section>
  );
}
