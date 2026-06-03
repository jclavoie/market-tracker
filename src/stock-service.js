const STOCK_SYMBOLS = (process.env.STOCK_SYMBOLS || "AAPL,GOOGL,MSFT,AMZN").split(",").map(s => s.trim());
const YAHOO_QUOTE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchStockData() {
  const results = await Promise.allSettled(
    STOCK_SYMBOLS.map(async (symbol) => {
      const url = `${YAHOO_QUOTE_URL}${symbol}?range=1d&interval=1d`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${symbol}`);
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error(`No chart data for ${symbol}`);

      const quote = result.indicators.quote?.[0];
      const meta = result.meta;
      const open = quote.open?.[0] ?? meta.chartPreviousClose ?? meta.regularMarketPrice;
      const close = meta.regularMarketPrice ?? quote.close?.[0];
      const change = close - open;
      const changePercent = open !== 0 ? (change / open) * 100 : 0;

      return {
        symbol,
        open: +open.toFixed(2),
        close: +close.toFixed(2),
        change: +change.toFixed(2),
        changePercent: +changePercent.toFixed(2),
      };
    })
  );

  const data = [];
  const errors = [];

  for (const r of results) {
    if (r.status === "fulfilled") {
      data.push(r.value);
    } else {
      errors.push(r.reason.message);
    }
  }

  if (errors.length > 0) {
    console.error("Stock fetch errors:", errors.join("; "));
  }

  return data;
}

module.exports = { fetchStockData };
