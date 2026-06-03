## Context

The app currently serves a server-rendered HTML table showing today's stock movement for a fixed set of symbols. Users can't change the date, add stocks, or see charts. The stack is Node.js HTTP server with zero npm dependencies.

## Goals / Non-Goals

**Goals:**
- Client-side interactivity: date range picker, stock search, dynamic table updates without page reload
- Historical data: fetch and display daily OHLCV for any date range
- Charts: line chart (price/time) and bar chart (daily % change) using Chart.js CDN
- State persistence: selected symbols and date range survive refresh (URL + localStorage)
- Keep zero npm dependencies — use only Node.js built-ins and one CDN script

**Non-Goals:**
- Real-time data, websockets, or live streaming
- User accounts, authentication, or server-side persistence
- Framework libraries (React, Vue, etc.), build tools, or npm packages
- Server-side chart rendering (SVG/canvas on server)
- Mobile-first responsive design (desktop-friendly is sufficient)

## Decisions

### Client architecture: vanilla JS SPA with single state object

All client logic lives in `public/app.js`. A single `state` object drives the UI. A `setState(partial)` function merges changes, syncs to URL + localStorage, and re-renders. No virtual DOM, no framework — direct DOM updates on state change.

**Alternatives:**
- React/Vue → overkill for this scope, adds npm deps, contradicts project constraints
- HTMX → simpler but can't do charts or autocomplete without JS anyway
- Keep server-rendered → can't do autocomplete or interactive charts without JS

### Charts: Chart.js via CDN

Chart.js loaded from `cdn.jsdelivr.net/npm/chart.js` in `index.html`. Two `<canvas>` elements: one for line chart (price/time), one for bar chart (daily % change). Each symbol gets a dataset with a distinct color. Charts update reactively when state changes.

**Alternatives:**
- Custom Canvas renderer → more code to write/maintain, less polished
- Lightweight Charts (TradingView) → financial-specific but heavier, less familiar
- SVG → harder to do interactivity, less performant with many data points

### Server: static file serving + API routes

`GET /` serves `public/index.html`. `GET /public/app.js` serves the client JS (or we serve from root). API routes at `/api/stocks` and `/api/search`. Use `fs.createReadStream` for static files — no Express, no `serve-static`.

### State persistence: URL + localStorage (both synced)

On load: read URL params → fallback to localStorage → fallback to defaults (AAPL,MSFT,GOOGL,AMZN, last 7 days). On change: `history.replaceState` to update URL + `localStorage.setItem`. This makes the dashboard shareable and survives refresh.

### Stock search: debounced fetch to server proxy

Search input fires on `input` event with 300ms debounce. Fetches `GET /api/search?q=<term>` which proxies to Yahoo Finance `/v1/finance/search`. Results filtered to `quoteType: "EQUITY"` and `isYahooFinance: true`. UI shows dropdown below input; click adds symbol to state.

### Date range: two `<input type="date">` elements

`from` defaults to 7 days ago, `to` defaults to today. Min date is today (no future dates). On change, fetches new data and re-renders. Server converts dates to Unix timestamps for Yahoo's `period1`/`period2` params.

### Historical data API: batch fetch per symbol

`GET /api/stocks?symbols=AAPL,MSFT&from=2026-05-27&to=2026-06-03` returns a JSON object keyed by symbol. Each value contains `name` and `data` (array of `{ date, open, high, low, close }`). Server uses `Promise.allSettled` to fetch each symbol independently — partial failures return available data.

## Risks / Trade-offs

- **Chart.js CDN dependency** → if CDN is unreachable, charts won't render. Mitigation: the table still works; add a fallback message in the canvas area.
- **Yahoo API rate limiting** → search uses 300ms debounce; each symbol is one API call for historical data. Acceptable for typical watchlists (5-20 symbols). If rate-limited, individual symbol failures are handled gracefully.
- **No server-side persistence** → removing a symbol and refreshing loses the removal (it's in localStorage). Acceptable for a first draft.
- **Client-side state complexity** → single plain object, all mutations through `setState`. Simple enough to reason about without a state management library.
