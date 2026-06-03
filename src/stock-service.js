const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchStockData(symbols, fromDate, toDate) {
  const from = Math.floor(new Date(fromDate + "T00:00:00Z").getTime() / 1000);
  const to = Math.floor(new Date(toDate + "T23:59:59Z").getTime() / 1000);

  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const url = `${YAHOO_CHART_URL}${encodeURIComponent(symbol)}?period1=${from}&period2=${to}&interval=1d`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${symbol}`);
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error(`No chart data for ${symbol}`);

      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0];
      const meta = result.meta;

      const data = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        open: quote?.open?.[i] != null ? +quote.open[i].toFixed(2) : null,
        high: quote?.high?.[i] != null ? +quote.high[i].toFixed(2) : null,
        low: quote?.low?.[i] != null ? +quote.low[i].toFixed(2) : null,
        close: quote?.close?.[i] != null ? +quote.close[i].toFixed(2) : null,
      }));

      return {
        symbol,
        name: meta?.shortName || meta?.longname || symbol,
        data,
      };
    })
  );

  const stocks = {};
  const errors = [];

  for (const r of results) {
    if (r.status === "fulfilled") {
      const { symbol, name, data } = r.value;
      stocks[symbol] = { name, data };
    } else {
      errors.push(r.reason.message);
    }
  }

  if (errors.length > 0) {
    console.error("Stock fetch errors:", errors.join("; "));
  }

  return stocks;
}

module.exports = { fetchStockData };
