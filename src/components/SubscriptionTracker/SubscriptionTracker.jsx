import React, { useState, useMemo } from "react";
import { fireToast } from "../Toast/toast";
import { fmt, n2, todayStr } from "../../utils";

function SubscriptionTracker({ subscriptions, setSubscriptions, onClose }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [cycle, setCycle] = useState("monthly");
  const [nextDate, setNextDate] = useState(todayStr());

  // Calculate total monthly cost
  const totalMonthlyCost = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      let monthlyEquivalent = sub.cost;
      if (sub.cycle === "yearly") monthlyEquivalent = sub.cost / 12;
      if (sub.cycle === "weekly") monthlyEquivalent = sub.cost * 4.33;
      return total + monthlyEquivalent;
    }, 0);
  }, [subscriptions]);

  const handleAdd = () => {
    if (!name.trim()) {
      fireToast("⚠️ Enter a subscription name.", "warning");
      return;
    }
    const amt = parseFloat(cost);
    if (isNaN(amt) || amt <= 0) {
      fireToast("⚠️ Enter a valid cost.", "warning");
      return;
    }

    const newSub = {
      id: Date.now(),
      name: name.trim(),
      cost: amt,
      cycle,
      nextDate
    };

    setSubscriptions(prev => [...prev, newSub].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate)));
    fireToast("✅ Subscription added!", "success");
    
    // Reset form
    setName("");
    setCost("");
    setCycle("monthly");
  };

  const handleDelete = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    fireToast("🗑️ Subscription removed.", "remove");
  };

  const formatCycle = (c) => c.charAt(0).toUpperCase() + c.slice(1);

  return (
    <div className="et-modal-overlay">
      <div className="et-modal et-modal-report" style={{ maxWidth: "600px", width: "95%" }}>
        <div className="et-modal-header">
          <h3>💳 Subscription Tracker</h3>
          <button className="et-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="et-modal-body" style={{ padding: "20px" }}>
          
          {/* Summary Card */}
          <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "var(--et-bg)", borderRadius: "8px", border: "1px solid var(--et-border)", textAlign: "center" }}>
            <div style={{ fontSize: "14px", color: "var(--et-tick)", marginBottom: "8px" }}>Total Estimated Monthly Cost</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ff5e5e" }}>
              {fmt(totalMonthlyCost)}
            </div>
            <div style={{ fontSize: "12px", color: "var(--et-muted)", marginTop: "4px" }}>
              Tracking {subscriptions.length} active subscription{subscriptions.length !== 1 && "s"}
            </div>
          </div>

          {/* Add New Subscription Form */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "10px", alignItems: "end", marginBottom: "24px", padding: "15px", backgroundColor: "var(--et-bg)", borderRadius: "8px" }}>
            <div className="et-form-group" style={{ marginBottom: 0 }}>
              <label className="et-label" style={{ fontSize: "11px" }}>Name</label>
              <input className="et-input" placeholder="e.g. Netflix" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="et-form-group" style={{ marginBottom: 0 }}>
              <label className="et-label" style={{ fontSize: "11px" }}>Cost (₹)</label>
              <input className="et-input" type="number" placeholder="0.00" value={cost} onChange={e => setCost(e.target.value)} />
            </div>
            <div className="et-form-group" style={{ marginBottom: 0 }}>
              <label className="et-label" style={{ fontSize: "11px" }}>Cycle</label>
              <select className="et-input" value={cycle} onChange={e => setCycle(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="et-form-group" style={{ marginBottom: 0 }}>
              <label className="et-label" style={{ fontSize: "11px" }}>Next Bill</label>
              <input className="et-input" type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} />
            </div>
            <button className="et-hbtn" style={{ padding: "8px 16px", height: "38px" }} onClick={handleAdd}>Add</button>
          </div>

          {/* List of Subscriptions */}
          <h4 style={{ marginBottom: "15px", borderBottom: "1px solid var(--et-border)", paddingBottom: "10px" }}>Active Subscriptions</h4>
          {subscriptions.length === 0 ? (
            <p style={{ color: "var(--et-tick)", textAlign: "center", padding: "20px" }}>No active subscriptions added yet.</p>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {subscriptions.map(sub => {
                  // Check if due soon (within 3 days)
                  const daysUntil = Math.ceil((new Date(sub.nextDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const dueSoon = daysUntil >= 0 && daysUntil <= 3;
                  const overdue = daysUntil < 0;

                  return (
                    <div key={sub.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", border: "1px solid var(--et-border)", backgroundColor: "var(--et-card)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "15px" }}>{sub.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--et-tick)", marginTop: "4px" }}>
                          {formatCycle(sub.cycle)} • Next bill: <span style={{ color: overdue ? "#ff5e5e" : dueSoon ? "#f5a623" : "inherit", fontWeight: (overdue || dueSoon) ? "bold" : "normal" }}>
                            {new Date(sub.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "15px" }}>{fmt(sub.cost)}</div>
                        <button className="et-tx-btn del" onClick={() => handleDelete(sub.id)} title="Remove">🗑</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionTracker;
