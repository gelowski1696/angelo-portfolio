import type { Portfolio, Project, SocialLink } from "@/types/portfolio";

export const portfolio: Portfolio = {
  name: "Angelo Luzong",
  siteUrl: "https://angeloluzong-github-io.vercel.app",
  eyebrow: "Full-stack developer · Business systems builder",
  role: "Full-stack developer building practical software for real operations.",
  tagline: "I build what’s next.",
  introduction:
    "I design and deliver full-stack platforms for sales, inventory, operations, and document workflows—from clear interfaces to reliable APIs and data models.",
  about: [
    "I build software around the way a business actually works. My recent work spans point-of-sale, inventory, reporting, multi-branch operations, and AI-assisted document generation across web, desktop, and mobile surfaces.",
    "Since 2021, I have worked across the full delivery path: shaping interfaces, connecting APIs and databases, resolving production issues, and supporting the people who use the system every day.",
  ],
  location: "Philippines",
  email: "luzongangelo1996@gmail.com",
  resumeUrl:
    "https://docs.google.com/document/d/19hkQuET5DcwsQLgDaZqXbXx_AZHHAmpR/edit?usp=sharing&ouid=105581785222199859657&rtpof=true&sd=true",
  social: {
    github: "https://github.com/gelowski1696",
    linkedin: "https://www.linkedin.com/in/angelo-luzong-9b1125274/",
  },
  strengths: [
    {
      title: "Business platforms",
      description:
        "Operational software for sales, inventory, reporting, and multi-location workflows.",
    },
    {
      title: "Full-stack ownership",
      description:
        "Interfaces, APIs, data models, authentication, and deployment treated as one system.",
    },
    {
      title: "Resilient operations",
      description:
        "Offline-aware flows, traceable actions, and practical controls for real working conditions.",
    },
    {
      title: "Production support",
      description:
        "Hands-on troubleshooting and continuous improvement grounded in user feedback.",
    },
  ],
  skills: {
    Frontend: ["TypeScript", "Angular", "React", "Next.js"],
    Backend: ["Node.js", "REST APIs", "Prisma", "JWT / RBAC"],
    "Data & systems": ["SQL", "PostgreSQL", "SQLite", "Firebase"],
    Delivery: ["Git", "Docker", "Vercel", "Offline-first apps"],
  },
  projects: [
    {
      slug: "vmjamtech-vpos",
      index: "01",
      title: "VMJAMTECH VPOS",
      label: "Production platform",
      isPlaceholder: false,
      summary:
        "An LPG operations platform connecting cashier workflows, inventory, transfers, reporting, and multi-branch oversight across web, desktop, and mobile.",
      challenge:
        "Keep pricing, stock movement, and shift activity consistent across locations—even when connectivity is unreliable.",
      architecture:
        "Multi-app monorepo · tenant-aware API · offline queue · auditable operations",
      stack: ["TypeScript", "Next.js", "Mobile", "Desktop"],
      accent: "#f28c5a",
      image: "/images/projects/vpos-overview.png",
      demoUrl: "https://vmjamtech.com/",
      repoUrl: "https://github.com/gelowski1696/vpos",
    },
    {
      slug: "vmjam-sales",
      index: "02",
      title: "VMJAM Sales",
      label: "Private operations dashboard",
      isPlaceholder: false,
      summary:
        "A secure owner-facing dashboard for reviewing sales and operational activity within the wider VMJAM business system.",
      challenge:
        "Give decision-makers a focused operational view while keeping private business data behind authenticated access.",
      architecture:
        "Angular application · authenticated session · production cloud deployment",
      stack: ["Angular", "TypeScript", "Responsive UI", "Cloud"],
      accent: "#c66d45",
      linkNote: "Private deployment · authenticated access required",
      demoUrl: "https://vmjamdocuai.cloud/",
      repoUrl: "",
    },
  ],
  experience: [
    {
      period: "May 2022 — Present",
      role: "Programmer",
      organization: "ANSI Information Systems Inc.",
      summary:
        "Develop and maintain ERP and POS modules, resolve defects, improve performance, and support users with production issues.",
      isPlaceholder: false,
    },
    {
      period: "May 2021 — Present",
      role: "Full-stack Developer",
      organization: "Independent / Freelance",
      summary:
        "Design and deliver custom web and mobile applications, covering interfaces, APIs, databases, deployment, and ongoing improvements.",
      isPlaceholder: false,
    },
    {
      period: "July 2019 — March 2022",
      role: "Technical Support Representative",
      organization: "Infocom Technologies, Inc.",
      summary:
        "Resolved software, hardware, and connectivity issues through remote troubleshooting, clear documentation, and customer support.",
      isPlaceholder: false,
    },
  ],
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
