export type SocialKey = "github" | "linkedin";

export type SocialLink = {
  key: SocialKey;
  label: string;
  url: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  label: string;
  isPlaceholder: boolean;
  summary: string;
  challenge: string;
  architecture: string;
  stack: string[];
  accent: string;
  image?: string;
  linkNote?: string;
  demoUrl: string;
  repoUrl: string;
  published?: boolean;
};

export type Experience = {
  period: string;
  role: string;
  organization: string;
  summary: string;
  isPlaceholder: boolean;
};

export type Portfolio = {
  name: string;
  siteUrl: string;
  eyebrow: string;
  role: string;
  tagline: string;
  introduction: string;
  about: string[];
  location: string;
  email: string;
  resumeUrl: string;
  social: Record<SocialKey, string>;
  strengths: Array<{ title: string; description: string }>;
  skills: Record<string, string[]>;
  projects: Project[];
  experience: Experience[];
};

