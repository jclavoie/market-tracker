## Firewall 1 — Server Agent

- [x] 1.1 Create `src/search-service.js` — proxy Yahoo Finance `/v1/finance/search`, filter to EQUITY type, return `[{ symbol, name, exchange }]`
- [x] 1.2 Modify `src/stock-service.js` — accept `(symbols, fromDate, toDate)` params, use `period1`/`period2` Unix timestamps, return `{ [symbol]: { name, data: [...] } }`
- [x] 1.3 Update `src/index.js` — add routes for `GET /api/search?q=`, `GET /api/stocks?symbols=&from=&to=`, serve static files from `src/public/`

<!-- commit firewall -->

## Firewall 2 — Client Agent

- [ ] 2.1 Remove `src/dashboard.js` (replaced by client rendering)
- [ ] 2.2 Create `src/public/index.html` — HTML shell with Chart.js CDN `<script>`, search input, date pickers, symbol pills container, table, two `<canvas>` elements, load `app.js`
- [ ] 2.3 Create `src/public/app.js` — state object with URL+localStorage sync, search autocomplete, symbol pills, data fetch, table rendering, line+bar charts via Chart.js, empty states

<!-- commit firewall -->

*Subagent split: Server (1.1–1.3) and Client (2.1–2.3). Client depends on Server API contract. Server can be tested independently with curl. Client shares one state object — splitting search, table, and charts into separate subagents would cause merge conflicts.*
