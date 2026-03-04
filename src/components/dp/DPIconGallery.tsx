import { type ComponentType } from "react";
import { useGridHighlight } from "directional-persistence";
import {
  Zap, Layers, Globe, Shield, Cpu, Cloud, Database,
  Lock, Eye, Wifi, Monitor, Smartphone, Tablet, Watch,
  Camera, Mic, Headphones, Speaker, Music, Radio,
  Film, Tv, Gamepad2, Compass,
  Rocket, Flame, Sparkles, Star, Heart, Diamond,
  Crown, Award, Target, Crosshair, Aperture, Atom,
  Box, Package, Archive, Folder, File, FileText,
  Mail,
  Map as MapIcon, Navigation as NavigationIcon,
  type LucideProps,
} from "lucide-react";
import { Prose } from "../Prose";

interface IconEntry {
  name: string;
  Icon: ComponentType<LucideProps>;
}

const ICONS: IconEntry[] = [
  { name: "Zap", Icon: Zap },
  { name: "Layers", Icon: Layers },
  { name: "Globe", Icon: Globe },
  { name: "Shield", Icon: Shield },
  { name: "Cpu", Icon: Cpu },
  { name: "Cloud", Icon: Cloud },
  { name: "Database", Icon: Database },
  { name: "Lock", Icon: Lock },
  { name: "Eye", Icon: Eye },
  { name: "Wifi", Icon: Wifi },
  { name: "Monitor", Icon: Monitor },
  { name: "Smartphone", Icon: Smartphone },
  { name: "Tablet", Icon: Tablet },
  { name: "Watch", Icon: Watch },
  { name: "Camera", Icon: Camera },
  { name: "Mic", Icon: Mic },
  { name: "Headphones", Icon: Headphones },
  { name: "Speaker", Icon: Speaker },
  { name: "Music", Icon: Music },
  { name: "Radio", Icon: Radio },
  { name: "Film", Icon: Film },
  { name: "Tv", Icon: Tv },
  { name: "Gamepad2", Icon: Gamepad2 },
  { name: "Compass", Icon: Compass },
  { name: "Map", Icon: MapIcon },
  { name: "Navigation", Icon: NavigationIcon },
  { name: "Rocket", Icon: Rocket },
  { name: "Flame", Icon: Flame },
  { name: "Sparkles", Icon: Sparkles },
  { name: "Star", Icon: Star },
  { name: "Heart", Icon: Heart },
  { name: "Diamond", Icon: Diamond },
  { name: "Crown", Icon: Crown },
  { name: "Award", Icon: Award },
  { name: "Target", Icon: Target },
  { name: "Crosshair", Icon: Crosshair },
  { name: "Aperture", Icon: Aperture },
  { name: "Atom", Icon: Atom },
  { name: "Box", Icon: Box },
  { name: "Package", Icon: Package },
  { name: "Archive", Icon: Archive },
  { name: "Folder", Icon: Folder },
  { name: "File", Icon: File },
  { name: "FileText", Icon: FileText },
  { name: "Mail", Icon: Mail },
];

export function DPIconGallery() {
  const { containerRef, highlightRef, getItemRef, activeIndex } = useGridHighlight({
    count: ICONS.length,
    hitRadius: 24,
    inset: 4,
  });

  const activeIcon = ICONS[activeIndex];
  const ActiveIconComponent = activeIcon.Icon;

  return (
    <section id="dp-icon-gallery">
      <p className="section-label">Icon Gallery</p>
      <Prose>
        <p>
          The same snap animation from the original{" "}
          <strong>Everything Creative</strong> case study, rebuilt with Lucide
          icons. The highlight teleports with a directional offset then slides
          into its final position&mdash;circular hitboxes eliminate dead zones
          between icons.
        </p>
      </Prose>

      <div className="dp-ig">
        <div
          className="dp-ig__grid"
          ref={containerRef as React.RefObject<HTMLDivElement>}
        >
          <div ref={highlightRef as React.RefObject<HTMLDivElement>} className="dp-ig__highlight" />
          {ICONS.map((entry, i) => (
            <div
              key={entry.name}
              ref={getItemRef(i)}
              className="dp-ig__item"
              data-active={i === activeIndex}
            >
              <entry.Icon
                size={22}
                strokeWidth={1.5}
                className="dp-ig__icon"
              />
            </div>
          ))}
        </div>
        <div className="dp-ig__preview">
          <ActiveIconComponent
            key={activeIcon.name}
            size={48}
            strokeWidth={1}
            className="dp-ig__preview-icon"
          />
          <span className="dp-ig__preview-label">{activeIcon.name}</span>
        </div>
      </div>

      <style>{`
        .dp-ig {
          display: grid;
          grid-template-columns: 1fr 160px;
          gap: 16px;
          margin-top: 40px;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          align-items: start;
        }
        .dp-ig__grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
        }
        .dp-ig__highlight {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 10px;
          box-shadow: inset 0 0 0 1px var(--accent);
          pointer-events: none;
          transition: transform var(--dur-2) var(--ease-in-instant),
                      box-shadow var(--dur-2) var(--ease-in-instant);
          z-index: 10;
        }
        .dp-ig__item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          aspect-ratio: 1;
          cursor: pointer;
        }
        .dp-ig__icon {
          color: var(--text-muted);
          transition: color var(--dur-1) var(--ease-in-snappy), transform var(--dur-2) var(--ease-in-instant);
        }
        .dp-ig__item[data-active='true'] .dp-ig__icon {
          color: var(--text);
          transform: scale(1.1);
        }
        .dp-ig__preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          height: 100%;
          min-height: 200px;
        }
        .dp-ig__preview-icon {
          color: var(--accent);
          animation: dp-ig-enter var(--dur-3) var(--ease-in-instant) both;
        }
        .dp-ig__preview-label {
          font-size: 13px;
          color: var(--text-muted);
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
          animation: dp-ig-enter var(--dur-3) var(--ease-in-instant) both;
        }
        @keyframes dp-ig-enter {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 768px) {
          .dp-ig {
            grid-template-columns: 1fr;
          }
          .dp-ig__grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .dp-ig__preview {
            order: -1;
            min-height: 100px;
          }
        }
      `}</style>
    </section>
  );
}
