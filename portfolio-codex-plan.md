# Codex Prompt Plan: "The Console" — Futuristic Dark Portfolio

A dark, futuristic personal portfolio that blends three reference *feels* (principles only, never code, assets, copy or layouts):

| Reference | What we borrow (principle) | How it shows up here |
|---|---|---|
| **Lusion** | Playful WebGL, physics, tactile 3D objects that react to the cursor, scroll-driven 3D scenes | Persistent 3D canvas, floating glossy shards with physics, cursor-reactive light, a "Lab" physics playground |
| **Henry Heffernan** | A diegetic world: the site is a *place*, and you travel *into the screen* | A glowing console monolith in a dark void; the camera dollies into its screen; CRT-style boot sequence; terminal / command palette |
| **Dennis Snellenberg** | Editorial typography, buttery smooth scroll, magnetic buttons, custom cursor, hover-preview project list, bold footer CTA | Big fluid type, Lenis smooth scroll, word-reveal text, work list with cursor-following previews, giant contact footer, wipe page transitions |

**Originality rule:** nothing is cloned. Own geometry, own copy, own layout, own palette. Use the references as a mood board, not a spec.

---

## 0. How to use this plan with Codex

1. Create an empty repo and open Codex in it.
2. Paste **Section 2 (Master Brief)** as your first message and ask Codex to save it as `AGENTS.md` so every later task inherits the rules.
3. Run **Phases 0 to 10 in order**, one Codex task per phase. Do not batch phases.
4. After each phase: run `pnpm lint && pnpm typecheck && pnpm build`, check the browser, then commit (`git commit -m "phase N: ..."`).
5. Fill in the placeholders in **Section 10** before Phase 5.
6. If a phase misbehaves, use the **Fix prompt template** in Section 11 instead of re-running the whole phase.

---

## 1. Experience flow

1. **Preloader** — mono percentage counter, a line draws across, glitch-reveal of the name, then the world fades in. Plays once per session.
2. **Hero (3D)** — dark void, fog, drifting dust. A slim glowing console monolith floats in the center, surrounded by glossy shards that drift and repel from the cursor. Huge display headline sits in the DOM on top. Buttons: `Enter the console` and `Skip to classic site`.
3. **Enter transition** — scroll (or click `Enter`) scrubs the camera on a path into the monolith's screen. Bloom swells, CRT distortion ramps, boot text types out (`> booting portfolio.os ... [OK]`), then hands off to the 2D editorial layout.
4. **Editorial home** — scroll-reveal intro statement, Selected Work list with hover previews, capabilities marquee, about teaser, giant contact footer.
5. **Inner pages** — `/work`, `/work/[slug]`, `/about`, `/lab`, `/contact`, joined by wipe page transitions while the 3D canvas persists and swaps scenes.
6. **Everywhere** — custom cursor, magnetic buttons, `Cmd/Ctrl+K` terminal palette, opt-in sound, `Immersive / Classic` mode toggle.

---

## 2. Master Brief (paste first, save as `AGENTS.md`)

