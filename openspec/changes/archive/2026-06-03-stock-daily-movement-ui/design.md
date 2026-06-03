## Context

The app is a minimal Node.js HTTP server (no frameworks) running on port 3000 inside Docker. Currently it returns "Hello, world!". We're adding a stock dashboard as the first real feature. The stack is intentionally minimal — no Express, no frontend framework, no npm dependencies beyond the Node stdlib.

## Goals / Non-Goals

**Goals:**
- Fetch daily stock price data for a configurable list of ticker symbols from a public API
- Serve an HTML page that displays each stock's daily movement (symbol, open, close, change amount, change %)
- Keep it a single-page, server-rendered dashboard (no client-side JS required)
- Use only built-in Node.js APIs — no new npm dependencies

**Non-Goals:**
- Real-time updates, websockets, or live price streaming
- Historical charts, multi-day views, or candlestick displays
- User-configurable watchlists (hardcoded/cfg-driven symbol list is fine)
- Authentication, user accounts, or persistence
- Intraday data or any granularity finer than daily
- CSS frameworks, build tools, or frontend tooling

## Decisions

### Stock data source: configurable module with default free API

Use a `StockService` module that abstracts data fetching. The default implementation calls a free public stock API. The API URL and key are configured via environment variables (`STOCK_API_URL`, `STOCK_API_KEY`), defaulting to a no-auth-required source like Yahoo Finance's CSV endpoint.

**Alternatives considered:**
- Hardcoding one API → too rigid, breaks if the API changes
- Client-side fetch → adds complexity, requires CORS handling, violates non-goal of no client JS
- Adding npm API client → violates minimal-dependency goal

### HTML rendering: template literal function

Generate HTML using a pure function that takes stock data and returns an HTML string. No templating library, no file I/O for templates — just a JavaScript function returning a template literal.

**Alternatives considered:**
- Read HTML from `.html` file → adds I/O complexity, nothing to gain for a simple table
- Client-side rendering with JSON endpoint → adds JS, violates non-goal

### Server architecture: single handler with route switching

Extend the existing `http.createServer` handler to check `req.url` and switch between the dashboard (`/`) and a simple `/health` endpoint. No router library.

### Symbol list: environment variable

`STOCK_SYMBOLS` env var as a comma-separated list (e.g., `AAPL,GOOGL,MSFT`), with sensible defaults. Keeps configuration Docker-friendly.

## Risks / Trade-offs

- **Free API reliability** → Yahoo Finance CSV endpoint may change or rate-limit. Mitigation: the `StockService` is the single integration point; swapping APIs requires changing one file.
- **Server-side render on every request** → each page load fetches live API data, which could be slow. For the first draft with a handful of symbols this is acceptable.
- **No client-side interactivity** → users can't sort, filter, or refresh without a full page reload. Acceptable for a first draft.
