# Frontend — Simplified Video Editor

React + Vite app for the recruitment task: timeline editor, projects (REST), and notes (GraphQL).

## Stack

- **React** 19 (JavaScript, no TypeScript)
- **Vite** 7
- **TailwindCSS** v3, **shadcn/ui** (button + `cn`), **lucide-react**
- **Zustand** — `projectsStore`, `timelineStore`, `notesStore`, `historyStore`
- **Ramda** — data transforms in stores/services

## Run locally

```bash
# Install
cd frontend
yarn

# Dev (proxies /api and /graphql to mock API)
yarn dev
```

Start the **mock API** first (sibling `mock-api/`):

```bash
cd mock-api && npm install && npm start
```

Dev server proxies `/api` and `/graphql` to `http://localhost:3000`.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn dev`     | Start Vite dev server    |
| `yarn build`   | Production build         |
| `yarn preview` | Preview production build |
| `yarn lint`    | Run ESLint               |

## Project structure

```
src/
  components/     # UI
    layout/       # Header, Sidebar, AppLayout
    preview/      # PreviewArea, PlaybackControls
    timeline/     # Timeline, TimeRuler, Track, Clip
    ui/           # shadcn button, etc.
  stores/         # Zustand: projects, timeline, notes, history
  services/       # projectsService (REST), notesService (GraphQL)
  config/         # API base URL, endpoints
  lib/            # cn, etc.
  utils/          # time, timelineScale, timelineLayout
```

## Config

- **API base**: `config/api.js` — `VITE_API_URL` overrides base URL; in dev, empty base uses Vite proxy.
- **Paths**: `@/` → `src/` via `vite.config` + `jsconfig.json`.
