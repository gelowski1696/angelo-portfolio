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
      image: "/images/projects/vmjam-sales-landing.png",
      linkNote: "Private deployment · authenticated access required",
      demoUrl: "https://vmjamdocuai.cloud/",
      repoUrl: "",
    },
    {
      slug: "aurelia-developments",
      index: "03",
      title: "Aurelia Developments",
      label: "Real estate concept",
      isPlaceholder: false,
      summary:
        "An editorial property showcase exploring three distinct digital directions for a fictional modern real estate developer.",
      challenge:
        "Turn architectural imagery and multiple creative directions into a coherent, easy-to-navigate presentation.",
      architecture:
        "Next.js marketing site · editorial layouts · responsive image presentation",
      stack: ["Next.js", "Editorial UI", "Responsive Design", "Vercel"],
      accent: "#d49a73",
      image: "/images/projects/aurelia-developments.png",
      demoUrl: "https://real-state-web-delta.vercel.app/",
      repoUrl: "",
    },
    {
      slug: "jocel-beauty-lounge",
      index: "04",
      title: "Jocel Beauty Lounge",
      label: "Beauty service website",
      isPlaceholder: false,
      summary:
        "An image-led salon website introducing hair, nail, lash, and skin services with clear pathways toward appointment booking.",
      challenge:
        "Create a premium first impression while keeping service discovery and booking intent immediate on every screen size.",
      architecture:
        "Next.js marketing site · service-led navigation · responsive booking journey",
      stack: ["Next.js", "Service UX", "Responsive Design", "Vercel"],
      accent: "#d8ad73",
      image: "/images/projects/jocel-beauty-lounge.png",
      demoUrl: "https://jocel-beauty-lounge.vercel.app/",
      repoUrl: "",
    },
    {
      slug: "ligaya-guitars",
      index: "05",
      title: "Ligaya Guitars",
      label: "Product storytelling",
      isPlaceholder: false,
      summary:
        "A cinematic guitar brand experience pairing Philippine craftsmanship, product storytelling, and a direct path to commerce.",
      challenge:
        "Present detailed instruments with warmth and character without losing the practical route from discovery to purchase.",
      architecture:
        "Vite single-page site · immersive product narrative · external commerce pathway",
      stack: ["Vite", "Product UI", "Responsive Design", "Commerce"],
      accent: "#e0a651",
      image: "/images/projects/ligaya-guitars.png",
      demoUrl: "https://ligayaguitars.vercel.app/",
      repoUrl: "",
    },
    {
      slug: "eliseas-events",
      index: "06",
      title: "Elisea’s Events",
      label: "Events service website",
      isPlaceholder: false,
      summary:
        "A celebration-focused website presenting event organizing and themed food-cart rentals for Metro Manila occasions.",
      challenge:
        "Organize a broad service offering into a festive experience that still guides visitors quickly toward an inquiry.",
      architecture:
        "Next.js marketing site · service catalog · direct inquiry pathways",
      stack: ["Next.js", "Service Catalog", "Responsive Design", "Vercel"],
      accent: "#d48a3d",
      image: "/images/projects/eliseas-events.png",
      demoUrl: "https://eliseasevents.vercel.app/",
      repoUrl: "",
    },
    {
      slug: "cirok-tagaytay",
      index: "07",
      title: "Cirok Tagaytay",
      label: "Hospitality website",
      isPlaceholder: false,
      summary:
        "A scenic accommodation website presenting flexible Tagaytay penthouse packages, galleries, reviews, and booking routes.",
      challenge:
        "Lead with the destination’s atmosphere while making package comparison and booking requests easy for groups.",
      architecture:
        "Next.js hospitality site · package discovery · responsive booking journey",
      stack: ["Next.js", "Hospitality UX", "Responsive Design", "Vercel"],
      accent: "#7fa08b",
      image: "/images/projects/cirok-tagaytay.png",
      demoUrl: "https://ciroktagaytay.vercel.app/",
      repoUrl: "",
    },
    {
      slug: "johns-airsoft-storefront",
      index: "08",
      title: "John’s Airsoft",
      label: "Commerce storefront",
      isPlaceholder: false,
      summary:
        "A mobile-first tactical retail storefront focused on fast catalog discovery, trusted store information, and resilient product presentation.",
      challenge:
        "Make a large specialist catalog feel approachable while preserving fast discovery when richer product media is unavailable.",
      architecture:
        "Next.js storefront · catalog-oriented navigation · responsive product discovery",
      stack: ["Next.js", "Commerce UX", "Responsive Design", "Vercel"],
      accent: "#d94b4b",
      image: "/images/projects/johns-airsoft.png",
      demoUrl: "https://johnsairsoft-storefront.vercel.app/",
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
