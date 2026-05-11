import { useState, useEffect, useRef } from "react";
import { INCOME_CATS, EXPENSE_CATS } from "../../constants";
import { fmt, n2, todayStr } from "../../utils";

/* ═══════════════════════════════════════════════════════════════
   TRANSACTION FORM COMPONENT
═══════════════════════════════════════════════════════════════ */
function TransactionForm({ editingTx, currentType, setCurrentType, isBlocked, monthlyLimit, limitInput, setLimitInput, budgetStatus, onSubmit, onCancelEdit, onSetLimit, onClearLimit }) {
  const [desc, setDesc]     = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCat]  = useState("");
  const [date, setDate]     = useState(todayStr());
  const descRef = useRef(null);

  const cats = currentType === "income" ? INCOME_CATS : EXPENSE_CATS;

  // When editing tx changes, pre-fill form
  useEffect(() => {
    if (editingTx) {
      setDesc(editingTx.desc);
      setAmount(String(editingTx.amount));
      setDate(editingTx.date);
      // category set after type switch (cats list changes)
      setTimeout(() => setCat(editingTx.category), 0);
    }
  }, [editingTx]);

  // Reset category when type changes
  useEffect(() => {
    if (!editingTx) setCat(cats[0] || "");
  }, [currentType]);

  // Default category on mount / cats change
  useEffect(() => {
    if (!editingTx && !cats.includes(category)) setCat(cats[0] || "");
  }, [cats]);

  // Autofocus desc
  useEffect(() => { descRef.current?.focus(); }, []);

  function reset() {
    setDesc(""); setAmount(""); setDate(todayStr());
    setTimeout(() => descRef.current?.focus(), 0);
  }

  function handleSubmit() {
    const result = onSubmit({ type: currentType, desc, amount, category, date });
    if (result?.success) reset();
  }

  function handleKeyDown(e, next) {
    if (e.key === "Enter") { e.preventDefault(); next ? next.focus() : handleSubmit(); }
  }

  const amountRef = useRef(null), catRef = useRef(null), dateRef = useRef(null);
  const blockedAndExpense = isBlocked && currentType === "expense";

  return (
    <div className="et-panel" id="formPanel">
      <div className="et-panel-title">{editingTx ? "Edit Transaction" : "Add Transaction"}</div>

      <div className="et-type-toggle">
        <button className={`et-type-btn income${currentType === "income" ? " active" : ""}`}
          onClick={() => { if (!editingTx) setCurrentType("income"); }}>↑ Income</button>
        <button className={`et-type-btn expense${currentType === "expense" ? " active" : ""}`}
          onClick={() => { if (!editingTx) setCurrentType("expense"); }}>↓ Expense</button>
      </div>

      {blockedAndExpense && (
        <div className="et-blocked-msg">🔒 Monthly limit reached — no more expenses can be added!</div>
      )}

      <div className={blockedAndExpense ? "et-inputs-locked" : ""}>
        <div className="et-form-group">
          <label className="et-label">Description</label>
          <input ref={descRef} className="et-input" type="text" placeholder="What was it for?"
            value={desc} onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, amountRef.current)} autoComplete="off" />
        </div>
        <div className="et-form-group">
          <label className="et-label">Amount</label>
          <div className="et-amount-wrap">
            <span className="et-currency">₹</span>
            <input ref={amountRef} className="et-input" type="number" placeholder="0.00"
              min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, catRef.current)} />
          </div>
        </div>
        <div className="et-form-group">
          <label className="et-label">Category</label>
          <select ref={catRef} className="et-input" value={category}
            onChange={(e) => setCat(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, dateRef.current)}>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="et-form-group">
          <label className="et-label">Date</label>
          <input ref={dateRef} className="et-input" type="date" value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, null)} />
        </div>
      </div>

      <button className="et-submit-btn" disabled={blockedAndExpense} onClick={handleSubmit}>
        {editingTx ? "✏️ Update Transaction" : "+ Add Transaction"}
      </button>
      {editingTx && (
        <button className="et-cancel-btn" onClick={() => { onCancelEdit(); reset(); }}>✕ Cancel Edit</button>
      )}

      <hr className="et-divider" />

      <div className="et-budget-section-title">🎯 Monthly Budget Limit</div>
      <div className="et-limit-row">
        <div className="et-form-group">
          <label className="et-label">Set Limit (₹)</label>
          <div className="et-amount-wrap">
            <span className="et-currency">₹</span>
            <input className="et-input" type="number" placeholder="e.g. 20000" min="1"
              value={limitInput} onChange={(e) => setLimitInput(e.target.value)} />
          </div>
        </div>
        <button className="et-set-limit-btn" onClick={onSetLimit}>Set</button>
      </div>

      {budgetStatus.active && (
        <div>
          <div className="et-limit-status-row">
            <span>Used {fmt(budgetStatus.used)} of {fmt(budgetStatus.limit)}</span>
            <span style={{ fontWeight: 600 }}>{budgetStatus.pct.toFixed(1)}%</span>
          </div>
          <div className="et-limit-bar-wrap">
            <div className="et-limit-bar-fill"
              style={{ width: budgetStatus.pct + "%", background: budgetStatus.barColor }} />
          </div>
          <div className="et-limit-remaining">
            {budgetStatus.remaining >= 0
              ? `₹${n2(budgetStatus.remaining)} remaining`
              : `₹${n2(Math.abs(budgetStatus.remaining))} over limit`}
          </div>
          <button className="et-clear-limit-btn" onClick={onClearLimit}>✕ Remove limit</button>
        </div>
      )}
    </div>
  );
}

export default TransactionForm;
