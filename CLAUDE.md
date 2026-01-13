# CLAUDE.md

## Project

**Name:** Fatside
**Type:** Golf handicap tracking PWA
**Live:** https://rikkizip.github.io/fatside/

## Stack

- Vanilla JavaScript (no framework)
- Vite for bundling
- Plain CSS
- localStorage for persistence
- GitHub Pages hosting

## Commands

```bash
npm run dev    # Start dev server at localhost:5173/fatside/
npm run build  # Build to /dist
```

Deployment is automatic via GitHub Actions on push to main.

## File Structure

```
src/
  index.html   # Entry point
  app.js       # All application logic
  style.css    # All styles
public/
  manifest.json
  sw.js
  icon-192.png
  icon-512.png
dist/           # Built output (deployed to GitHub Pages)
```

## Key Implementation Details

**Base path:** All URLs must use `/fatside/` prefix (GitHub Pages subdirectory).

**Data storage:** localStorage key `fatside`. See SPEC.md for schema. If you change the schema, write migration code.

**Handicap calculation:** WHS formula with 20-round limit and 96% multiplier. See SPEC.md for details.

**Service worker:** Network-first strategy. Bump `CACHE_NAME` version in `public/sw.js` when making changes.

## Design Principles

- Single dominant color (#009a44)
- Lines as structure, not boxes/cards
- Heavy uppercase type, tight tracking
- High contrast (white on green)
- Nothing decorative

## Current State

Core functionality complete:
- Splash screen
- Onboarding (ask for existing handicap)
- Home with handicap display, trend, rounds list
- Inline add round form with saved courses
- Settings with export/delete
