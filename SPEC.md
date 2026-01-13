# Fatside - Project Specification

## Overview
Golf handicap tracking PWA with a focus on beautiful, minimal design.

## Stack
- Vanilla JavaScript (no framework)
- Vite for bundling
- CSS (no preprocessor)
- localStorage for data persistence
- GitHub Pages for hosting

## Data Storage

Data is stored in `localStorage` under the key `fatside`.

### Current Schema
```javascript
{
  handicap: number | null,        // Current handicap index
  previousHandicap: number | null, // For trend calculation
  rounds: [
    {
      id: string,           // Unique ID (timestamp-based)
      course: string,       // Course name
      rating: number,       // Course rating (e.g., 72.3)
      slope: number,        // Slope rating (e.g., 131)
      par: number,          // Course par
      score: number,        // Player's score
      differential: number, // Calculated: (score - rating) * 113 / slope
      date: string          // ISO date string
    }
  ],
  courses: [
    {
      name: string,
      rating: number,
      slope: number,
      par: number
    }
  ],
  hasCompletedOnboarding: boolean
}
```

### Migration Notes
**Important:** If you change the data schema, you must write migration code to handle existing user data. The app should detect old schema versions and upgrade them automatically.

Example migration pattern:
```javascript
function migrateData(data) {
  // Check for old schema and upgrade
  if (!data.version) {
    // v1 -> v2 migration
    data.version = 2
    // ... transform data
  }
  return data
}
```

## Handicap Calculation (WHS)

Uses the World Handicap System formula:
1. Calculate differential for each round: `(score - rating) * 113 / slope`
2. Take the most recent 20 rounds
3. Use the best N differentials based on count:
   - 3 rounds: best 1
   - 4 rounds: best 1
   - 5 rounds: best 1
   - 6 rounds: best 2
   - 7-8 rounds: best 2
   - 9-11 rounds: best 3
   - 12-14 rounds: best 4
   - 15-16 rounds: best 5
   - 17-18 rounds: best 6
   - 19 rounds: best 7
   - 20 rounds: best 8
4. Average the best differentials
5. Multiply by 0.96 (96%)
6. Round to 1 decimal place

## Screens

1. **Splash** - App logo, auto-advances after 1.5s
2. **Onboarding** - Ask for existing handicap (can skip)
3. **Home** - Shows handicap, trend, recent rounds, add round form
4. **Settings** - Export data (JSON), delete all data

## PWA Configuration

- Service worker: Network-first strategy (always fetches fresh, falls back to cache offline)
- Base path: `/fatside/` (for GitHub Pages)
- Icons: 192x192 and 512x512 PNG in `/public/`
