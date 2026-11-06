import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { getConfiguredSocialLinks, portfolio } from "@/data/portfolio";

export function Contact() {
  const socialLinks = getConfiguredSocialLinks(portfolio.social);
  const hasContact = Boolean(portfolio.email || portfolio.resumeUrl || socialLinks.length);

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-orbit" aria-hidden="true" />
      <p className="section-index">05 / Contact</p>
      <h2 id="contact-title" data-reveal>
        Let’s build something remarkable.
      </h2>
      <p className="contact-copy" data-reveal>
        Building an operational platform, modernizing an internal workflow, or looking
        for a full-stack developer? Send the context and let’s talk.
      </p>
      {hasContact ? (
        <div className="contact-actions" data-reveal>
          {portfolio.email ? (
            <a className="button button-primary" href={`mailto:${portfolio.email}`}>
              <Mail aria-hidden="true" size={17} /> Email me
            </a>
          ) : null}
          {socialLinks.map((social) => (
            <a key={social.key} href={social.url} target="_blank" rel="noreferrer">
              {social.label} <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
          {portfolio.resumeUrl ? (
            <a href={portfolio.resumeUrl} target="_blank" rel="noreferrer">
              <FileText aria-hidden="true" size={16} /> Resume
            </a>
          ) : null}
        </div>
      ) : (
        <p className="contact-setup" data-reveal>
          Configure your email and social links in <code>src/data/portfolio.ts</code> to
          activate contact actions.
        </p>
      )}
    </section>
  );
}

