# Horse Racing Game

A modern, interactive horse racing game built with Vue 3, TypeScript, and Vuex.

## 🎯 Project Overview

This project is a front-end case study for an interactive horse racing simulation. The game features dynamic horse generation, race scheduling with multiple rounds, animated races, and comprehensive results tracking.

## 🚀 Technologies

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vuex 4** - State management
- **Vite** - Next-generation frontend tooling
- **SCSS** - Enhanced CSS with variables and mixins

## 📋 Features

### Phase 1 (Current)

- ✅ Landing screen with play functionality
- ✅ Settings panel (music, sound effects, fullscreen)
- ✅ Random horse generation (20 horses with unique names and colors)
- ✅ Horse list display with condition scores

### Phase 2 (Upcoming)

- 🔄 Race schedule generation (6 rounds)
- 🔄 Animated horse racing with Canvas background
- 🔄 Parallax scrolling backgrounds (3 track types: dirt, turf, hybrid)
- 🔄 SVG horse animations with running legs
- 🔄 Fatigue/condition system
- 🔄 Race results table

## 🏗️ Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── landing/          # Landing screen
│   ├── horses/           # Horse list and cards
│   └── settings/         # Settings panel
├── components/
│   ├── base/             # Reusable UI components
│   └── layout/           # Layout components
├── composables/          # Vue composables (Composition API)
├── store/                # Vuex store modules
├── generators/           # Data generators (horses, rounds)
├── constants/            # App constants
├── styles/               # Global SCSS styles
└── utils/                # Utility functions and types
```

## 📦 Installation

```bash
npm install
```

## 🎮 Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏁 Build

```bash
npm run build
```

## 📐 Game Rules

- **Total Horses**: 20 horses with unique colors and names
- **Condition Score**: Each horse has a condition score (1-100)
- **Race Schedule**: 6 rounds at different distances
  - Round 1: 1200m
  - Round 2: 1400m
  - Round 3: 1600m
  - Round 4: 1800m
  - Round 5: 2000m
  - Round 6: 2200m
- **Participants**: 10 random horses per round
- **Track Types**: Dirt, Turf, Hybrid (each affects horse performance)

## 🎨 Design Principles

- **SOLID Principles**: Clean, maintainable, and scalable code
- **Component-Based Architecture**: Reusable and isolated components
- **Feature-Based Organization**: Easy to navigate and extend
- **Type Safety**: Full TypeScript coverage

## 👨‍💻 Development Notes

This project demonstrates:

- Modern Vue 3 best practices with `<script setup>`
- Effective state management with Vuex
- Clean separation of concerns
- Scalable folder structure
- Professional code organization

---

Built with ❤️ for the Front-End Case Study
