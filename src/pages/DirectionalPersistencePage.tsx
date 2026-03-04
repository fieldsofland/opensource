import { useEffect } from "react";
import { Sidebar, type Section } from "../components/Sidebar";
import { DPHero } from "../components/dp/DPHero";
import { DPProblem } from "../components/dp/DPProblem";
import { DPTrackingPillDemo } from "../components/dp/DPTrackingPillDemo";
import { DPActiveTrackingPillDemo } from "../components/dp/DPActiveTrackingPillDemo";
import { DPDirectionalGroupDemo } from "../components/dp/DPDirectionalGroupDemo";
import { DPIconGallery } from "../components/dp/DPIconGallery";
import { DPCodeBlock } from "../components/dp/DPCodeBlock";
import { DPProps } from "../components/dp/DPProps";

const SECTIONS: Section[] = [
  { id: "dp-hero", label: "Intro" },
  { id: "dp-problem", label: "The Problem" },
  { id: "dp-tracking-pill", label: "Tracking Pill" },
  { id: "dp-active-pill", label: "Active Pill" },
  { id: "dp-directional-group", label: "Directional Group" },
  { id: "dp-icon-gallery", label: "Icon Gallery" },
  { id: "dp-api", label: "API" },
  { id: "dp-get-started", label: "Get Started" },
];

export function DirectionalPersistencePage() {
  useEffect(() => {
    document.title = "directional-persistence";
  }, []);

  return (
    <>
      <Sidebar sections={SECTIONS} />
      <div className="content">
        <DPHero />
        <DPProblem />
        <DPTrackingPillDemo />
        <DPActiveTrackingPillDemo />
        <DPDirectionalGroupDemo />
        <DPIconGallery />
        <DPProps />
        <DPCodeBlock />
        <footer className="footer">
          <p>directional-persistence</p>
        </footer>
      </div>
    </>
  );
}
