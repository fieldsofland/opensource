import { motion } from "framer-motion";
import { EASE_IN_SMOOTH, DUR_S } from "dease";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR_S[4], ease: EASE_IN_SMOOTH }}
      >
        Dynamic easing, dead simple.
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
        Dease is a library of production-ready easing curves, durations, and
        animation presets. Drop them into Framer Motion or CSS and get
        polished, professional motion without tweaking cubic-bezier values
        by hand.
      </motion.p>

      <motion.div
        className="hero-demo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DUR_S[5], ease: EASE_IN_SMOOTH, delay: 0.3 }}
      >
        <div className="hero-dot" />
      </motion.div>

      <style>{`
        .hero {
          padding: 120px 0 80px;
          border-bottom: none;
        }
        .hero-title {
          font-size: 40px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--accent);
          line-height: 1.2;
        }
        .hero-tagline {
          margin-top: 20px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 480px;
        }
        .hero-demo {
          margin-top: 48px;
          height: 24px;
          max-width: 100%;
          background: var(--bg-hover);
          border-radius: 9999px;
          position: relative;
          overflow: hidden;
          container-type: inline-size;
          padding: 4px;
        }
        .hero-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
          animation: hero-slide 4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        @keyframes hero-slide {
          0%   { transform: translateX(0); }
          35%  { transform: translateX(calc(100cqw - 24px)); }
          50%  { transform: translateX(calc(100cqw - 24px)); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