```text
You are building "The Console", a futuristic dark portfolio website. Read this brief fully and follow it in every task.

GOAL
A premium, award-site-quality personal portfolio. Feel: dark, futuristic, tactile, editorial.
Blend three feels (principles only, NEVER copy code, assets, copy, layouts or brand elements from any real site):
- Playful WebGL and physics (Lusion-like): interactive 3D objects, cursor-reactive lighting.
- A diegetic "travel into the screen" world (Henry Heffernan-like): a 3D console whose screen we fly into, CRT/boot aesthetics, terminal.
- Editorial polish (Dennis Snellenberg-like): giant type, smooth scroll, magnetic buttons, custom cursor, hover-preview project list, bold footer CTA, wipe page transitions.

TECH STACK (do not substitute without asking)
- Next.js 14 (App Router), React 18, TypeScript (strict), pnpm
- Tailwind CSS + CSS variables for design tokens
- three, @react-three/fiber v8, @react-three/drei v9, @react-three/postprocessing v2, @react-three/rapier v1
- GSAP (+ ScrollTrigger) for all DOM animation. Do NOT also add framer-motion.
- Lenis for smooth scroll, synced to the GSAP ticker
- zustand for global UI state
- howler for audio (opt-in only)
- zod for validation, Resend (optional via env) for the contact form
- Deploy target: Vercel

ARCHITECTURE RULES
1. ONE persistent <Canvas> mounted in the root layout, fixed behind the DOM. Scenes swap by route via a zustand `scene` key. Never remount the canvas on navigation.
2. Load the canvas with next/dynamic, { ssr: false }, after first paint. All meaningful content (text, links, project info) must exist as real server-rendered HTML for SEO and no-JS/low-power users.
3. Never put per-frame values in React state. Use refs + useFrame, or GSAP quickTo.
4. Every GSAP animation lives inside gsap.context() and is reverted on unmount.
5. Three.js objects, geometries, materials and textures are disposed on unmount.
6. Content lives in typed files under /content (site.ts, projects.ts). No content hardcoded inside components.
7. Provide a "Classic" mode (no WebGL, no Lenis, simple fades) used when: WebGL unavailable, prefers-reduced-motion, Save-Data, low-tier GPU, or user toggles it. Persist the choice in localStorage.
8. Accessibility is a requirement, not a polish item: semantic landmarks, skip link, visible focus styles, WCAG AA contrast, canvas is aria-hidden, audio is OFF by default, all motion respects prefers-reduced-motion.
9. No `any`. No unused code. Small focused components. Comment only the non-obvious.
10. Do not invent stock photography, logos, testimonials or client names. Use generated gradient/noise placeholders until real assets exist, and clearly mark placeholders.

WORKFLOW RULES
- Work only on the phase requested. Do not start later phases.
- Before finishing a task run: pnpm lint && pnpm typecheck && pnpm build. Fix what fails.
- If a dependency has a peer conflict, report it. Do not use --force or --legacy-peer-deps.
- End each task with: what changed, files touched, how to verify, known gaps.
```

---

## 3. Design system

### 3.1 Color tokens

```css
:root {
  --void:      #05060A;  /* page background */
  --surface-1: #0A0C12;
  --surface-2: #10131C;
  --line:      rgba(232, 236, 244, 0.08);

  --text:      #E8ECF4;
  --text-dim:  #9AA3B5;
  --text-mute: #7C8599;  /* keep >= 4.5:1 on --void */

  --ion:    #5CF2FF;     /* primary accent: screen glow, links, focus */
  --volt:   #8B6CFF;     /* secondary accent: gradients, 3D highlights */
  --signal: #FF6B4A;     /* sparingly: live dot, errors */
}
```

Use accent glows sparingly. 90% of the screen is void, text and hairlines. Gradient accent: `linear-gradient(120deg, var(--ion), var(--volt))`.

### 3.2 Typography (via `next/font/google`)

- **Display:** Bricolage Grotesque (variable) for headlines, tight tracking (`-0.04em`), line-height `0.9`.
- **Body:** Inter Tight.
- **Mono:** JetBrains Mono for labels, counters, terminal, boot text, metadata (uppercase, `0.08em` tracking).
- **Fluid scale:** hero `clamp(3.5rem, 13vw, 15rem)`, h2 `clamp(2.25rem, 6vw, 6rem)`, body `clamp(1rem, 1.1vw, 1.125rem)`, mono label `0.75rem`.

### 3.3 Layout

- 12-column grid, `clamp(1rem, 3vw, 3rem)` gutters, max content width 1600px.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 160.
- 1px hairline borders (`--line`), tiny radius (2 to 4px) except pills. A film-grain noise overlay at 4 to 6% opacity.
- Debug grid overlay toggled with the `G` key (dev only).

### 3.4 Motion language

- Primary ease: `expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)`. Secondary: `power3.inOut` for wipes.
- Durations: micro 0.2 to 0.3s, reveals 0.8 to 1.2s, page wipes 0.9s, camera dolly 2.4s.
- Reveals are masked (`overflow: hidden` + translateY 110% to 0) and staggered by line or word.
- One signature motif repeated everywhere: a thin **scanline / hairline sweep** (ties the CRT screen, loaders, hovers and transitions together).

### 3.5 Cursor states

`default` (small dot + lagging ring), `link` (ring scales up, ion tint), `view` (filled circle with "VIEW" label over projects), `drag` (Lab), `hidden` (inputs, touch devices).

---

## 4. Sitemap

