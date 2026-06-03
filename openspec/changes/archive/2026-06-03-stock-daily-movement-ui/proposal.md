## Why

The app currently only returns "Hello, world!" with no real functionality. A simple UI showing daily stock movement provides a concrete first feature — a dashboard where users can see how stocks are performing each day at a glance.

## What Changes

- Add a stock data service that fetches daily price data for a configurable list of ticker symbols
- Add an HTML UI served by the HTTP server that renders a table of stocks with their daily price movement (open, close, change, change %)
- Replace the plain-text "Hello, world!" response with the stock dashboard UI

## Capabilities

### New Capabilities

- `stock-data-fetching`: Fetch daily stock price data (open, high, low, close) for a list of ticker symbols from a public API
- `stock-dashboard-ui`: Serve and render an HTML dashboard page displaying a table of stocks with their daily price movement (symbol, open, close, change, change %)

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- `src/index.js` — HTTP server will serve HTML instead of plain text
- New files in `src/` for stock data fetching and HTML rendering
- Runtime dependency: fetch API (built-in Node 18+) for API calls, no additional npm packages required
