# Horse Racing Game

An interactive horse racing simulation built with Vue 3 and TypeScript.

## 🎯 Overview

The app demonstrates a feature-oriented Vue architecture, deterministic data generation for horses and races, canvas-driven race rendering, and a clean UI layer with reusable components. It includes unit tests (Vitest) and E2E tests (Cypress) with coverage output.

## 🚀 Tech Stack

- **Vue 3** (Composition API)
- **TypeScript**
- **Vuex 4** for state management
- **Vue Router 4** for routing
- **Vite 7** for dev/build tooling
- **SCSS** for styling
- **Vitest** + **@vue/test-utils** for unit testing
- **Cypress 13** for E2E testing

## 📦 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`.

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:

   ```bash
   npm run preview
   ```

## 🧪 Quality & Testing

- Run unit tests and coverage:

  ```bash
  npm run test
  ```

  Coverage artifacts are emitted under `coverage/`.

- Open Cypress (E2E):

  ```bash
  npm run cy:open
  ```

- Headless Cypress run:

  ```bash
  npm run cy:run
  ```

## 🧭 Scripts

| Script  | Description                     |
| ------- | ------------------------------- |
| dev     | Start Vite dev server           |
| build   | Type-check and build production |
| preview | Preview production build        |
| lint    | Run ESLint on project           |
| test    | Run Vitest with coverage        |
| cy:open | Open Cypress test runner        |
| cy:run  | Run Cypress e2e tests headless  |

## 🏗️ Project Structure (High-level)

```
src/
├── app/
│   ├── router/                 # Routes and router setup
│   └── store/                  # Vuex store (modules, actions, getters)
├── features/
│   ├── landing/                # Landing page
│   ├── race/                   # Race UI, canvas renderer, engine, utils
│   ├── race-management/        # Scheduling, results, management UI
│   └── settings/               # Settings UI (audio, fullscreen)
├── generators/                 # Data generators (e.g., horses)
├── shared/                     # Reusable UI, composables, styles, types
└── test/                       # Test setup
```

## 📋 Current Capabilities (Phase 1)

- Landing screen with play CTA
- Settings panel (music, SFX, fullscreen)
- Random horse generation (unique names, colors)
- Horse list with condition scores
- Race page with canvas-based HUD and rendering scaffolding
- Race management UI for scheduling and results modals
- Surface-based performance: each horse has per-surface affinity that affects speed
- Route-level code splitting with dynamic imports (lazy-loaded pages)
- Horse visuals: temporary SVG icon used for horses (to be replaced with sprites in Phase 2)

## 🧭 Known Issues

- Window resize bug: canvas/layout does not reflow correctly on `resize` and needs a proper responsive recalculation.

## 🗺️ Phase 2 Roadmap

- Fix resize behavior on window `resize` (responsive canvas/layout recalculation)
- Canvas scene to use tiles and sprite-based rendering for track and horses
- Replace horse SVG with pixel-art sprite sheets and running animations
- Horse attributes panel: expose horse properties and stats in UI
- Mobile view improvements (responsive layout, touch targets, typography)
- Performance polish: offscreen canvas where applicable, sprite sheet optimization
- Race results enhancements and persistence hooks (optional local storage)
- Progressive chunking improvements (split vendor/chunks further if needed)

## 🎨 Design & Engineering Notes

- Feature-based modularity for scalability and isolation
- Clear separation of concerns between rendering (canvas), state (Vuex), and UI (Vue components)
- Strong typing across modules and utilities
- Linting (ESLint) and formatting (Prettier) configured
- Horses include `surfaceAffinity` per track surface; this feeds both the race engine tick and the pre-race speed model.
- Pages are lazy-loaded via dynamic `import()` which enables per-route code splitting (smaller initial bundle, faster TTI).

## 📐 Game Rules (Reference)

- 20 horses, each with unique color and name
- Condition score per horse (1–100)
- 6 rounds at distances 1200m, 1400m, 1600m, 1800m, 2000m, 2200m
- 10 random participants per round; track types: Dirt, Turf, Hybrid

---
