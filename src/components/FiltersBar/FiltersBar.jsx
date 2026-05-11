import { useState, useRef } from "react";
import { fireToast } from "../Toast/toast";

/* ═══════════════════════════════════════════════════════════════
   FILTERS BAR COMPONENT
═══════════════════════════════════════════════════════════════ */
function FiltersBar({ filter, setFilter }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [searchVal, setSearchVal] = useState("");
  const searchTimer = useRef(null);

  function onSearchChange(v) {
    setSearchVal(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setFilter((f) => ({ ...f, search: v })), 250);
  }

  function applyCustomDate() {
    if (!dateFrom || !dateTo) { fireToast("⚠️ Select both start and end dates.", "warning"); return; }
    if (dateFrom > dateTo)    { fireToast("⚠️ Start date must be before end date.", "warning"); return; }
    setFilter((f) => ({ ...f, dateFrom, dateTo }));
  }

  return (
    <div className="et-filters-bar">
      <div className="et-filters-row">
        <div className="et-search-wrap">
          <span className="et-search-icon">🔍</span>
          <input className="et-input" type="text" placeholder="Search transactions…"
            value={searchVal} onChange={(e) => onSearchChange(e.target.value)} />
        </div>
        <select className="et-sort-select" value={filter.sortBy}
          onChange={(e) => setFilter((f) => ({ ...f, sortBy: e.target.value }))}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="category">Sort: Category</option>
        </select>
        <button className="et-sort-dir-btn"
          onClick={() => setFilter((f) => ({ ...f, sortDir: f.sortDir === "asc" ? "desc" : "asc" }))}>
          {filter.sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <div className="et-filters-row" style={{ marginTop: 10 }}>
        <div className="et-chip-group">
          {["all","income","expense"].map((v) => (
            <button key={v} className={`et-chip${filter.type === v ? " active" : ""}`}
              onClick={() => setFilter((f) => ({ ...f, type: v }))}>
              {v === "all" ? "All" : v === "income" ? "Income" : "Expenses"}
            </button>
          ))}
        </div>
        <div className="et-chip-group" style={{ marginLeft: "auto" }}>
          {[["all","All time"],["month","This month"],["3months","Last 3 months"],["year","This year"],["custom","Custom"]].map(([v, label]) => (
            <button key={v} className={`et-chip${filter.period === v ? " active" : ""}`}
              onClick={() => setFilter((f) => ({ ...f, period: v }))}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filter.period === "custom" && (
        <div className="et-filters-row et-custom-range" style={{ marginTop: 10 }}>
          <label className="et-label" style={{ margin: 0, whiteSpace: "nowrap" }}>From</label>
          <input className="et-input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <label className="et-label" style={{ margin: 0, whiteSpace: "nowrap" }}>To</label>
          <input className="et-input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <button className="et-apply-btn" onClick={applyCustomDate}>Apply</button>
        </div>
      )}
    </div>
  );
}

export default FiltersBar;
