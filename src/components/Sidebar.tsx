import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export interface Section {
  id: string;
  label: string;
}

const PAGES = [
  { to: "/", label: "Dease" },
  { to: "/directional-persistence", label: "Directional Persistence" },
];

export function Sidebar({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const location = useLocation();

  useEffect(() => {
    setActive(sections[0]?.id ?? "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-pages">
        {PAGES.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-page-link${location.pathname === to ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="sidebar-divider" />
      {sections.map(({ id, label }) => (
        <button
          key={id}
          className={`sidebar-link${active === id ? " active" : ""}`}
          onClick={() => scrollTo(id)}
          type="button"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
