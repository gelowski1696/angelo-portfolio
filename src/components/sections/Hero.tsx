import { ArrowDownRight, Cpu, Sparkles } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { HeroVisual } from "@/components/three/HeroVisual";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy" data-reveal>
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          {portfolio.eyebrow}
        </p>
        <h1 id="hero-title">
          I build
          <span>what’s next.</span>
        </h1>
        <p className="hero-role">{portfolio.role}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            Explore projects <ArrowDownRight aria-hidden="true" size={18} />
          </a>
          <a className="button button-quiet" href="#contact">
            Start a conversation
          </a>
        </div>
        <dl className="hero-meta" aria-label="Portfolio overview">
          <div>
            <dt>Focus</dt>
            <dd>Product systems</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>Design + engineering</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>Open to the right work</dd>
          </div>
        </dl>
      </div>

      <HeroVisual />

      <details className="system-overview">
        <summary>
          <Cpu aria-hidden="true" size={16} /> System overview
        </summary>
        <div>
          <Sparkles aria-hidden="true" size={18} />
          <p>{portfolio.introduction}</p>
        </div>
      </details>

      <p className="scroll-cue">
        <span aria-hidden="true" /> Scroll to inspect the system
      </p>
    </section>
  );
}

