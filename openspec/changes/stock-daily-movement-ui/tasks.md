## 1. Stock Data Service

- [x] 1.1 Create `src/stock-service.js` module with `fetchStockData()` function that reads `STOCK_SYMBOLS` env var (with defaults) and fetches daily data from a public stock API
- [x] 1.2 Parse API responses into structured objects with `{ symbol, open, close, change, changePercent }` rounded to 2 decimal places
- [x] 1.3 Implement error handling: partial failures return available data; complete failure returns empty array and logs to stderr

## 2. Dashboard HTML

- [x] 2.1 Create `src/dashboard.js` module with `renderDashboard(stockData)` function that generates a complete HTML page
- [x] 2.2 Render a table with columns: Symbol, Open, Close, Change, Change %, with current date heading
- [x] 2.3 Color positive changes green and negative changes red using inline styles
- [x] 2.4 Display "No stock data available" message when stock data array is empty

## 3. Server Integration

- [x] 3.1 Update `src/index.js` to route `GET /` to the stock dashboard and `GET /health` to `{"status":"ok"}`
- [x] 3.2 Wire stock service and dashboard renderer into the request handler
- [x] 3.3 Test end-to-end: `STOCK_SYMBOLS=AAPL,MSFT node src/index.js` and verify dashboard renders in browser
