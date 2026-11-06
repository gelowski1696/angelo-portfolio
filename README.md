# Digital Engineer Portfolio

A production-oriented, single-page software engineer portfolio built with Next.js,
TypeScript, Tailwind CSS, GSAP, and React Three Fiber. The experience is
server-rendered first and progressively enhanced with motion and a procedural WebGL
scene.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm browser:check # requires Chrome and a running pnpm dev server
```

The browser check uses an isolated temporary Chrome profile. It verifies desktop,
mobile, and reduced-motion rendering, captures screenshots in `.browser-check/`,
checks the accessibility tree for unnamed controls, detects overflow, and fails on
console errors or warnings.

## Customize the portfolio

Edit [`src/data/portfolio.ts`](src/data/portfolio.ts). Replace every uppercase
placeholder and each project marked `Sample / Replace me` with factual information.

Required before publishing:

- name, role, location, and short biography
- three real projects with technical decisions and outcomes
- real technology categories
- employment or experience entries
- email, GitHub, and LinkedIn URLs
- deployed `siteUrl`
- final page title, description, and social-share copy in `src/app/layout.tsx`
- social-share content in `src/app/opengraph-image.tsx`

Empty email, résumé, demo, repository, and social URLs are intentionally omitted from
the interface. Search indexing remains disabled until `siteUrl` is configured.

## Architecture

- `src/app/` — App Router page, metadata, global visual system, and generated assets
- `src/components/sections/` — server-rendered portfolio content
- `src/components/layout/` — navigation and footer
- `src/components/three/` — client-only procedural scene and static fallback
- `src/components/motion/` — GSAP orchestration with cleanup
- `src/data/portfolio.ts` — typed content source of truth
- `src/lib/capabilities.ts` — WebGL, reduced-motion, and Save-Data policy

The page remains complete without WebGL. Reduced motion, Save-Data, and WebGL failure
all retain the static computational-core composition. The Three.js bundle is loaded
client-side only after capability checks.

## Security and dependency notes

The production response includes a restrictive Content Security Policy plus clickjacking,
MIME-sniffing, referrer, permissions, and legacy XSS hardening headers. The app has no
authentication, API routes, forms, uploads, cookies, or user data storage; public contact
details are intentionally configured in the portfolio data file.

`pnpm audit` currently reports one moderate `minimatch` advisory in the development-only
ESLint/type-tooling graph. It is not included in the browser bundle and this project does
not pass attacker-controlled glob patterns to that tooling. Recheck the audit after the
next supported ESLint/TypeScript-tooling upgrade rather than forcing an incompatible
major-version override.

## Deployment

Run `pnpm build`, configure the real site URL and content, then deploy to any current
Next.js-compatible host. Verify the production URL with the same browser and
accessibility checks before enabling indexing.

## Asset and license notes

The visual artwork is procedural CSS/SVG/Three.js code created for this project. No
third-party photographs, models, screenshots, logos, or audio assets are included.
Dependency licenses remain governed by their respective packages.

