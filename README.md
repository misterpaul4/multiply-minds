# 🧠 Multiply Minds — Math Arcade

A fast, fun, mobile-first mental-math game. Think **Duolingo meets a math arcade**:
satisfying feedback, combo streaks, animated score reveals, and a challenge-a-friend
mechanic — simple enough for a 7-year-old, brutal enough for an adult on Legend mode.

▶️ **Play:** https://misterpaul4.github.io/multiply-minds/

## Features

- **Four operations** — addition, subtraction, multiplication, division (always whole-number answers).
- **5 difficulty tiers** — Rookie → Easy → Medium → Hard → Legend, each with its own number ranges and clock.
- **Arcade game feel** — per-question countdown ring, combo multiplier (up to ×5), speed bonuses,
  screen-shake on misses, particle bursts and animated count-ups on hits.
- **Mobile-first** — a big custom numeric keypad (no tiny inputs, no OS keyboard), thumb-zone layout,
  perfect at 375px.
- **Social / collaborative**
  - **Challenge a friend** — share a link that encodes the exact same questions (seeded RNG); your
    friend plays the identical round and the result screen shows who won. No backend required — the
    whole challenge lives in the URL.
  - **Share score** via the native share sheet (falls back to clipboard).
  - **Local leaderboard** + personal best, persisted in `localStorage`.

## Tech

- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Hand-rolled confetti, count-up, and rAF countdown — no heavy dependencies
- Deterministic question generation via a seeded RNG (`xmur3` + `mulberry32`)

## Develop

```bash
yarn install
yarn dev        # local dev server (served at /)
yarn build      # type-check + production build (base path /multiply-minds/)
yarn preview    # preview the production build
yarn deploy     # publish dist/ to GitHub Pages
```

## Project layout

```
src/
  game/        engine (RNG, questions, scoring), types, storage, share links, theme
  hooks/       useCountdown (rAF), useCountUp
  components/  Home · Setup · Play · Results · Keypad · TimerRing · Confetti
  App.tsx      screen state machine + challenge-link handling
```
