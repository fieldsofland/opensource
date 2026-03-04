import { useEffect } from "react";
import { Sidebar, type Section } from "../components/Sidebar";
import { Hero } from "../components/Hero";
import { Defaults } from "../components/Defaults";
import { HardStops } from "../components/HardStops";
import { Comparison } from "../components/Comparison";
import { DashboardDemo } from "../components/DashboardDemo";
import { DynamicEasing } from "../components/DynamicEasing";
import { CurveDemo } from "../components/CurveDemo";
import { DurationDemo } from "../components/DurationDemo";
import { PresetDemo } from "../components/PresetDemo";
import { CodeBlock } from "../components/CodeBlock";
import { EasingProps } from "../components/EasingProps";

const SECTIONS: Section[] = [
  { id: "hero", label: "Intro" },
  { id: "defaults", label: "The Default Problem" },
  { id: "comparison", label: "Weight & Feel" },
  { id: "hard-stops", label: "Hard Stops" },
  { id: "dynamic-easing", label: "Dynamic" },
  { id: "dashboard", label: "In Practice" },
  { id: "curves", label: "The Curves" },
  { id: "durations", label: "Timing" },
  { id: "presets", label: "Presets" },
  { id: "api", label: "API" },
  { id: "get-started", label: "Get Started" },
];

export function EasingPage() {
  useEffect(() => {
    document.title = "Dease";
  }, []);

  return (
    <>
      <Sidebar sections={SECTIONS} />
      <div className="content">
        <Hero />
        <Defaults />
        <Comparison />
        <HardStops />
        <DynamicEasing />
        <DashboardDemo />
        <CurveDemo />
        <DurationDemo />
        <PresetDemo />
        <EasingProps />
        <CodeBlock />
        <footer className="footer">
          <p>dease</p>
        </footer>
      </div>
    </>
  );
}