| Route | Purpose |
|---|---|
| `/` | Preloader, 3D hero, enter transition, editorial sections |
| `/work` | Full project index (list/grid toggle) |
| `/work/[slug]` | Case study |
| `/about` | Bio, experience, capabilities, resume |
| `/lab` | Physics and shader experiments |
| `/contact` | Form, email copy, socials |

Global: header (logo mark, nav, Immersive/Classic toggle, sound toggle, local time), footer, terminal palette, page-transition overlay, cursor.

---

## 5. Target folder structure

```text
/app
  layout.tsx            # fonts, providers, persistent canvas, transition overlay
  page.tsx
  work/page.tsx
  work/[slug]/page.tsx
  about/page.tsx
  lab/page.tsx
  contact/page.tsx
  api/contact/route.ts
  sitemap.ts  robots.ts  opengraph-image.tsx
/components
  /ui        Cursor, MagneticButton, SplitText, Marquee, TransitionLink, Noise, GridOverlay
  /layout    Header, Footer, SkipLink, ModeToggle, SoundToggle, LocalTime
  /sections  Hero, Intro, WorkList, Capabilities, AboutTeaser, ContactCTA
  /canvas    ExperienceCanvas, scenes/(HeroScene, WorkScene, LabScene), objects/(Console, Shards, Dust),
             effects/(Effects, CrtPass), CameraRig, Quality
  /terminal  TerminalPalette, commands.ts
/content     site.ts, projects.ts
/hooks       useReducedMotion, useIsTouch, useMediaQuery, useQuality, useLenis
/lib         gsap.ts, math.ts, store.ts, audio.ts, env.ts, seo.ts
/public      /fonts /media /audio /models
AGENTS.md
```

---

## 6. Phase prompts

> Paste each prompt into its own Codex task. Replace `[BRACKETS]` first.

### Phase 0 — Scaffold

```text
PHASE 0: Scaffold the project.

1. Create a Next.js 14 App Router project with TypeScript (strict), Tailwind, ESLint, Prettier, using pnpm and the src-less /app layout.
2. Install: three, @react-three/fiber@8, @react-three/drei@9, @react-three/postprocessing@2, @react-three/rapier@1, gsap, lenis, zustand, howler, zod, clsx. Dev: @types/three, @types/howler, leva, @next/bundle-analyzer.
   Verify peer deps against React 18. If there is a conflict, report it, do not force.
3. Create the folder structure from AGENTS.md (empty files with a short header comment are fine).
4. Add scripts: dev, build, lint, typecheck (tsc --noEmit), analyze.
5. Add a minimal README with run instructions.
6. Create content/site.ts with typed placeholders: name "[YOUR NAME]", role "[YOUR ROLE]", email "[YOUR EMAIL]", city/time zone, socials, bootLines (string[]), and nav items.

ACCEPTANCE
- pnpm dev serves a blank dark page (#05060A) with no console errors.
- pnpm lint, typecheck and build all pass.
- Folder structure matches the plan.
```

### Phase 1 — Foundation: tokens, layout shell, smooth scroll, cursor

```text
PHASE 1: Design system and layout shell.

1. Implement the design tokens (colors, fluid type scale, spacing, easing as CSS variables) from the plan in globals.css and the Tailwind config. Load Bricolage Grotesque, Inter Tight and JetBrains Mono with next/font/google (display: swap, subsetted).
2. Build a Lenis provider synced to the GSAP ticker (gsap.ticker.add, lagSmoothing(0)). Expose scroll via a useLenis hook. Disable Lenis entirely in Classic mode and when prefers-reduced-motion is set.
3. Build lib/store.ts (zustand): mode ('immersive' | 'classic'), soundOn, scene, isLoaded, cursorState, terminalOpen. Persist mode and soundOn in localStorage.
4. Build these components:
   - Cursor: dot + lagging ring using gsap.quickTo, states default/link/view/drag/hidden driven by data-cursor attributes on elements. Hidden on touch devices.
   - MagneticButton: element follows the pointer within a radius with elastic return; inner label moves slightly more than the outer shell. Keyboard focus must be unaffected.
   - SplitText utility: splits into lines/words (aria-label preserved on the parent), with a masked reveal helper.
   - Noise overlay (CSS/SVG film grain, pointer-events none) and GridOverlay (toggle with G key, dev only).
   - Header: logo mark, nav, ModeToggle, SoundToggle (UI only for now), LocalTime (live clock in the user's configured time zone, mono font).
   - Footer placeholder, SkipLink.
5. Root layout wires providers and landmarks (header, main, footer).

ACCEPTANCE
- Smooth scroll works at 60fps, no layout shift, no hydration warnings.
- Cursor and magnetic buttons work on desktop, are inert on touch.
- Tab order is logical, focus rings are visible (use --ion).
- Classic mode removes Lenis and the custom cursor.
```

