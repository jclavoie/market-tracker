## Purpose

JSON API endpoints for stock search autocomplete and historical OHLCV data, plus static file serving for the SPA.

## Requirements

### Requirement: Serve stock search autocomplete endpoint

The server SHALL expose `GET /api/search?q=<term>` that proxies to Yahoo Finance's search API. The response SHALL return a JSON array of matching equity symbols with `symbol`, `name`, and `exchange` fields. Results SHALL be filtered to `quoteType: "EQUITY"` only.

#### Scenario: Search returns matching stocks

- **WHEN** a request is made to `GET /api/search?q=apple`
- **THEN** the server responds with status 200 and a JSON array containing at least `{ "symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ" }`

#### Scenario: Empty query returns empty array

- **WHEN** a request is made to `GET /api/search?q=` with an empty query
- **THEN** the server responds with status 200 and an empty JSON array

### Requirement: Serve historical stock data endpoint

The server SHALL expose `GET /api/stocks?symbols=<csv>&from=<date>&to=<date>` that returns daily OHLCV data for the requested symbols and date range. The response SHALL be a JSON object keyed by symbol, each containing `name` and `data` (array of `{ date, open, high, low, close }`). Dates SHALL be formatted as `YYYY-MM-DD`.

#### Scenario: Fetch historical data for multiple symbols

- **WHEN** a request is made to `GET /api/stocks?symbols=AAPL,MSFT&from=2026-05-27&to=2026-06-03`
- **THEN** the server responds with `{ "AAPL": { "name": "Apple Inc.", "data": [...] }, "MSFT": { ... } }` where each `data` array contains daily OHLCV objects

#### Scenario: Partial symbol failure returns available data

- **WHEN** AAPL data fetches successfully but MSFT fails
- **THEN** the response includes AAPL data and excludes MSFT

#### Scenario: Missing parameters returns 400

- **WHEN** a request is made without `symbols` or `from` or `to`
- **THEN** the server responds with status 400 and an error message

### Requirement: Serve static files for the SPA

The server SHALL serve `index.html` at `GET /` and client-side JavaScript at `GET /app.js`. Files SHALL be served from `src/public/` using `fs.createReadStream`.

#### Scenario: Load the SPA shell

- **WHEN** a browser requests `GET /`
- **THEN** the server responds with status 200, `Content-Type: text/html`, and the contents of `src/public/index.html`

#### Scenario: Load client JavaScript

- **WHEN** a browser requests `GET /app.js`
- **THEN** the server responds with status 200, `Content-Type: application/javascript`, and the contents of `src/public/app.js`
