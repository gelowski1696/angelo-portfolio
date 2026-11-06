import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import profileImage from "../../../images/profile.jpeg";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <figure className="hero-portrait" data-hero-visual>
        <Image
          src={profileImage}
          alt={`Portrait of ${portfolio.name}`}
          fill
          sizes="(max-width: 760px) 100vw, 56vw"
          placeholder="blur"
          fetchPriority="high"
        />
        <figcaption>Portrait / Profile 01</figcaption>
      </figure>

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
        <p className="hero-introduction">{portfolio.introduction}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            Explore projects <ArrowDownRight aria-hidden="true" size={18} />
          </a>
          <a className="button button-quiet" href="#contact">
            Start a conversation
          </a>
        </div>
      </div>

      <p className="hero-display-name" aria-hidden="true">
        {portfolio.name}
      </p>

      <div className="hero-location">
        <span>Based in</span>
        <strong>{portfolio.location}</strong>
      </div>

      <p className="scroll-cue">
        <span aria-hidden="true" /> Scroll to inspect the system
      </p>
    </section>
  );
}

