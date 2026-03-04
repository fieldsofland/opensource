import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { EasingPage } from "./pages/EasingPage";
import { DirectionalPersistencePage } from "./pages/DirectionalPersistencePage";

const devToolsModule = import.meta.glob("./dev-tools.tsx");
const devToolsLoader = Object.values(devToolsModule)[0];
const DevTools = devToolsLoader
  ? lazy(devToolsLoader as () => Promise<{ default: React.ComponentType }>)
  : () => null;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [pathname]);
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

export function App() {
  const { theme, toggle } = useTheme();
  useLenis();

  return (
    <div className="app">
      <ScrollToTop />
      <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? "\u2600" : "\u263E"}
      </button>
      <Routes>
        <Route path="/" element={<EasingPage />} />
        <Route path="/directional-persistence" element={<DirectionalPersistencePage />} />
      </Routes>
      <Suspense fallback={null}>
        <DevTools />
      </Suspense>
    </div>
  );
}