### Phase 2 — Preloader and intro

```text
PHASE 2: Preloader.

1. Build a full-screen Preloader: mono percentage counter (000 to 100), a thin ion-colored line that draws across, the site name revealing with a short glitch (RGB-split flicker, 300ms max), then a vertical wipe reveals the page.
2. Drive progress from a real source: fonts ready + drei's useProgress (once the canvas exists). Until Phase 3, simulate with fonts + a minimum 1.2s duration.
3. Play once per session (sessionStorage). On repeat visits skip straight to a 300ms fade.
4. Set isLoaded in the store when finished so the hero can start its entrance.
5. Respect reduced-motion: replace glitch and wipe with a simple fade.
6. Lock scroll during the preloader and release afterwards (lenis.stop/start).

ACCEPTANCE
- No flash of unstyled content, no layout shift when the preloader exits.
- Counter never reaches 100 before assets are actually ready.
- Preloader is skippable with Escape or a visible "Skip" button after 2s.
```

### Phase 3 — Persistent canvas and hero scene

```text
PHASE 3: Persistent 3D canvas and the hero scene.

1. ExperienceCanvas: fixed, full-viewport, behind the DOM, loaded via next/dynamic ssr:false after first paint. Use eventSource on document.body so pointer events work through the DOM. DPR clamp [1, 1.75] (mobile 1.25). Wrap with drei PerformanceMonitor + AdaptiveDpr. Canvas is aria-hidden.
2. Lighting without external HDR files: drei Environment with Lightformers for cool ion/volt rim lights on a near-black ambient. Add fog matching --void.
3. HeroScene objects (all procedural, no downloaded models):
   - Console: a slim rounded slab (RoundedBox) with a bezel and an emissive screen plane. Screen shows a subtle animated scanline/gradient shader. Gentle float and slow idle rotation.
   - Shards: 12 to 20 glossy primitives (icosahedron, torus, capsule) using MeshPhysicalMaterial with clearcoat, drifting with @react-three/rapier (zero gravity). They softly repel from the pointer's world position and settle back.
   - Dust: instanced Points with a custom shader (size attenuation, slow noise drift, twinkle).
   - Cursor light: a point light following the pointer on a plane in front of the console.
   - Camera rig: pointer parallax with damped lerp (max ~3 degrees).
4. Effects: Bloom (mipmapBlur, luminanceThreshold tuned so only the screen/accents bloom), subtle Vignette, Noise, very light ChromaticAberration. Expose a quality tier (high / medium / low) from useQuality that scales particle count, shard count, effects and DPR.
5. Hero DOM overlay (server-rendered text): giant "[YOUR NAME]" display headline with SplitText reveal on isLoaded, role line in mono, scroll cue, and two MagneticButtons: "Enter the console" and "Skip to classic site" (sets mode to classic).
6. Scene key in the store: 'hero' for now; structure so WorkScene/LabScene can be added later.

ACCEPTANCE
- Holds 60fps on a mid-range laptop at high tier; auto-downgrades when frame time degrades.
- Pointer interaction feels tactile; nothing jitters when the mouse leaves the window.
- Headline and buttons are real HTML and readable with the canvas disabled.
- Navigating away and back does not leak GPU memory (check renderer.info in dev).
```

### Phase 4 — Enter the console (camera dolly, CRT handoff, boot sequence)

