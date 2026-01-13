# CLAUDE.md

## Project

**Name:** HCP
**Type:** Mobile-first web app
**Client:** Personal / potential product

## Context

**Why does this exist?**
Existing handicap trackers are ugly, slow, and have poor UX. Golfers who care about design have no good option.

**Who is it for?**
Golfers who prioritize beautiful products. They notice bad design. They want their tools to feel as considered as the rest of their life.

**What's wrong with existing solutions?**
- Visual design is an afterthought
- Bloated, slow performance
- Cluttered UX, too many features surfaced at once
- Feel like utility software, not something you want to open

## Stack

```
Astro 5.x
├── Tailwind CSS 4
├── Radix UI (primitives as needed)
├── TypeScript
└── Custom components
```

**Why this stack:**
- Astro: Performance, zero JS by default
- Tailwind: Rapid styling, utility-first
- Radix: A11y primitives without design opinions
- No Shadcn: Build components from our design decisions

## Design Direction

**Reference:**
Standard Equipment mobile nav (uploaded image)

**Principles extracted from reference:**
- Single dominant color owns the screen
- Lines as structure (horizontal rules, not boxes/cards)
- Heavy uppercase type, tight tracking
- Data as typography (numbers inline with labels)
- Nothing decorative—type and lines only
- High contrast (white on color)

**Color palette:**
- Primary: #009a44 (golf green)
- Text: #ffffff
- Border: #ffffff

**Typography:**
- Family: Inter
- Weights: 700 (possibly 400 for secondary)
- Scale: TBD after more screens

## Screens

Build in this order:

1. [x] Nav — Mobile navigation overlay
2. [ ] Dashboard — Handicap, recent rounds, quick stats
3. [ ] Round entry — Log a new round
4. [ ] Scorecard — View a completed round
5. [ ] Stats — Trends over time

After 3-4 screens: extract component library.

## Current State

**Working on:** Dashboard (next)
**Blocked by:** Nothing
**Last decision:** Nav complete, established line-based structure and color
