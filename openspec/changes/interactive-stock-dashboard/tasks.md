## 1. Server: API Endpoints

- [ ] 1.1 Create `src/search-service.js` — proxy Yahoo Finance `/v1/finance/search`, filter to EQUITY type, return `[{ symbol, name, exchange }]`
- [ ] 1.2 Modify `src/stock-service.js` — accept `(symbols, fromDate, toDate)` params, use `period1`/`period2` Unix timestamps, return `{ [symbol]: { name, data: [...] } }`
- [ ] 1.3 Update `src/index.js` — add routes for `GET /api/search?q=`, `GET /api/stocks?symbols=&from=&to=`, serve static files from `src/public/`

## 2. Client: SPA Shell and State

- [ ] 2.1 Create `src/public/index.html` — HTML shell with Chart.js CDN `<script>`, search input, date pickers, symbol pills container, table, two `<canvas>` elements, load `app.js`
- [ ] 2.2 Create `src/public/app.js` — state object, `setState(partial)` with URL + localStorage sync, `init()` that restores state and triggers first render

## 3. Client: Search and Watchlist

- [ ] 3.1 Implement search autocomplete — debounced (300ms) fetch to `/api/search`, render dropdown below input, click to add symbol
- [ ] 3.2 Implement symbol pills — render watchlist as pills with × remove button, prevent duplicates, trigger re-fetch on add/remove

## 4. Client: Data Fetching and Table

- [ ] 4.1 Implement `fetchAndRender()` — fetch `/api/stocks` with current state, update table rows with open/close/change/change% for the latest date, green/red coloring

## 5. Client: Charts

- [ ] 5.1 Implement line chart — Chart.js `line` type, one dataset per symbol (distinct colors), x-axis = dates, y-axis = close price, legend
- [ ] 5.2 Implement bar chart — Chart.js `bar` type, daily % change per symbol, grouped bars, green for positive, red for negative
- [ ] 5.3 Handle empty state — show "No chart data" when no symbols or no data

## 6. Polish and Verify

- [ ] 6.1 Remove `src/dashboard.js` (replaced by client rendering)
- [ ] 6.2 Test end-to-end — start server, verify search works, date range changes data, charts render, state persists on reload
