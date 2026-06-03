## Why

The first draft is a static page — users can see today's snapshot but can't explore. Adding a date range picker, stock search, and charts makes it an interactive exploration tool instead of a passive readout.

## What Changes

- Replace the static server-rendered HTML page with a client-side SPA using vanilla JS
- Add a date range picker (from/to) to fetch and display historical daily stock data
- Add a stock search bar with autocomplete against Yahoo Finance's search endpoint, letting users add/remove symbols from the watchlist
- Add a line chart (price over time) and a bar chart (daily % change) using Chart.js loaded from CDN
- Add JSON API endpoints (`/api/stocks`, `/api/search`) to support client-side data fetching
- Persist selected symbols and date range via URL query params and localStorage
- Remove `src/dashboard.js` (server-side HTML rendering replaced by client)

## Capabilities

### New Capabilities

- `stock-api`: JSON API endpoints for stock historical data (`GET /api/stocks`) and symbol search (`GET /api/search`)
- `stock-search`: Autocomplete search bar that queries Yahoo Finance for ticker symbols, with add/remove symbol pills
- `stock-charts`: Line chart (closing price over time) and bar chart (daily % change) rendered with Chart.js
- `interactive-dashboard-ui`: Client-side vanilla JS SPA with date range picker, dynamic symbol list, and live-updating table

### Modified Capabilities

<!-- No existing specs to modify — first draft has not been archived -->

## Impact

- `src/index.js` — added API route handling and static file serving
- `src/stock-service.js` — **MODIFIED**: accepts date range params, returns arrays of daily OHLCV per symbol
- `src/search-service.js` — **NEW**: proxies Yahoo Finance `/v1/finance/search`
- `src/dashboard.js` — **REMOVED**: replaced by client-side rendering
- `src/public/index.html` — **NEW**: SPA shell
- `src/public/app.js` — **NEW**: client-side state management and rendering
- Chart.js CDN — **NEW** dependency (no npm install, loaded via `<script>`)
