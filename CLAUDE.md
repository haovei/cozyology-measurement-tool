# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (`--host`, exposed on LAN). Renders directly from `index.html` + `src/main.tsx`.
- `npm run build` — `tsc` (type check, no emit) then `vite build`. The real pre-commit gate.
- `npm run type-check` — `tsc --noEmit` only.
- `npm run preview` — serve the built `dist/`.
- `npm run format` / `format:check` — Prettier over `src/**/*.{ts,tsx,css,json}` (config in `.prettierrc.json`: no semicolons, single quotes, `printWidth: 120`, 2-space indent, `arrowParens: avoid`).
- `npm run lint` — declared, but **there is no ESLint config in the repo**, so this currently fails. Use `type-check` + `build` as the verification gate instead. (`needs confirmation` whether an ESLint config is intended to be added.)

There is **no test framework** configured (no Vitest/Jest/Playwright). Don't assume `npm test` exists.

## What this is

A Cozyology window-covering measurement wizard, shipped as a **Web Component** (`<cozyology-measurement-tool>`) that mounts a React 19 + Tailwind v4 app inside a Shadow DOM. The host page (e.g. Shopify) drops in the custom element and the tool walks the customer through a multi-step measuring flow, then computes the order size.

There are **two independent product flows**, selected by the element's `type` attribute (`src/index.ts`):
- **`MeasurementTool.tsx`** (default / `type` absent or `"measurement"`) — roller/Roman **shades**. 4 main steps: mount style → width → height → result.
- **`MeasurementDrapery.tsx`** (`type="drapery"`) — **drapery/curtains**. 4 main steps: header style → width → height → panels. Far more complex (4 header styles × rod/track × installed/not × ceiling/wall × visible/covered branches).

## Architecture you must understand before editing

### Config is injected via globals, read at module load
Both components do `const CozyologyConfig = window.CozyologyConfig` / `window.CozyologyConfig_Drapery` **at the top of the module**, not inside the component. Consequences:
- The global config object **must be defined before the bundle executes** (see the `<script>` in `index.html`, and `README.md` for the integration contract). The Web Component passes **no props** — `getProps()` in `src/index.ts` returns `{}` and there is no attribute→prop mapping besides `type`.
- `index.html` holds the canonical, full config for local dev: `window.CozyologyConfig` (shades) and `window.CozyologyConfig_Drapery` (drapery). This is the best reference for the entire step graph and copy.
- Config shape is declared in `src/types/global.d.ts` (`measurementConfig` is typed `any`).

### Each flow is a config-driven step state machine
A "step" is a config entry keyed by string ID (`step-1`, `step-2-1-1`, `step-3-2-10`, …). Steps have `type: 'select' | 'input' | 'finished'`. Navigation is **data-driven**: each `select` option / `input` step carries a `jump` field naming the next step ID — that's the edge set of the flow graph. Core state in each component:
- `currentStep`, `stepHistory` (for Previous + sidebar nav), `completedSteps`
- `inputValues` (persisted per option `id`), `currentStepInputs` (the live step), `inputErrors`
- `selectedOptions` (per-step chosen option `id`)

"Main step" (the sidebar dots) is derived from the step-ID prefix (`step-2*` → main step 2, etc.) in `getCurrentMainStep` / `getMainStepFromActualStep`. Re-selecting `step-1` resets all accumulated state.

### The calculation engine is tightly coupled to literal option IDs
`calculateRecommendedSize` and its helpers read `inputValues['<exact-option-id>']` and branch on `selectedOptions['<exact-step-id>'] === '<exact-option-id>'`. **Renaming or restructuring a step/option ID in the config will silently break the math** unless every reference in the component is updated. Key calc paths in drapery: `calculatePleatedSize`, `calculateRippleFoldSizeNew`, and the soft-top/grommets default branch (note the `extraNumberMap` rod-diameter additions). `calculateByCurtainStyle` applies the floor-length style (±1"/0").

### Number formatting differs between the two flows
- Shades (`MeasurementTool`): `convertToFraction` rounds to the nearest **1/8 inch** and renders as a mixed number string.
- Drapery (`MeasurementDrapery`): `convertToDecimal` applies **custom rounding to the nearest 0.5"**, then `decimalToMixedNumber` renders `.5` as ` 1/2`.
- `src/utils/index.ts` holds the fraction/mixed-number parsing & arithmetic (`mixNumberOrFractionHandle`, `parseMixedNumberAndSum`, BigInt `fractionOperation`). Fraction *input* is only accepted on options flagged `isTrackSelector` / `isSingleSelector` (the `TrackSelector` / `TrackSelectorSingle` hardware pickers).

### Path alias `@/` is type-only
`tsconfig.json` maps `@/* → src/*`, but **Vite has no matching alias** (`vite.config.ts`). Every existing `@/...` import is a type-only import (interfaces from `global.d.ts`), which `tsc` erases. Runtime/value imports use relative paths (`../utils`). **Do not import runtime values via `@/`** — it will type-check but fail at build/runtime.

### Styling
Tailwind v4 via `@tailwindcss/vite`, imported in `src/index.css`. Step/option artwork is **CSS background-image classes**, not `<img>`: the config gives an `imageClass` (e.g. `image-drapery-03-7`) defined in `src/styles/images.css`, which points at a `src/assets/*.webp`. Adding a step image = add the asset + a `.image-*` rule + reference it from config. Custom font `American_bt` is `@font-face`'d in `index.css`. The codebase uses a `not-md:` variant convention for mobile-first overrides. Rich copy fields (`description`, `additionalInfo`, contact blocks) are rendered with `dangerouslySetInnerHTML` and contain trusted HTML from config.

### Build output note
`vite.config.ts` defines **no `build.lib`** — `vite build` bundles the app (entry `index.html`) and emits `assets/cmt-[name].js` / `cmt-[name].css`. The host page loads styles into the Shadow DOM via the element's `data-style-url` attribute (see the commented demo in `index.html`, e.g. `./assets/cmt-index.css`). Note the `main`/`module`/`types` paths in `package.json` (`dist/cozyology-measurement-tool.*`) do **not** match this output — treat the `assets/cmt-*` files as the real artifacts (`needs confirmation` on the intended publish setup).

## Conventions

- Commit messages: `type: 中文摘要`, where type is one of `feat` / `pref` / `style` / `fix` (matches existing history). Work happens on `develop`; PRs target `main`.
- React component files: PascalCase. Utilities/modules: camelCase. New assets go in `src/assets/` keeping the business prefix (`drapery-03-*.webp`, etc.).
- TypeScript is in loose mode (`strict: false`, `noImplicitAny: false`); much of the calc code is intentionally `any`. Match the surrounding style rather than tightening types ad hoc.
