const http = require("node:http");
const { fetchStockData } = require("./stock-service");
const { renderDashboard } = require("./dashboard");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    try {
      const stockData = await fetchStockData();
      const html = renderDashboard(stockData);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      console.error("Dashboard error:", err);
      const html = renderDashboard([]);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found\n");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