```text
PHASE 4: The "travel into the screen" sequence (the signature moment).

1. Pin the hero section with ScrollTrigger (scrub 0.8). Bind a GSAP timeline to scroll that moves the camera along a smooth path (CatmullRom or manual keyframes via a ref'd proxy object) from the hero view to a position where the console screen fills the viewport. Use CameraRig to read the proxy each frame.
2. As the camera approaches: ramp screen emissive intensity, fade shards and dust out, increase bloom, and ramp a custom CrtPass (scanlines, slight barrel distortion, RGB split, flicker) via a uniform driven by timeline progress. Write CrtPass as a postprocessing Effect.
3. At ~85% progress: typed boot sequence rendered in DOM over the screen using content/site.ts bootLines (mono, caret blink, each line ends with [OK]). Typing is skippable and aria-live="polite".
4. Handoff: crossfade from the "screen" to the 2D editorial layout (fixed overlay fades into normal flow), release the pin, and keep the canvas as an ambient background with reduced intensity (dust + faint console glow).
5. The "Enter the console" button plays the same timeline automatically (2.4s) using lenis.scrollTo / timeline.tweenTo, so click and scroll are equivalent.
6. The sequence is fully reversible: scrolling back up returns the camera to the hero with no visual glitch.
7. Classic mode and reduced-motion: skip the whole sequence and show the editorial layout directly.

ACCEPTANCE
- No pop or jump at the 3D/DOM handoff, at any scroll speed, in both directions.
- Boot text never blocks interaction.
- The effect stays smooth at the medium tier; low tier uses a simplified fade instead of the CRT pass.
```

### Phase 5 — Editorial home sections

```text
PHASE 5: Editorial home page sections (Snellenberg-style polish, dark futuristic look).

Build these as server components where possible, with small client islands for animation:
1. Intro statement: a large paragraph from content/site.ts where each word moves from 15% to 100% opacity as it scrolls through the viewport (ScrollTrigger scrub, per word).
2. Selected Work list (from content/projects.ts): each row shows index (01), title, tags, year. On hover: a floating preview (gradient/placeholder media) follows the cursor with lerped motion and a clip-path reveal; the cursor morphs to the "VIEW" state; sibling rows dim to 30%. On touch: tap goes straight to the project. Whole row is an accessible link.
3. Capabilities marquee: two opposing rows of large type; speed and skew react to scroll velocity.
4. About teaser: two columns, short bio + a small ambient 3D or CSS element; link to /about.
5. Section headers use mono labels ("(02) Selected Work") and hairline dividers.
6. All headings use masked line reveals triggered on enter viewport, once.

ACCEPTANCE
- No layout shift when previews appear. Hover feels instant (under 100ms to first movement).
- Row links work with keyboard focus (focus shows the same preview state as hover).
- Everything is readable and usable in Classic mode with simple fade-ins.
```

### Phase 6 — Work index and case study pages

```text
PHASE 6: Work pages.

1. /work: all projects with a List/Grid toggle (animated layout change with GSAP Flip). Filter chips by tag, keyboard accessible.
2. /work/[slug]: generateStaticParams from content/projects.ts. Layout: full-bleed hero media, meta row (Role / Year / Stack / Link) in mono, an overview, then repeatable content blocks (text, full-width media, two-up media, quote placeholder), and a results row.
3. "Next project" footer: giant title link that fills with ion/volt gradient on hover and navigates through TransitionLink (Phase 8 will connect the real transition; for now use a plain link).
4. Media: next/image with sizes, blur placeholders, lazy loading. Use generated placeholder gradients/noise for now, clearly marked in code.
5. Per-project metadata (title, description, OG) via generateMetadata.
6. Add a WorkScene to the canvas: a calmer variant (dust + slow-moving accent light that takes on the project's accent color).

ACCEPTANCE
- Static generation works for every slug (pnpm build lists them).
- Scene swap between hero and work is smooth (no canvas remount).
- Lighthouse accessibility >= 95 on a case-study page.
```

### Phase 7 — About, Lab, Contact

```text
PHASE 7: About, Lab and Contact.

ABOUT
- Bio, an experience timeline (hairline rows, hover highlight), capabilities grouped by discipline, a "Currently" block, and a Resume download button (placeholder file in /public).

LAB (the Lusion-style playground)
- Rapier physics sandbox: a box room with soft glossy shapes the visitor can drag (cursor 'drag' state), throw and click-to-spawn (cap ~40 bodies, oldest removed). Gravity toggle (zero-g / earth) and a "Reset" button, all keyboard reachable.
- Below it: 3 small experiment cards (e.g. noise-displaced sphere, particle text, scan-line image) each as a lightweight isolated shader canvas that only renders while in view.
- Mobile: reduce body count, disable spawn spam, keep drag.

CONTACT
- Giant email in display type; click copies to clipboard with a "Copied" confirmation (aria-live).
- Form: name, email, message with zod validation (client and server), honeypot field, simple in-memory rate limit, accessible error messages.
- app/api/contact/route.ts sends via Resend if RESEND_API_KEY exists, otherwise logs server-side and returns success in dev. Document env vars in .env.example.
- Success and error states, button with loading state. Socials as magnetic links.

ACCEPTANCE
- Lab holds 60fps desktop at max bodies; pauses rendering when scrolled off-screen or tab hidden.
- Form works without JS enhancements failing (validation errors still shown), no spam through the honeypot.
```

