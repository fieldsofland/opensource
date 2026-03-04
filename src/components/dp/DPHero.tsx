import { motion } from "framer-motion";
import { EASE_IN_SMOOTH, DUR_S } from "dease";

export function DPHero() {
  return (
    <section className="hero dp-hero" id="dp-hero">
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR_S[4], ease: EASE_IN_SMOOTH }}
      >
        Direction is context.
      </motion.h1>

      <motion.p
        className="hero-tagline"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DUR_S[4],
          ease: EASE_IN_SMOOTH,
          delay: 0.1,
        }}
      >
        Hover states flicker. Popovers fight the cursor. Navigation pills
        teleport instead of glide. Directional persistence fixes all of
        it&mdash;zero dependencies, zero re-renders.
      </motion.p>

      <style>{`
        .dp-hero {
          padding: 120px 0 80px;
          border-bottom: none;
        }
        .dp-hero .hero-title {
          font-size: 40px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--accent);
          line-height: 1.2;
        }
        .dp-hero .hero-tagline {
          margin-top: 20px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 480px;
        }
      `}</style>
    </section>
  );
}
