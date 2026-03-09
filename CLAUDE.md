# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check (tsc -b) then build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Environment Variables

The contact form uses EmailJS. A `.env` file is required with:
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## Architecture

Single-page portfolio built with React 19 + TypeScript + Vite. All styling uses **styled-components** — no CSS modules or Tailwind.

**App structure:**
- `src/App.tsx` — Root component. Manages `cursorVal` state (passed to `Cursor` for size changes on hover) and composes all sections in order: `Cursor → Navbar → Hero → About → Skills → Contact`
- `src/GlobalStyles.ts` — CSS custom properties (design tokens) defined here via `createGlobalStyle`. All color/font variables (`--bg`, `--text-main`, `--neon-cyan`, etc.) are set here.
- `src/components/Layout.tsx` — `Outer` and `Page` styled wrappers providing max-width (1400px) and responsive padding.
- `src/utils/Atoms.tsx` — Shared styled primitives: `Section` (base section layout) and `SectionTitle` (mono uppercase label). Import these for new sections.
- `src/utils/helper.ts` — Single utility: `asRem(px)` converts px numbers to rem strings.

**Components:**
- `Cursor` — Custom cursor (dot + aura) hidden on ≤1024px. Accepts `cursorVal` prop to control dot size.
- `Navbar` — Fixed floating pill nav with smooth-scroll links to `#about`, `#skills`, `#contact`.
- `Hero` — Full-viewport section with animated gradient blob. Triggers cursor size change on hover via `setCursorVal`.
- `Skills` — Grid of `SkillCard` components (3-col → 2-col → 1-col responsive). Data is hardcoded inline.
- `ContactMe` — Contact form using `@emailjs/browser` with client-side validation. Reads EmailJS config from `import.meta.env`.

**Styling conventions:**
- All styled-components are defined at the top of each file before the component function.
- Responsive breakpoints: 1024px, 768px, 480px.
- The React Compiler babel plugin (`babel-plugin-react-compiler`) is enabled in `vite.config.ts`.
