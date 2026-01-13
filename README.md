# Fatside

Golf handicap tracker. PWA.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output in `/dist`. Deploy anywhere static.

## Structure

```
fatside-app/
├── public/
│   ├── manifest.json    # PWA config
│   ├── sw.js            # Service worker (offline)
│   ├── icon-192.png     # App icon (needs creating)
│   └── icon-512.png     # App icon (needs creating)
├── src/
│   ├── index.html       # Shell
│   ├── style.css        # All styles
│   └── app.js           # All logic
├── package.json
└── vite.config.js
```

## TODO

- [ ] Create app icons (192x192, 512x512)
- [ ] Test on mobile
- [ ] Deploy

## Data

Stored in localStorage:
- `handicap` — current index
- `rounds` — array of rounds
- `courses` — saved courses (derived from rounds)

## Handicap calculation

Simplified WHS:
- Uses best differentials based on round count
- Differential = (Score - Rating) × 113 / Slope
