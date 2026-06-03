function renderDashboard(stockData) {
  const date = new Date().toISOString().slice(0, 10);

  let body;
  if (stockData.length === 0) {
    body = `<p>No stock data available</p>`;
  } else {
    const rows = stockData.map((s) => {
      const color = s.change > 0 ? "green" : s.change < 0 ? "red" : "inherit";
      return `<tr>
        <td>${s.symbol}</td>
        <td>${s.open.toFixed(2)}</td>
        <td>${s.close.toFixed(2)}</td>
        <td style="color:${color}">${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}</td>
        <td style="color:${color}">${s.changePercent >= 0 ? "+" : ""}${s.changePercent.toFixed(2)}%</td>
      </tr>`;
    }).join("");

    body = `<table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Open</th>
          <th>Close</th>
          <th>Change</th>
          <th>Change %</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Market Dashboard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 2em auto; padding: 0 1em; }
    h1 { font-size: 1.5em; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5em 0.75em; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    th { border-bottom: 2px solid #ccc; }
    td { border-bottom: 1px solid #eee; }
    tr:hover { background: #f9f9f9; }
    .date { color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Stock Daily Movement</h1>
  <p class="date">${date}</p>
  ${body}
</body>
</html>`;
}

module.exports = { renderDashboard };
