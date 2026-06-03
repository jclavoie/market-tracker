const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { fetchStockData } = require("./stock-service");
const { searchStocks } = require("./search-service");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";
  try {
    const stat = fs.statSync(filePath);
    res.writeHead(200, { "Content-Type": contentType, "Content-Length": stat.size });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
}

function parseQuery(url) {
  const u = new URL(url, "http://localhost");
  return Object.fromEntries(u.searchParams);
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];

  if (req.method === "GET" && urlPath === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && urlPath === "/api/search") {
    const { q } = parseQuery(req.url);
    try {
      const results = await searchStocks(q || "");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    } catch (err) {
      console.error("Search error:", err);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("[]");
    }
    return;
  }

  if (req.method === "GET" && urlPath === "/api/stocks") {
    const { symbols, from, to } = parseQuery(req.url);
    if (!symbols || !from || !to) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing symbols, from, or to" }));
      return;
    }
    try {
      const symbolList = symbols.split(",").map(s => s.trim()).filter(Boolean);
      const data = await fetchStockData(symbolList, from, to);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error("Stocks error:", err);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{}");
    }
    return;
  }

  if (req.method === "GET" && urlPath === "/app.js") {
    serveFile(res, path.join(PUBLIC_DIR, "app.js"));
    return;
  }

  if (req.method === "GET" && urlPath === "/") {
    serveFile(res, path.join(PUBLIC_DIR, "index.html"));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found\n");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
