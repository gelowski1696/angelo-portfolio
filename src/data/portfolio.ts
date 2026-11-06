import type { Portfolio, Project, SocialLink } from "@/types/portfolio";

export const portfolio: Portfolio = {
  name: "YOUR NAME",
  eyebrow: "Software engineer · Creative technologist",
  role: "Full-stack engineer focused on thoughtful digital systems.",
  tagline: "I build what’s next.",
  introduction:
    "I turn complex product ideas into clear, resilient software—connecting architecture, interface craft, and measurable performance.",
  about: [
    "Replace this paragraph with the short version of your engineering story: the problems you enjoy, the teams you support, and the outcomes you care about.",
    "Use the second paragraph to explain how you work. Keep it specific, honest, and grounded in the systems or products you have actually shipped.",
  ],
  location: "YOUR LOCATION",
  email: "",
  resumeUrl: "",
  social: {
    github: "",
    linkedin: "",
  },
  strengths: [
    {
      title: "Product engineering",
      description: "Useful features shaped from problem definition through production.",
    },
    {
      title: "Systems thinking",
      description: "Clear boundaries, practical trade-offs, and maintainable architecture.",
    },
    {
      title: "Performance",
      description: "Measured experiences that remain responsive under real constraints.",
    },
    {
      title: "Interface craft",
      description: "Accessible interactions with detail, clarity, and purpose.",
    },
  ],
  skills: {
    Frontend: ["React", "TypeScript", "Next.js", "WebGL"],
    Backend: ["Node.js", "API design", "Testing", "Observability"],
    Data: ["PostgreSQL", "Data modeling", "Caching", "Search"],
    Delivery: ["Git", "CI/CD", "Cloud platforms", "Performance profiling"],
  },
  projects: [
    {
      slug: "signal-system",
      index: "01",
      title: "Signal System",
      label: "Sample / Replace me",
      isPlaceholder: true,
      summary: "A real-time operational workspace concept for turning noisy events into clear action.",
      challenge: "Replace this with the real user problem and the constraint that made it difficult.",
      architecture: "Event pipeline · typed service boundary · resilient client state",
      stack: ["TypeScript", "Next.js", "PostgreSQL"],
      accent: "#59d8ff",
      demoUrl: "",
      repoUrl: "",
    },
    {
      slug: "atlas-platform",
      index: "02",
      title: "Atlas Platform",
      label: "Sample / Replace me",
      isPlaceholder: true,
      summary: "A collaborative planning concept that keeps decisions, dependencies, and delivery in view.",
      challenge: "Replace this with a concise account of the system you designed or improved.",
      architecture: "Server-rendered shell · optimistic actions · auditable domain model",
      stack: ["React", "Node.js", "Cloud"],
      accent: "#718cff",
      demoUrl: "",
      repoUrl: "",
    },
    {
      slug: "vector-engine",
      index: "03",
      title: "Vector Engine",
      label: "Sample / Replace me",
      isPlaceholder: true,
      summary: "A visual data exploration concept engineered for fast filtering and legible complexity.",
      challenge: "Replace this with the performance target, scale, or technical risk you handled.",
      architecture: "Streaming queries · worker processing · GPU-assisted rendering",
      stack: ["WebGL", "Workers", "Testing"],
      accent: "#8be9fd",
      demoUrl: "",
      repoUrl: "",
    },
  ],
  experience: [],
};

const socialLabels: Record<keyof Portfolio["social"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
};

export function getConfiguredSocialLinks(
  social: Portfolio["social"],
): SocialLink[] {
  return (Object.entries(social) as Array<[keyof typeof social, string]>)
    .filter(([, url]) => url.trim().length > 0)
    .map(([key, url]) => ({ key, label: socialLabels[key], url }));
}

export function getPublishedProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.published !== false);
}

