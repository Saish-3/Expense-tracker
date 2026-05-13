import React, { useMemo, useState } from "react";

function MonthlyReport({ txs, onClose }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // Calculate available months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set();
    txs.forEach(t => {
      months.add(t.date.substring(0, 7)); // YYYY-MM
    });
    // Add current month even if no transactions
    const d = new Date();
    months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    
    return Array.from(months).sort().reverse();
  }, [txs]);

  // Compute stats for selected month
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap = {};

    txs.forEach(t => {
      if (t.date.startsWith(selectedMonth)) {
        if (t.type === "income") {
          income += t.amount;
        } else {
          expense += t.amount;
          catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        }
      }
    });

    const categories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

    return { income, expense, balance: income - expense, categories };
  }, [txs, selectedMonth]);

  // Format month label
  const formatMonth = (ym) => {
    const [y, m] = ym.split("-");
    const d = new Date(y, parseInt(m) - 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatCurrency = (val) => `₹${val.toFixed(2)}`;

  return (
    <div className="et-modal-overlay show">
      <div className="et-modal et-modal-report">
        <div className="et-modal-header">
          <h3>Monthly Financial Report</h3>
          <button className="et-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="et-modal-body" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <label style={{ fontWeight: 600 }}>Select Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--et-border)" }}
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>{formatMonth(m)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "24px" }}>
            <div style={{ padding: "15px", backgroundColor: "var(--et-bg)", borderRadius: "8px", border: "1px solid var(--et-border)" }}>
              <div style={{ fontSize: "12px", color: "var(--et-tick)", marginBottom: "5px" }}>Total Income</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#4ecb71" }}>{formatCurrency(stats.income)}</div>
            </div>
            <div style={{ padding: "15px", backgroundColor: "var(--et-bg)", borderRadius: "8px", border: "1px solid var(--et-border)" }}>
              <div style={{ fontSize: "12px", color: "var(--et-tick)", marginBottom: "5px" }}>Total Expense</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff5e5e" }}>{formatCurrency(stats.expense)}</div>
            </div>
            <div style={{ padding: "15px", backgroundColor: "var(--et-bg)", borderRadius: "8px", border: "1px solid var(--et-border)" }}>
              <div style={{ fontSize: "12px", color: "var(--et-tick)", marginBottom: "5px" }}>Net Savings</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: stats.balance >= 0 ? "#4ecb71" : "#ff5e5e" }}>
                {formatCurrency(stats.balance)}
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: "15px", borderBottom: "1px solid var(--et-border)", paddingBottom: "10px" }}>Expense Breakdown</h4>
          {stats.categories.length === 0 ? (
            <p style={{ color: "var(--et-tick)", textAlign: "center", padding: "20px" }}>No expenses recorded for this month.</p>
          ) : (
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              <table style={{ w: "100%", borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  {stats.categories.map(([cat, amt]) => {
                    const pct = ((amt / stats.expense) * 100).toFixed(1);
                    return (
                      <tr key={cat} style={{ borderBottom: "1px solid var(--et-border)" }}>
                        <td style={{ padding: "12px 8px" }}>{cat}</td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>{formatCurrency(amt)}</td>
                        <td style={{ padding: "12px 8px", textAlign: "right", color: "var(--et-tick)", fontSize: "12px" }}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyReport;