### Phase 8 — Page transitions, terminal palette, sound

```text
PHASE 8: Page transitions, terminal and audio.

PAGE TRANSITIONS
1. Build TransitionLink and a TransitionOverlay. On click: block default navigation, play a 3-panel wipe (0.9s) that shows the destination name in mono, call router.push midway, wait for the new page to be ready, then wipe out. Lenis scrolls to top while covered.
2. Switch the canvas scene key during the cover so the 3D change is hidden.
3. Replace all internal links with TransitionLink. Handle back/forward buttons gracefully (quick fade is fine). Respect reduced-motion (simple crossfade).

TERMINAL PALETTE
4. Open with Cmd/Ctrl+K or the backtick key; also from a small "Terminal" button in the header. Overlay styled as a CRT window (mono, caret, subtle scanlines).
5. Commands: help, work, about, lab, contact, projects <slug>, theme (cycle ion / volt accent), sound on|off, mode immersive|classic, email (copy), clear, exit. Tab autocompletes, Up/Down shows history, Esc closes.
6. Accessibility: focus trap, role="dialog", aria-modal, output in an aria-live region, focus returns to the trigger on close.

AUDIO
7. lib/audio.ts with Howler: low ambient hum loop, soft UI ticks on hover/click, a rising tone during the enter sequence. OFF by default; only starts after the user toggles Sound on (browser autoplay policy). Master volume around 0.3. Fade on toggle. Persist preference.

ACCEPTANCE
- No scroll jump or flash during transitions; no double navigation on rapid clicks.
- Terminal is fully keyboard operable and screen-reader announced.
- Audio never plays unless the user opted in.
```

### Phase 9 — Performance, fallbacks, accessibility hardening

```text
PHASE 9: Performance, fallbacks and accessibility.

PERFORMANCE
1. Quality tiers: wire useQuality to GPU detection (detect-gpu or a frame-time benchmark), device memory, hardwareConcurrency, touch and Save-Data. Define high / medium / low presets (particle count, shard count, effects on/off, DPR cap, shadow off).
2. Canvas: frameloop="demand" when the scene is static or off-screen; pause when document.hidden; dispose materials/geometries/textures on unmount.
3. Assets: Draco/meshopt for any GLB, KTX2 for textures, next/image for all images, preload only critical fonts, font subsetting.
4. Run the bundle analyzer; keep the initial JS small and the three/R3F chunk lazy (only after first paint).
5. Add a lightweight FPS/quality debug panel (leva) behind ?debug.

FALLBACKS
6. Classic mode complete: static CSS gradient + noise hero, no WebGL, no Lenis, no custom cursor, simple IntersectionObserver fades. Auto-selected on WebGL failure, reduced-motion or Save-Data; also user-toggleable.
7. WebGL context loss handled (show fallback, offer reload).

ACCESSIBILITY
8. Audit: landmarks, heading order, focus order, focus-visible, contrast (AA), form labels, alt text, link names, skip link, aria-live regions, reduced-motion, keyboard path through every interaction (including Lab and Terminal).

TARGETS
- Lighthouse (mobile, Classic mode): Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- Immersive desktop: 60fps on mid-range hardware; mobile >= 30fps at the low tier.
- LCP < 2.5s, CLS < 0.05, INP < 200ms.
```

### Phase 10 — SEO, polish and deploy

