(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const today = () => new Date().toISOString().slice(0, 10);
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };

  const COLORS = [
    "#1a73e8", "#e37400", "#0d904f", "#d93025",
    "#9334e6", "#e82d6e", "#00acc1", "#7cb342",
    "#5c6bc0", "#f4511e",
  ];

  let state = {
    symbols: ["AAPL", "GOOGL", "MSFT", "AMZN"],
    from: daysAgo(7),
    to: today(),
    stockData: {},
  };

  // ── State sync ────────────────────────────────────────────────

  function loadState() {
    const params = new URLSearchParams(location.search);
    const ls = safeParse(localStorage.getItem("mt-state"));
    state.symbols = (params.get("symbols") || (ls && ls.symbols) || "AAPL,GOOGL,MSFT,AMZN")
      .split(",").map(s => s.trim()).filter(Boolean);
    state.from = params.get("from") || (ls && ls.from) || daysAgo(7);
    state.to = params.get("to") || (ls && ls.to) || today();
  }

  function saveState() {
    const qs = new URLSearchParams({ symbols: state.symbols.join(","), from: state.from, to: state.to });
    history.replaceState(null, "", "?" + qs.toString());
    localStorage.setItem("mt-state", JSON.stringify({ symbols: state.symbols.join(","), from: state.from, to: state.to }));
  }

  function setState(partial) {
    Object.assign(state, partial);
    saveState();
    render();
    fetchAndRender();
  }

  function safeParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  // ── Search ────────────────────────────────────────────────────

  let searchTimer = null;

  function setupSearch() {
    const input = $("#search");
    const dropdown = $("#dropdown");

    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      const q = input.value.trim();
      if (!q) { dropdown.classList.remove("visible"); return; }
      searchTimer = setTimeout(() => doSearch(q), 300);
    });

    input.addEventListener("focus", () => {
      if (dropdown.children.length > 0) dropdown.classList.add("visible");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) dropdown.classList.remove("visible");
    });
  }

  async function doSearch(q) {
    const dropdown = $("#dropdown");
    try {
      const res = await fetch("/api/search?q=" + encodeURIComponent(q));
      const results = await res.json();
      if (results.length === 0) {
        dropdown.innerHTML = '<div class="dd-empty">No results found</div>';
      } else {
        dropdown.innerHTML = results
          .map(r => `<div class="dd-item" data-symbol="${r.symbol}" data-name="${r.name}" data-exchange="${r.exchange}">
            <span><span class="sym">${r.symbol}</span> ${r.name}</span>
            <span class="exch">${r.exchange}</span>
          </div>`).join("");
        dropdown.querySelectorAll(".dd-item").forEach(el => {
          el.addEventListener("click", () => addSymbol(el.dataset.symbol));
        });
      }
      dropdown.classList.add("visible");
    } catch {
      dropdown.innerHTML = '<div class="dd-empty">Search unavailable</div>';
      dropdown.classList.add("visible");
    }
  }

  function addSymbol(symbol) {
    const sym = symbol.toUpperCase();
    if (state.symbols.includes(sym)) return;
    setState({ symbols: [...state.symbols, sym] });
    $("#search").value = "";
    $("#dropdown").classList.remove("visible");
  }

  function removeSymbol(symbol) {
    setState({ symbols: state.symbols.filter(s => s !== symbol) });
  }

  // ── Pills ─────────────────────────────────────────────────────

  function renderPills() {
    const container = $("#pills");
    container.innerHTML = state.symbols
      .map(s => `<span class="pill">${s}<span class="remove" data-symbol="${s}">\u00d7</span></span>`)
      .join("");
    container.querySelectorAll(".remove").forEach(el => {
      el.addEventListener("click", () => removeSymbol(el.dataset.symbol));
    });
  }

  // ── Data fetch ────────────────────────────────────────────────

  async function fetchAndRender() {
    if (state.symbols.length === 0) {
      state.stockData = {};
      renderTable();
      renderCharts();
      return;
    }
    try {
      const res = await fetch(`/api/stocks?symbols=${state.symbols.join(",")}&from=${state.from}&to=${state.to}`);
      state.stockData = await res.json();
    } catch {
      state.stockData = {};
    }
    renderTable();
    renderCharts();
  }

  // ── Table ─────────────────────────────────────────────────────

  function renderTable() {
    const container = $("#table-container");
    const latestDate = state.to;

    if (state.symbols.length === 0 || Object.keys(state.stockData).length === 0) {
      container.innerHTML = '<p class="empty">No stock data available</p>';
      return;
    }

    const rows = state.symbols
      .map(sym => {
        const stock = state.stockData[sym];
        if (!stock) return null;
        const entry = stock.data.find(d => d.date === latestDate) || stock.data[stock.data.length - 1];
        if (!entry || entry.open == null || entry.close == null) return null;

        const change = entry.close - entry.open;
        const changePct = entry.open !== 0 ? (change / entry.open) * 100 : 0;
        const color = change > 0 ? "green" : change < 0 ? "red" : "inherit";
        const sign = change >= 0 ? "+" : "";

        return `<tr>
          <td>${sym}</td>
          <td>${entry.open.toFixed(2)}</td>
          <td>${entry.close.toFixed(2)}</td>
          <td style="color:${color}">${sign}${change.toFixed(2)}</td>
          <td style="color:${color}">${sign}${changePct.toFixed(2)}%</td>
        </tr>`;
      })
      .filter(Boolean)
      .join("");

    if (!rows) {
      container.innerHTML = '<p class="empty">No stock data available</p>';
      return;
    }

    container.innerHTML = `<table>
      <thead><tr>
        <th>Symbol</th><th>Open</th><th>Close</th><th>Change</th><th>Change %</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  // ── Charts ────────────────────────────────────────────────────

  let lineChart = null;
  let barChart = null;

  function renderCharts() {
    renderLineChart();
    renderBarChart();
  }

  function getDatasets() {
    const datasets = [];
    state.symbols.forEach((sym, i) => {
      const stock = state.stockData[sym];
      if (!stock || !stock.data || stock.data.length === 0) return;
      datasets.push({
        label: sym,
        data: stock.data.filter(d => d.close != null).map(d => ({ x: d.date, y: d.close })),
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length],
        pointRadius: 2,
      });
    });
    return datasets;
  }

  function renderLineChart() {
    const ctx = $("#line-chart").getContext("2d");
    if (lineChart) lineChart.destroy();

    const datasets = getDatasets();
    if (datasets.length === 0) {
      ctx.canvas.style.display = "none";
      return;
    }
    ctx.canvas.style.display = "";

    lineChart = new Chart(ctx, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: "Closing Price" }, legend: { position: "bottom" } },
        scales: { x: { type: "category" }, y: { beginAtZero: false } },
      },
    });
  }

  function renderBarChart() {
    const ctx = $("#bar-chart").getContext("2d");
    if (barChart) barChart.destroy();

    const datasets = [];
    state.symbols.forEach((sym, i) => {
      const stock = state.stockData[sym];
      if (!stock || !stock.data || stock.data.length === 0) return;
      const data = [];
      const bgColors = [];
      stock.data.forEach(d => {
        if (d.close == null || d.open == null || d.open === 0) return;
        const pct = ((d.close - d.open) / d.open) * 100;
        data.push({ x: d.date, y: +pct.toFixed(2) });
        bgColors.push(pct >= 0 ? "green" : "red");
      });
      if (data.length === 0) return;
      datasets.push({
        label: sym,
        data,
        backgroundColor: COLORS[i % COLORS.length],
        borderWidth: 0,
      });
    });

    if (datasets.length === 0) {
      ctx.canvas.style.display = "none";
      return;
    }
    ctx.canvas.style.display = "";

    barChart = new Chart(ctx, {
      type: "bar",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: "Daily Change %" }, legend: { position: "bottom" } },
        scales: { x: { type: "category" }, y: { beginAtZero: true } },
      },
    });
  }

  // ── Render ────────────────────────────────────────────────────

  function render() {
    $("#from").value = state.from;
    $("#to").value = state.to;
    renderPills();
  }

  // ── Init ──────────────────────────────────────────────────────

  function init() {
    loadState();
    render();
    setupSearch();
    fetchAndRender();

    $("#from").addEventListener("change", () => {
      const to = state.to;
      const from = $("#from").value;
      if (from > to) $("#from").value = to;
      setState({ from: $("#from").value });
    });
    $("#to").addEventListener("change", () => {
      const from = state.from;
      const to = $("#to").value;
      if (to < from) $("#to").value = from;
      setState({ to: $("#to").value });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
