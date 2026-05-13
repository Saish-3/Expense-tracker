import { parseDate, fmt } from "../../utils";

/* ═══════════════════════════════════════════════════════════════
   TRANSACTION LIST COMPONENT
═══════════════════════════════════════════════════════════════ */
function TransactionList({ filtered, runningBalances, onEdit, onDelete }) {
  if (!filtered.length) return (
    <div className="et-empty">
      <div className="et-empty-icon">🪙</div>
      <div className="et-empty-label">Nothing to show</div>
      <div className="et-empty-sub">Try adjusting filters or add a transaction above.</div>
    </div>
  );
  return (
    <div className="et-transactions">
      {filtered.map((t, idx) => {
        const icon = t.category.split(" ")[0];
        const sign = t.type === "income" ? "+" : "-";
        const d = parseDate(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        const bal = runningBalances[t.id] ?? 0;
        const balClass = bal >= 0 ? "pos" : "neg";
        return (
          <div key={t.id} className={`et-tx ${t.type}-tx`}
            style={{ animationDelay: `${Math.min(idx, 10) * 30}ms` }}>
            <div className="et-tx-icon">{icon}</div>
            <div className="et-tx-info">
              <div className="et-tx-desc">{t.desc}</div>
              <div className="et-tx-meta">
                <span>{d}</span>
                <span className="et-tx-cat">{t.category}</span>
                {t.isRecurring && <span style={{ marginLeft: "6px", fontSize: "10px", padding: "2px 6px", background: "var(--et-primary)", color: "#fff", borderRadius: "10px", opacity: 0.85 }}>🔄 {t.frequency}</span>}
              </div>
            </div>
            <div className="et-tx-right">
              <div className="et-tx-amount">{sign}{fmt(t.amount)}</div>
              <div className={`et-tx-balance ${balClass}`}>bal: {fmt(bal)}</div>
            </div>
            <div className="et-tx-actions">
              <button className="et-tx-btn edit" onClick={() => onEdit(t.id)} title="Edit">✏️</button>
              <button className="et-tx-btn del"  onClick={() => onDelete(t.id)} title="Delete">🗑</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