```text
PHASE 10: SEO, final polish and deploy.

1. Metadata API on every route (title template, description, canonical), dynamic OG image with next/og, Twitter cards.
2. JSON-LD Person schema from content/site.ts. app/sitemap.ts and app/robots.ts.
3. Favicons and web manifest generated from a simple logo mark (SVG).
4. Custom 404 page in the console style (boot error text, link home).
5. Optional privacy-friendly analytics (Vercel Analytics or Plausible) behind an env flag.
6. Finish the README: setup, env vars, how to add a project, how to change theme tokens, how modes work, performance notes.
7. Deployment checklist for Vercel (env vars, domain, preview deploys).
8. Cross-browser pass notes for Chrome, Safari (iOS too), Firefox. Fix Safari-specific WebGL/backdrop/video issues.

ACCEPTANCE
- pnpm build passes with no warnings of substance; all routes are statically generated where applicable.
- Share previews render correctly; sitemap lists every route and project.
```

---

## 7. Performance budgets (reference)

| Item | Budget |
|---|---|
| Initial JS (before canvas) | < 200 KB gzipped |
| 3D chunk | lazy, after first paint |
| 3D models (GLB, compressed) | < 1.5 MB total (hero scene is procedural, so likely 0) |
| Textures | KTX2/Basis where possible |
| DPR | clamp 1 to 1.75 desktop, max 1.25 mobile |
| Frame rate | 60fps desktop mid-range, 30fps floor on mobile low tier |
| Fonts | 3 families max, subsetted, `font-display: swap` |

## 8. Accessibility and fallback matrix

| Condition | Behavior |
|---|---|
| No WebGL / context lost | Classic mode, reload offer |
| `prefers-reduced-motion` | Classic mode: no Lenis, no sequence, fades only |
| `Save-Data` / low GPU tier | Classic or low tier, no CRT pass |
| Touch device | No custom cursor, no magnetic effects, lighter physics |
| Keyboard-only | Full path through nav, work list, Lab, Terminal, form |
| Screen reader | Real HTML content, canvas `aria-hidden`, live regions for boot/terminal/form |
| Audio | Always opt-in, never autoplays |

## 9. Final QA checklist

- [ ] Preloader plays once per session and never reaches 100% early
- [ ] Hero holds frame rate; shards react to cursor; no jitter on mouse leave
- [ ] Enter sequence is smooth and reversible by scroll and by button
- [ ] No pop at the 3D to DOM handoff at any scroll speed
- [ ] Work list previews, cursor "VIEW" state and keyboard focus all work
- [ ] Page transitions are clean on fast clicks and on back/forward
- [ ] Terminal opens with Cmd/Ctrl+K, all commands work, Esc closes, focus returns
- [ ] Lab: drag, spawn cap, gravity toggle, reset, off-screen pause
- [ ] Contact form validates, honeypot works, success/error states shown
- [ ] Classic mode complete and the auto-fallbacks trigger correctly
- [ ] Lighthouse targets met; no console errors; no memory growth when navigating
- [ ] Safari, Firefox, Chrome desktop and a real iOS/Android device checked
- [ ] All placeholder content replaced (Section 10)

## 10. Content to prepare (placeholders)

| Item | Where it goes |
|---|---|
| Name, role, one-line positioning, email, socials, time zone | `content/site.ts` |
| Hero tagline (max ~10 words) and intro statement (40 to 70 words) | `content/site.ts` |
| Boot sequence lines (5 to 8) | `content/site.ts` `bootLines` |
| 4 to 6 projects: title, year, role, tags, summary, stack, links, accent color | `content/projects.ts` |
| Project media (covers, gallery, optional short loops) | `/public/media` |
| Bio, experience timeline, capabilities | About page content |
| Resume PDF | `/public/resume.pdf` |
| Optional: ambient audio loop + UI ticks (royalty-free or your own) | `/public/audio` |

## 11. Fix prompt template

```text
FIX: [one-line problem].

Context: [page/route, device/browser, what you expected vs what happens].
Scope: only touch [files/components]. Do not refactor unrelated code.
Constraints: keep AGENTS.md rules (refs not state per frame, gsap.context cleanup, dispose three objects, Classic mode parity).
Verify: pnpm lint && pnpm typecheck && pnpm build, then describe how to reproduce the fix manually.
```

## 12. Stretch ideas (after launch)

- Scene-aware cursor trail with a short fluid distortion on the canvas
- Per-project 3D teaser objects in the Work scene
- Day/night accent shift based on the visitor's local time
- Gyroscope parallax on mobile (opt-in)
- Blog/notes section rendered in the console style with MDX
