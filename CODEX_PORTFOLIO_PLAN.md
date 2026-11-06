# CODEX BUILD PLAN — Futuristic 3D Software Engineer Portfolio

> **Purpose:** Paste this entire file into Codex as the implementation brief, or place it at the root of the repository as `PLAN.md` and tell Codex: **“Implement PLAN.md completely. Start by auditing the repository, then build, test, and polish the portfolio. Do not stop at planning.”**
>
> **Project:** Premium, futuristic dark portfolio for a software developer / programmer / software engineer.
>
> **Visual references (inspiration only):** [Lusion](https://lusion.co/) for immersive 3D and cinematic lighting; [Henry Heffernan](https://henryheffernan.com/) for a developer-centric interactive 3D computer/workspace; [Dennis Snellenberg](https://dennissnellenberg.com/) for editorial typography, polished motion, hover interactions, and page transitions.
>
> **Important:** Create an **original** website that captures the qualities above. Do **not** reproduce their source code, distinctive illustrations, models, content, branding, or exact layout. Build original assets and interactions.

---

## 1. Codex role and execution contract

You are acting as a **senior creative developer, 3D web engineer, motion designer, UI/UX designer, and QA engineer**. Your assignment is to **deliver a production-quality working portfolio**, not a wireframe, mockup, design proposal, or a planning-only response.

1. Inspect the existing repository and identify framework, packages, commands, conventions, and current issues **before editing**. Preserve useful existing work.
2. If this is an empty project, initialize a **Next.js App Router + TypeScript** application. Use **Tailwind CSS**, **React Three Fiber / Three.js**, **@react-three/drei**, **GSAP + ScrollTrigger**, **Motion for React** (or Framer Motion if the existing project uses it), and **Lucide React** icons. Prefer dependencies already present. Add only libraries that materially improve the result.
3. Implement all website sections, responsive layouts, interactive elements, 3D scenes, animations, and functional links. Do not use decorative controls that do nothing.
4. Make design and engineering decisions autonomously when a detail is unspecified. Use placeholders for unknown *personal* information; **never invent** an employer, credential, project, award, client, testimonial, or business metric.
5. Run available linting, type checks, builds, and tests. Fix issues discovered. Do not claim a test passed unless it actually ran.
6. Finish with a concise report: what you built, routes/features, commands executed and results, any known gaps, and exactly which content the portfolio owner must customize.

### Definition of success

The site should feel like a **premium interactive digital experience**, but remain **fast, readable, navigable, accessible, and convincing to engineering recruiters and clients**. The first screen must be striking; the content must still prove software engineering capabilities.

---

## 2. Creative direction and art direction

**Concept name:** `THE DIGITAL ENGINEER // BUILDING FUTURE SYSTEMS`

**Mood:** Futuristic, cinematic, precise, elegant, technically sophisticated, minimal rather than cluttered. Use strong contrast, rich depth, tasteful neon, glass surfaces, and purposeful animation. Avoid the generic “purple gradient + floating orb + endless cards” template look.

**Design principles:**

- **Dark-first** interface: deep navy/near-black base with cyan, electric blue, and soft indigo accent light.
- **One memorable original 3D hero object**: a sculptural interactive computer/terminal or abstract modular computing core, with visible detail (screen, panels, circuitry, layered glass, or geometric architecture).
- **Editorial layout**: oversized headings, generous negative space, disciplined grid, asymmetric compositions, restrained labels, and a clear reading hierarchy.
- **Light behaves like a material**: use subtle emissive edges, reflections, believable shadows, atmospheric glow, depth and parallax. Don't turn every surface into glowing glass.
- **Motion communicates meaning**: reveal content, show hierarchy, connect sections, and encourage exploration—not random animation everywhere.
- **Developer-first credibility**: featured projects, architectures/decisions, tech stack, links to live demos and GitHub, experience, and clear contact call to action.

### Suggested design tokens

Use CSS custom properties and ensure actual contrast meets accessibility expectations. Suggested starting palette (adjust for visual quality):

```css
:root {
  --bg: #070a12;
  --bg-elevated: #0e1524;
  --surface: #111b2c;
  --surface-glass: rgba(19, 31, 51, 0.58);
  --text: #eef4ff;
  --text-muted: #9baac1;
  --accent: #59d8ff;
  --accent-secondary: #718cff;
  --border: rgba(155, 189, 237, 0.17);
  --focus: #94ebff;
}
```

- Fonts: one distinctive variable display face paired with a crisp UI sans and restrained monospaced labels. Prefer performant, self-hosted or `next/font` font loading; ensure robust fallback fonts.
- Rounded corners: moderate; clean geometric panels rather than soft, inflated cards.
- Spacing: large vertical breathing room on desktop and deliberate compaction on mobile.
- Borders: low-opacity hairlines, not thick outlines throughout.
- Optional subtle noise/grid textures: CSS-generated, non-distracting, optimized.
- **Dark is the default and primary identity**. Do not add a light-mode toggle unless it is genuinely fully designed and functional; do not sacrifice scope for it.

---

## 3. Information architecture and content

Prefer a **high-impact single-page portfolio** with anchored sections, plus optional dedicated project case-study pages. All sections must be reachable through normal accessible navigation; the 3D scene must never be the sole way to navigate.

### A. Header / navigation

- Minimal, sticky or floating nav with custom wordmark (`<Developer Name />`), About, Projects, Experience, Stack, and Contact.
- Current-section indicator, hover underline/highlight, and mobile menu with proper keyboard and touch support.
- Small availability/status label may be shown **only if editable and not presented as a real claim by default**.
- Functional `View résumé` link **only when a real résumé asset is configured**; otherwise show a clearly marked setup action or omit it.

### B. Hero — signature 3D experience

**Above-the-fold composition:**

- Dominant statement: **“I BUILD WHAT'S NEXT.”** or another original concise engineering headline.
- Subtitle: **“Software Engineer • Full-Stack Developer • Creative Technologist”** as editable copy.
- Short value proposition focused on designing, engineering, and shipping useful software.
- Primary CTA: `Explore Projects` (scrolls correctly to featured work).
- Secondary CTA: `Contact Me` (jumps to contact) or `Explore the Lab` (opens a meaningful interactive scene mode).
- Signature **interactive Three.js terminal / modular computational core** positioned alongside or behind the typography without impairing readability.
- A low-key scroll cue, technical metadata, and subtle background grid/depth layers.

**3D hero behavior:**

- Idle animation: slow intentional floating/rotation, subtle pulsating light, minimal ambient particles.
- Pointer movement: bounded, eased camera/object rotation; never jerky, nauseating, or excessively sensitive.
- Scroll progression: change camera framing / object configuration to transition toward the next section; maintain scroll stability.
- Desktop interaction: clicking a clear hotspot on the 3D object opens a labeled detail panel (e.g., “System Overview”) showing skills, a short engineering statement, or links. The hotspot must have an equivalent HTML button/accessible control.
- Mobile: simplified 3D with fewer effects and touch-friendly interactions, or a polished static/CSS fallback.
- Gracefully handle WebGL unavailable, low-powered devices, reduced motion, and loading errors.

### C. About / engineering profile

- Distinctive section heading and 2–3 short paragraphs with editable placeholder content.
- Optional tech-terminal motif with a real, readable code-inspired panel (do not fake an interactive command line if commands won't work).
- 3–4 concise strength statements, such as product engineering, systems thinking, performance, and user experience.
- Motion: staggered text reveal and restrained parallax; maintain normal selectable HTML text.

### D. Featured projects — most important content section

- Show **3–4 editable project entries** sourced from a local typed data file (e.g., `src/data/portfolio.ts`).
- For each entry: project name, short outcome/problem, role, year (if real), stack, screenshot/visual, architecture/technical highlight, `Live Demo` and `Source Code` links (only if available).
- Use **high-end horizontal or vertical showcase panels** with oversized project numbers, bold typography, scroll-triggered reveal, image transforms, hover tilt, and subtle lighting/glow.
- Allow a case-study detail panel or optional `/projects/[slug]` route with problem, approach, architecture, trade-offs, and result.
- Include meaningful **example projects marked `SAMPLE / REPLACE ME`** if real data is absent. Never pass samples off as real accomplishments.
- If no screenshots exist, generate attractive original abstract placeholder compositions in CSS/SVG; never fabricate product screenshots for a supposed real app.
- Provide accessible ways to browse without hover or scroll animations.

### E. Skills / tech ecosystem

- Present technical competencies clearly and honestly in editable categories: Frontend, Backend, Databases, Cloud/DevOps, Tools, 3D/Motion (if relevant).
- Use elegant connected-node / orbit / constellation-inspired visual **as a secondary enhancement**, paired with an HTML list for accessibility and SEO.
- Avoid giant unsubstantiated skill percentages and proficiency gauges.
- Subtle hover/tap micro-interactions with real tooltips/descriptions where useful.

### F. Experience / engineering timeline

- Vertical editorial timeline using editable placeholder roles and bullet outcomes **clearly designated as examples**, or show a polished “Experience details coming soon” state until populated.
- Add scroll-progress line and measured entrance transitions.
- Keep dates, companies, and responsibilities factual once populated.

### G. Contact / final CTA

- Memorable final headline, e.g. **“LET'S BUILD SOMETHING REMARKABLE.”**
- `Email Me` button with a configured `mailto:` link; show editable placeholder if missing.
- GitHub / LinkedIn / other links only if configured; do not ship dead `#` links.
- Optional clipboard-copy email action with success feedback; fallback when clipboard unavailable.
- Thoughtful footer with year, accessible back-to-top button, and lightweight motion.

---

## 4. Motion language and interaction specifications

Treat animation as a system. Establish reusable motion tokens/utilities for durations, easing, staggering, and viewport triggers.

| Interaction | Expected behavior | Implementation guidance |
|---|---|---|
| Initial load | Short cinematic intro: text enters, scene resolves from darkness, UI stabilizes | Keep quick; never trap access behind a long loading screen |
| Hero object | Gentle floating with subtle emissive details and pointer response | React Three Fiber `useFrame`, damped interpolation, capped DPR |
| Section reveals | Text masks, opacity/translate, staggered elements | GSAP ScrollTrigger or Motion; avoid duplicative animation systems |
| Page/section transitions | Seamless, polished changes that preserve context | GSAP/Motion; animate transforms and opacity where possible |
| Project cards | Cursor-follow spotlight, slight perspective tilt, image depth | CSS transforms/JS pointer handling, disabled for reduced motion |
| Buttons and links | Magnetic hover or restrained spring response, visible focus | Keep native semantics and good touch targets |
| Background | Sparse grid, glowing lines, subtle ambient particles | Prefer CSS; cap particle counts and GPU cost |
| Scroll | Refined natural scroll with progress indicator (optional) | Don't hijack wheel, break keyboard scroll, or block native anchors |

### Non-negotiable motion rules

- Respect `prefers-reduced-motion` everywhere: disable camera sweeps, parallax, large transforms, smooth-scroll effects, and nonessential loops; retain usable content and navigation.
- Avoid heavy motion under text, aggressive cursor trails, flashing, strobing, or constant full-screen distortion.
- Keep input latency low; do not attach unthrottled expensive work to `scroll` or `mousemove`.
- Animations must clean up their listeners, observers, tickers, and GSAP contexts on unmount.
- Make touch behavior intentionally different where hover isn't available.

---

## 5. Technical architecture

### Default stack

- **Next.js** (App Router), **React**, **TypeScript**
- **Tailwind CSS** for layout and styling; CSS variables for global design tokens
- **Three.js**, **@react-three/fiber**, **@react-three/drei** for scene, lighting, meshes, controls
- **GSAP + ScrollTrigger** for orchestrated scroll choreography
- **Motion for React** for small local UI transitions when useful; avoid redundant animation layers
- **Lucide React** for consistent UI icons
- **next/font** and **next/image** where applicable

Prefer **procedural geometries and original CSS/SVG** first so the project is fully functional without obtaining paid 3D models. If adding external free assets, record URLs, attribution, licenses, and usage notes; never use assets without appropriate rights.

### Suggested organization (adapt to actual repo)

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    projects/[slug]/page.tsx     # optional if case-study routes are built
  components/
    layout/                      # Nav, Footer, Section, MobileMenu
    sections/                    # Hero, About, Projects, Stack, Experience, Contact
    three/                       # HeroScene, TerminalCore, SceneFallback
    motion/                      # Reveal, SectionTransition, MotionProvider
    ui/                          # Button, ProjectCard, SocialLinks, Spotlight
  data/
    portfolio.ts                 # one editable source of truth for content/links
  lib/
    motion.ts
    three.ts
    utils.ts
  types/
    portfolio.ts
public/
  og/                            # social preview assets
  projects/                      # actual or clearly labeled sample images
README.md
```

### Implementation requirements

- Use client components **only where interactivity demands** them; keep content server-rendered when feasible.
- Dynamically import WebGL sections client-side; use a robust `Suspense`/loading fallback and an error boundary around the scene.
- Provide a meaningful static layout and hero while 3D is loading or disabled.
- Guard against hydration mismatch, layout shift, duplicate canvas mounts, memory leaks, and animation re-initialization.
- Cap device pixel ratio according to capability and limit costly effects (shadows, transmission, postprocessing, excessive lights, particles).
- Keep portfolio data in a clearly typed configuration file so the owner can update identity, skills, projects, experience, links, social preview, and email without modifying components.
- Support keyboard navigation and visible focus; maintain semantic headings, accessible form/interaction names, and logical tab order.
- For any links not configured, omit the action or display an obvious non-clickable placeholder; no dummy URLs or `href="#"`.
- Validate route/asset URLs and ensure all images have meaningful alternative text or are explicitly decorative.
- Add metadata, canonical handling where configured, Open Graph/Twitter sharing tags, robots/sitemap as applicable, and an original favicon.
- Keep a coherent responsive layout at 360, 390, 768, 1024, 1440, and 1920px; prevent horizontal overflow.

---

## 6. Step-by-step delivery plan

Execute each phase, verify it, then move forward. **Do not stop after Phase 0 or Phase 1.** Keep the app runnable throughout.

### Phase 0 — Audit and plan against the repository

- Inspect root files, dependencies, existing components, assets, project scripts, and runtime constraints.
- Note what can be reused vs. what needs to be built or redesigned.
- Translate this plan into a short internal task checklist. Do not ask the user to approve obvious design details.

**Exit check:** Existing framework and runnable commands established; no useful work accidentally deleted.

### Phase 1 — Foundation and visual system

- Set up framework/dependencies (if needed), global styles, design tokens, type scale, fonts, container/grid, shared buttons, navigation, and footer.
- Build responsive page skeleton with all anchor destinations working.
- Populate typed sample content **clearly marked for replacement** and provide owner config instructions.

**Exit check:** Full page renders across desktop/mobile with content and no missing sections, even before 3D/animations.

### Phase 2 — High-fidelity layouts

- Implement refined, editorial Hero, About, Featured Work, Stack, Experience, and Contact layouts.
- Create unique reusable project showcase patterns. Focus on typography, alignment, contrast, and spacing before adding effects.
- Add practical calls to action and functional navigation; eliminate dead links.

**Exit check:** Website looks premium with animations disabled.

### Phase 3 — Signature interactive 3D hero

- Build the **original procedural 3D terminal/core** with high-quality geometry, materials, controlled glow, appropriate lighting, shadows, and camera composition.
- Connect limited mouse interaction and a meaningful accessible hotspot/panel.
- Add desktop scroll-responsive framing, mobile scene simplification, reduced-motion and no-WebGL fallbacks.
- Provide explicit quality/performance tiers where needed.

**Exit check:** 3D works without throwing console errors, remains readable, and does not break navigation/mobile usage.

### Phase 4 — Motion and micro-interactions

- Implement entrance choreography, section reveals, project-card motion, hover states, magnetic buttons where appropriate, and a refined scroll progress / transition system.
- Check all effects with keyboard navigation, touch devices, and reduced motion enabled.

**Exit check:** Motion feels coordinated and deliberate; no scroll jank or inaccessible controls.

### Phase 5 — Performance, accessibility, SEO

- Remove unnecessary assets/packages/effects, split heavy scene code, review GPU cost and network behavior, optimize fonts/images, and avoid layout shift.
- Add semantic SEO metadata, social preview configuration, and favicon.
- Audit keyboard operation, contrast, focus, descriptive labels, reduced motion, and fallback states.

**Exit check:** Site remains usable on a mid-range phone and without WebGL; metadata and basic accessibility checks pass.

### Phase 6 — QA and final polish

- Run project-native `lint`, `typecheck` (or `tsc --noEmit`), `test` if present, and `build` commands.
- If browser automation / screenshot tooling is available, visually test desktop and mobile, and fix issues found. If not available, explicitly report the limitation; do not claim visual tests were run.
- Validate navigation anchors, CTA behavior, project links, mailto behavior, mobile menu, keyboard/focus, responsive layouts, console errors, 3D fallback, and reduced motion.
- Update `README.md` with setup, dev/build commands, deployment, customization instructions, asset licenses, and performance considerations.

**Exit check:** Build succeeds, critical interactions work, and remaining limitations are documented.

---

## 7. QA acceptance checklist

Check each item before declaring the project complete:

### Design
- [ ] Distinctive original 3D hero and striking visual hierarchy
- [ ] Premium dark futuristic aesthetic with tasteful cyan/blue lighting
- [ ] Consistent typography, spacing, card treatments, hover/focus states
- [ ] No unfinished/blank sections, overlapping UI, clipped content, or horizontal scrolling
- [ ] Visual quality remains strong even with motion off

### Functionality
- [ ] Header links and section anchors work
- [ ] Mobile navigation opens/closes and supports keyboard/touch
- [ ] Hero buttons perform real actions
- [ ] 3D controls/hotspots are understandable and have accessible equivalents
- [ ] Featured projects render from the editable data source
- [ ] Contact email/social buttons work only when configured
- [ ] No broken image imports, missing assets, dead links, or fake functionality

### Performance and resilience
- [ ] No page-blocking 3D load or unnecessarily prolonged intro
- [ ] 3D fallback visible when WebGL fails / unsupported
- [ ] Canvas, event handlers, GSAP triggers and animation loops clean up correctly
- [ ] Reduced-motion support verified
- [ ] Mobile performance mitigations in place
- [ ] No critical runtime errors, hydration warnings, or memory leaks discovered

### Accessibility and quality
- [ ] Semantically correct headings and landmarks
- [ ] Adequate color contrast and visible keyboard focus
- [ ] All meaningful interactive elements keyboard-accessible
- [ ] Clear tap targets and descriptive names
- [ ] Meaningful `alt` text or decorative image treatment
- [ ] Typecheck, lint, build, and available tests completed (report exact outcomes)
- [ ] README updated with owner customization notes

---

## 8. Portfolio data configuration

Create an easy-to-edit configuration, using this **illustrative shape** (adapt it; do not invent real biography details):

```ts
export const portfolio = {
  name: "YOUR NAME",
  role: "Software Engineer / Full-Stack Developer",
  tagline: "I build what's next.",
  location: "YOUR LOCATION (optional)",
  about: "REPLACE WITH YOUR REAL BIO",
  email: "", // Do not enable email CTA until configured
  resumeUrl: "", // Leave hidden until an actual file/link is provided
  social: {
    github: "",
    linkedin: "",
  },
  skills: {
    frontend: ["React", "TypeScript"], // EXAMPLE ONLY
    backend: ["Node.js"],               // EXAMPLE ONLY
    tooling: ["Git"],                   // EXAMPLE ONLY
  },
  projects: [
    {
      slug: "sample-project",
      title: "Sample Project — Replace Me",
      isPlaceholder: true,
      summary: "Describe a real challenge you solved.",
      stack: ["TypeScript"],
      demoUrl: "",
      repoUrl: "",
    },
  ],
  experience: [],
};
```

Ensure `isPlaceholder` is visibly conveyed in the rendered UI or avoid publishing that entry by default. The site must be impressive without suggesting fabricated professional credentials.

---

## 9. Final output expected from Codex

After implementation, respond with:

1. **Completed work:** main sections, scene, animations, responsiveness, and accessibility features.
2. **Files changed / project structure** with key configuration path(s).
3. **How to run:** install, start dev server, production build, and deploy.
4. **Verification:** exact commands and pass/fail results; mention any tests not run.
5. **Customizations needed:** real name, bio, GitHub/LinkedIn, resume, email, experience, real projects/screenshots, and any other placeholders.
6. **Known limitations / remaining TODOs**, especially any browser/WebGL checks not possible in the available environment.

### Final instruction to Codex

**Implement the website now. Do not merely restate this plan or generate a mockup. Deliver polished, functional, maintainable code with a fully realized futuristic dark aesthetic, thoughtful 3D, intentional motion, responsive behavior, and verifiable QA. Prioritize originality and engineering credibility over visual gimmicks.**
