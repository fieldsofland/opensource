import {
  DirectionalGroup,
  useGroupItem,
  useGroupContent,
} from "directional-persistence";
import { Sparkles, Zap, Workflow, KeyRound, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Prose } from "../Prose";

const NAV_ITEMS = [
  {
    label: "Products",
    description: "Explore our full product lineup with features, pricing, and comparisons.",
    links: ["Overview", "Pricing", "Compare"],
  },
  {
    label: "Solutions",
    description: "Industry-specific solutions tailored to your workflow and scale.",
    links: ["Enterprise", "Startups", "Agencies"],
  },
  {
    label: "Resources",
    description: "Docs, guides, and community resources to get you building faster.",
    links: ["Documentation", "Blog", "Community"],
  },
  {
    label: "Company",
    description: "Learn about our mission, meet the team, and see open roles.",
    links: ["About", "Careers", "Contact"],
  },
];

const LIST_ITEMS: {
  label: string;
  detail: string;
  Icon: ComponentType<LucideProps>;
}[] = [
  {
    label: "Analytics",
    detail: "Real-time dashboards, custom reports, and data export. Track every metric that matters to your business.",
    Icon: Sparkles,
  },
  {
    label: "Integrations",
    detail: "Connect with 200+ tools including Slack, GitHub, Linear, and Figma. Bi-directional sync keeps everything up to date.",
    Icon: Zap,
  },
  {
    label: "Automations",
    detail: "Build workflows that trigger on events, schedule recurring tasks, and eliminate manual busywork.",
    Icon: Workflow,
  },
  {
    label: "API Access",
    detail: "Full REST and GraphQL APIs with SDKs for TypeScript, Python, Go, and Ruby. Rate limits scale with your plan.",
    Icon: KeyRound,
  },
  {
    label: "Team Management",
    detail: "Role-based permissions, SSO, audit logs, and usage analytics. Enterprise-ready from day one.",
    Icon: Users,
  },
];

function ListSlot({
  index,
  item,
}: {
  index: number;
  item: (typeof LIST_ITEMS)[number];
}) {
  const { triggerProps, isActive } = useGroupItem(index);
  const { direction, axis, contentProps } = useGroupContent(index);

  return (
    <div className="dp-list-slot">
      <button
        className={`dp-list-trigger${isActive ? " active" : ""}`}
        {...triggerProps}
        type="button"
      >
        <item.Icon size={16} className="dp-list-icon" />
        {item.label}
      </button>
      {isActive && (
        <div className="dp-list-card" {...contentProps}>
          <div className="dp-group-badge">
            {direction ? `${direction} · ${axis}` : "initial"}
          </div>
          <p className="dp-group-panel-title">{item.label}</p>
          <p className="dp-group-panel-desc">{item.detail}</p>
        </div>
      )}
    </div>
  );
}

function NavSlot({
  index,
  item,
}: {
  index: number;
  item: (typeof NAV_ITEMS)[number];
}) {
  const { triggerProps, isActive } = useGroupItem(index);
  const { direction, isTransition, axis, contentProps } = useGroupContent(index);

  return (
    <div className="dp-group-slot">
      <button
        className={`dp-group-trigger${isActive ? " active" : ""}`}
        {...triggerProps}
        type="button"
      >
        {item.label}
      </button>
      {isActive && (
        <div className="dp-group-panel" {...contentProps}>
          <div className="dp-group-badge">
            {direction ? `${direction} · ${axis}` : "initial"}
            {isTransition ? " (transition)" : ""}
          </div>
          <p className="dp-group-panel-title">{item.label}</p>
          <p className="dp-group-panel-desc">{item.description}</p>
          <div className="dp-group-links">
            {item.links.map((link) => (
              <span key={link} className="dp-group-link">
                {link}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DPDirectionalGroupDemo() {
  return (
    <section id="dp-directional-group">
      <p className="section-label">DirectionalGroup</p>
      <Prose>
        <p>
          A context provider that tracks which item the user approached
          from. Content slides in from the <strong>direction of movement</strong>,
          and a grace period keeps things open while the cursor bridges
          the gap between trigger and content.
        </p>
      </Prose>

      <div className="dp-group-demos">
        <div className="dp-group-demo">
          <p className="dp-problem-label">Horizontal nav</p>
          <DirectionalGroup openDelay={75} closeDelay={150} velocitySlide>
            <div className="dp-group-bar">
              {NAV_ITEMS.map((item, i) => (
                <NavSlot key={item.label} index={i} item={item} />
              ))}
            </div>
          </DirectionalGroup>
        </div>

        <div className="dp-group-demo dp-group-demo--list">
          <p className="dp-problem-label">Vertical list</p>
          <DirectionalGroup openDelay={75} closeDelay={150} velocitySlide>
            <div className="dp-list">
              {LIST_ITEMS.map((item, i) => (
                <ListSlot key={item.label} index={i} item={item} />
              ))}
            </div>
          </DirectionalGroup>
        </div>
      </div>

      <style>{`
        .dp-group-demos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .dp-group-demo {
          position: relative;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          min-height: 300px;
        }
        .dp-group-bar {
          display: flex;
          gap: 4px;
          justify-content: center;
        }
        .dp-group-trigger {
          padding: 10px 20px;
          font-size: 14px;
          color: var(--text-muted);
          background: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: color var(--dur-1) var(--ease-in-snappy), background var(--dur-1) var(--ease-in-snappy);
        }
        .dp-group-trigger:hover,
        .dp-group-trigger.active {
          color: var(--text);
          background: var(--bg-hover);
        }
        .dp-group-panel {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          padding: 20px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          z-index: 10;
        }
        .dp-group-badge {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 12px;
          padding: 2px 8px;
          background: var(--bg-raised);
          border-radius: 4px;
          display: inline-block;
        }
        .dp-group-panel-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        .dp-group-panel-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .dp-group-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dp-group-link {
          font-size: 12px;
          padding: 4px 10px;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--dur-1) var(--ease-in-snappy), border-color var(--dur-1) var(--ease-in-snappy);
        }
        .dp-group-link:hover {
          color: var(--text);
          border-color: var(--text-muted);
        }
        .dp-group-demo--list {
          overflow: visible;
        }
        .dp-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin: 0 auto;
          width: fit-content;
        }
        .dp-list-slot {
          position: relative;
        }
        .dp-list-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--text-muted);
          background: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: color var(--dur-1) var(--ease-in-snappy), background var(--dur-1) var(--ease-in-snappy);
        }
        .dp-list-trigger:hover,
        .dp-list-trigger.active {
          color: var(--text);
          background: var(--bg-hover);
        }
        .dp-list-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: var(--text-muted);
        }
        .dp-list-card {
          position: absolute;
          top: 0;
          right: calc(100% + 12px);
          width: 260px;
          padding: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          z-index: 10;
        }
      `}</style>
    </section>
  );
}
