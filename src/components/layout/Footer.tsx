import { getConfiguredSocialLinks, portfolio } from "@/data/portfolio";

export function Footer() {
  const socialLinks = getConfiguredSocialLinks(portfolio.social);

  return (
    <footer>
      <span>© {new Date().getFullYear()} {portfolio.name}</span>
      <div>
        {socialLinks.map((social) => (
          <a href={social.url} key={social.key} target="_blank" rel="noreferrer">
            {social.label}
          </a>
        ))}
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

