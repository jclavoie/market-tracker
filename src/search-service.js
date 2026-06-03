const YAHOO_SEARCH_URL = "https://query1.finance.yahoo.com/v1/finance/search";

async function searchStocks(query) {
  if (!query || !query.trim()) return [];

  const url = `${YAHOO_SEARCH_URL}?q=${encodeURIComponent(query.trim())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);

  const json = await res.json();
  return (json.quotes || [])
    .filter(q => q.quoteType === "EQUITY" && q.isYahooFinance)
    .map(q => ({
      symbol: q.symbol,
      name: q.shortname || q.longname,
      exchange: q.exchDisp,
    }));
}

module.exports = { searchStocks };
