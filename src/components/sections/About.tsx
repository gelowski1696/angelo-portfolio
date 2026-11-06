import { portfolio } from "@/data/portfolio";

export function About() {
  return (
    <section className="section intro" id="about" aria-labelledby="about-title">
      <div className="section-rail" data-reveal>
        <p className="section-index">01 / Profile</p>
        <p>From system intent to shipped interface.</p>
      </div>
      <div>
        <h2 id="about-title" data-reveal>
          Engineering with clarity, character, and consequence.
        </h2>
        <p className="lede" data-reveal>
          {portfolio.introduction}
        </p>
        <div className="about-copy" data-reveal>
          {portfolio.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="strength-list">
          {portfolio.strengths.map((strength, index) => (
            <article key={strength.title} data-reveal>
              <span>0{index + 1}</span>
              <h3>{strength.title}</h3>
              <p>{strength.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

