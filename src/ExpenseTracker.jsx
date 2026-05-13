import { useState, useEffect, useRef, useMemo } from "react";

// Constants & Utils
import { STORAGE_KEYS } from "./constants";
import { fmt, n2, computeStats, getFiltered, getRunningBalances, validateTx, exportCSV } from "./utils";
import GLOBAL_CSS from "./styles/globalCSS";

// Components
import { fireToast } from "./components/Toast/toast";
import Modal from "./components/Modal/Modal";
import ChartPanel from "./components/ChartPanel/ChartPanel";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";
import FiltersBar from "./components/FiltersBar/FiltersBar";
import MonthlyReport from "./components/MonthlyReport/MonthlyReport";
import SubscriptionTracker from "./components/SubscriptionTracker/SubscriptionTracker";
import PricingModal from "./components/PricingModal/PricingModal";

/* ═══════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ExpenseTracker() {
  // ── Persisted state ──────────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) || "[]"); } catch { return []; }
  });
  const [monthlyLimit, setMonthlyLimit] = useState(() =>
    parseFloat(localStorage.getItem(STORAGE_KEYS.limit) || "0") || 0
  );
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) || "dark");

  // ── UI state ─────────────────────────────────────────
  const [currentType, setCurrentType] = useState("income");
  const [editingId, setEditingId]     = useState(null);
  const [chartMode, setChartMode]     = useState("bar");
  const [limitInput, setLimitInput]   = useState(monthlyLimit > 0 ? String(monthlyLimit) : "");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [modal, setModal]             = useState(null);
  const [filter, setFilter]           = useState({
    type: "all", period: "all", dateFrom: "", dateTo: "", search: "", sortBy: "date", sortDir: "desc"
  });
  const [showReport, setShowReport]   = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [subscriptions, setSubscriptions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("et_subscriptions") || "[]"); } catch { return []; }
  });

  // Budget modal fire tracking
  const modalShownRef  = useRef(false);
  const lastExceedRef  = useRef(0);

  // ── Persist transactions ──────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  // ── Persist subscriptions ─────────────────────────────
  useEffect(() => {
    localStorage.setItem("et_subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // ── Persist theme ─────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ── Persist limit ─────────────────────────────────────
  useEffect(() => {
    if (monthlyLimit > 0) localStorage.setItem(STORAGE_KEYS.limit, String(monthlyLimit));
    else localStorage.removeItem(STORAGE_KEYS.limit);
  }, [monthlyLimit]);

  // ── Inject global CSS once ────────────────────────────
  useEffect(() => {
    if (document.getElementById("et-global-css")) return;
    const el = document.createElement("style"); el.id = "et-global-css"; el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  // ── Auto-generate recurring transactions ──────────────
  useEffect(() => {
    if (transactions.length === 0) return;

    let modified = false;
    const newTx = [];
    const today = new Date();
    
    const updatedTransactions = transactions.map(t => {
      if (!t.isRecurring || !t.lastProcessed) return t;

      let lastDate = new Date(t.lastProcessed);
      let tModified = false;
      let curT = { ...t };

      while (true) {
        let nextDate = new Date(lastDate);
        if (t.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
        else if (t.frequency === "yearly") nextDate.setFullYear(nextDate.getFullYear() + 1);
        else nextDate.setMonth(nextDate.getMonth() + 1); // default monthly

        // To safely compare without time, format nextDate to YYYY-MM-DD
        const nextDateStr = nextDate.toISOString().split("T")[0];
        const todayStr = today.toISOString().split("T")[0];

        if (nextDateStr <= todayStr) {
          lastDate = nextDate;
          tModified = true;
          modified = true;
          curT.lastProcessed = nextDateStr;
          
          newTx.push({
            ...t,
            id: Date.now() + Math.random(),
            date: nextDateStr,
            created: new Date().toISOString()
          });
        } else {
          break;
        }
      }
      return curT;
    });

    if (modified) {
      setTransactions([...newTx, ...updatedTransactions]);
      setTimeout(() => fireToast(`🔄 Auto-logged ${newTx.length} recurring transaction(s).`, "success"), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived stats (memoized) ──────────────────────────
  const stats = useMemo(() => computeStats(transactions), [transactions]);

  const budgetStatus = useMemo(() => {
    if (!monthlyLimit) return { active: false };
    const used = stats.monthExpense;
    const pct  = Math.min(100, (used / monthlyLimit) * 100);
    const remaining = monthlyLimit - used;
    const exceeded  = used > monthlyLimit;
    const warning   = !exceeded && pct >= 80;
    return {
      active: true, limit: monthlyLimit, used, pct, remaining, exceeded, warning,
      barColor: exceeded ? "var(--danger)" : warning ? "var(--warn)" : "var(--success)",
    };
  }, [stats, monthlyLimit]);

  // Fire modal once when limit is exceeded
  useEffect(() => {
    if (!budgetStatus.active) { modalShownRef.current = false; lastExceedRef.current = 0; return; }
    if (budgetStatus.exceeded) {
      if (!modalShownRef.current && budgetStatus.used > lastExceedRef.current) {
        modalShownRef.current = true; lastExceedRef.current = budgetStatus.used;
        setAlertDismissed(false);
        setTimeout(() => setModal({
          open: true, icon: "🚨", title: "Budget Exceeded!",
          body: `<p>This month you've spent <strong>${fmt(budgetStatus.used)}</strong>, which is <span style="color:var(--danger);font-weight:700;">${fmt(budgetStatus.used - monthlyLimit)} over</span> your <strong>${fmt(monthlyLimit)}</strong> monthly limit.</p><p style="margin-top:10px;color:var(--muted);">No new expenses can be added until next month or you raise your limit.</p>`,
          buttons: [{ label: "Got it!", primary: true }],
        }), 350);
      }
    } else { modalShownRef.current = false; lastExceedRef.current = 0; }
  }, [budgetStatus.exceeded, budgetStatus.used]);

  const isExpenseBlocked = monthlyLimit > 0 && stats.monthExpense >= monthlyLimit;

  const filtered      = useMemo(() => getFiltered(transactions, filter), [transactions, filter]);
  const runningBal    = useMemo(() => getRunningBalances(filtered), [filtered]);
  const editingTx     = editingId ? transactions.find((t) => t.id === editingId) || null : null;

  // ── Global keyboard shortcuts ─────────────────────────
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") { setModal(null); setEditingId(null); }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") document.getElementById("et-submit-trigger")?.click();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Transaction handlers ──────────────────────────────
  function handleSubmit(fields) {
    const errors = validateTx(fields);
    if (errors.length) { fireToast("⚠️ " + errors[0], "warning"); return { success: false }; }

    const amt = parseFloat(fields.amount);
    if (editingId) {
      // Budget check for edit: subtract original
      if (fields.type === "expense" && monthlyLimit) {
        const orig    = transactions.find((t) => t.id === editingId);
        const origAmt = orig?.type === "expense" ? orig.amount : 0;
        const adjUsed = stats.monthExpense - origAmt;
        if (adjUsed + amt > monthlyLimit) {
          const rem = monthlyLimit - adjUsed;
          fireToast(`🔒 Only ₹${n2(Math.max(0,rem))} budget left — this expense is ₹${n2(amt)}.`, "warning");
          return { success: false };
        }
      }
      setTransactions((prev) => prev.map((t) => t.id === editingId
        ? { ...t, ...fields, amount: amt, id: editingId } : t));
      setEditingId(null);
      modalShownRef.current = false;
      fireToast("✅ Transaction updated!", "success");
      return { success: true };
    }

    // Add
    if (fields.type === "expense" && monthlyLimit) {
      if (stats.monthExpense >= monthlyLimit) {
        fireToast("🔒 Monthly limit reached — no expenses allowed!", "warning"); return { success: false };
      }
      if (stats.monthExpense + amt > monthlyLimit) {
        const rem = monthlyLimit - stats.monthExpense;
        fireToast(`🔒 Only ₹${n2(rem)} budget left — this expense is ₹${n2(amt)}.`, "warning");
        return { success: false };
      }
    }

    const entry = { id: Date.now(), type: fields.type, desc: fields.desc.trim(),
      amount: amt, category: fields.category, date: fields.date, created: new Date().toISOString(),
      isRecurring: fields.isRecurring, frequency: fields.frequency, lastProcessed: fields.isRecurring ? fields.date : null };
    setTransactions((prev) => [entry, ...prev]);
    fireToast(fields.type === "income" ? "✅ Income added!" : "✅ Expense logged!", "success");
    return { success: true };
  }

  function handleClearHistory() {
    if (transactions.length === 0) {
      fireToast("⚠️ History is already empty.", "warning");
      return;
    }
    setModal({
      open: true, title: "Clear History",
      body: `<p>Are you sure you want to delete <strong>ALL</strong> transactions?</p><p style="color:var(--danger);margin-top:6px;font-size:.88rem;font-weight:bold;">This action cannot be undone.</p>`,
      buttons: [
        { label: "Cancel" },
        { label: "🗑️ Clear All", primary: true, action: () => {
          setTransactions([]);
          setEditingId(null);
          modalShownRef.current = false;
          fireToast("🗑️ All transactions cleared.", "remove");
        }},
      ],
    });
  }

  function handleDelete(id) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    setModal({
      open: true, title: "Delete Transaction",
      body: `<p>Are you sure you want to delete <strong>"${tx.desc}"</strong>?</p><p style="color:var(--muted);margin-top:6px;font-size:.88rem;">This action cannot be undone.</p>`,
      buttons: [
        { label: "Cancel" },
        { label: "🗑️ Delete", primary: true, action: () => {
          setTransactions((prev) => prev.filter((t) => t.id !== id));
          if (editingId === id) setEditingId(null);
          modalShownRef.current = false;
          fireToast("🗑️ Transaction deleted.", "remove");
        }},
      ],
    });
  }

  function handleSetLimit() {
    const v = parseFloat(limitInput);
    if (!v || v <= 0) { fireToast("⚠️ Enter a valid limit amount.", "warning"); return; }
    setMonthlyLimit(v); modalShownRef.current = false;
    fireToast(`🎯 Limit set to ${fmt(v)}`, "success");
  }

  function handleClearLimit() {
    setMonthlyLimit(0); setLimitInput(""); modalShownRef.current = false;
    fireToast("✅ Budget limit removed.", "success");
  }

  function handleExportCSV() {
    const ok = exportCSV(transactions);
    if (!ok) { fireToast("⚠️ No transactions to export.", "warning"); return; }
    fireToast(`📥 Exported ${transactions.length} transactions.`, "success");
  }

  function toggleTheme() {
    setTheme((t) => t === "dark" ? "light" : "dark");
  }

  const showAlert = !alertDismissed && budgetStatus.active && (budgetStatus.exceeded || budgetStatus.warning);

  return (
    <>
      <div className="et-container">
        {/* Header */}
        <header className="et-header">
          <div className="et-header-left">
            <div className="et-logo">Expense<span>.</span></div>
            <div className="et-date-badge">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="et-header-actions">
            <button className="et-hbtn" style={{ color: "var(--et-bg)", background: "var(--et-accent)", borderColor: "var(--et-accent)", fontWeight: "bold" }} onClick={() => setShowPricing(true)}>⭐ Upgrade to Pro</button>
            <button className="et-hbtn" onClick={() => setShowSubscriptions(true)}>💳 Subscriptions</button>
            <button className="et-hbtn" onClick={() => setShowReport(true)}>📊 Monthly Report</button>
            <button className="et-hbtn" onClick={handleExportCSV}>📥 Export CSV</button>
            <button className="et-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Budget Alert Banner */}
        {showAlert && (
          <div className={`et-alert ${budgetStatus.exceeded ? "exceeded" : "warning"}`}>
            <div className="et-alert-icon">{budgetStatus.exceeded ? "🚨" : "⚠️"}</div>
            <div className="et-alert-txt">
              <div className="et-alert-title">
                {budgetStatus.exceeded ? "Monthly Budget Exceeded!" : "Approaching Budget Limit!"}
              </div>
              <div className="et-alert-sub">
                {budgetStatus.exceeded
                  ? `Spent ${fmt(budgetStatus.used)} — ${fmt(budgetStatus.used - monthlyLimit)} over your ${fmt(monthlyLimit)} limit.`
                  : `${budgetStatus.pct.toFixed(0)}% used — only ${fmt(budgetStatus.remaining)} remaining.`}
              </div>
            </div>
            <button className="et-alert-x" onClick={() => setAlertDismissed(true)}>✕</button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="et-summary">
          {[
            { cls: "bal", label: "Net Balance", val: fmt(stats.balance), icon: "⚖️" },
            { cls: "inc", label: "Total Income",  val: fmt(stats.totalIncome), icon: "📈" },
            { cls: "exp", label: "Total Expenses", val: fmt(stats.totalExpense), icon: "📉" },
          ].map(({ cls, label, val, icon }) => (
            <div key={cls} className={`et-card ${cls}`}>
              <div className="et-card-label">{label}</div>
              <div className="et-card-amount">{val}</div>
              <div className="et-card-icon">{icon}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="et-main-grid">
          {/* LEFT: Form */}
          <TransactionForm
            editingTx={editingTx}
            currentType={currentType}
            setCurrentType={setCurrentType}
            isBlocked={isExpenseBlocked}
            monthlyLimit={monthlyLimit}
            limitInput={limitInput}
            setLimitInput={setLimitInput}
            budgetStatus={budgetStatus}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingId(null)}
            onSetLimit={handleSetLimit}
            onClearLimit={handleClearLimit}
          />

          {/* RIGHT */}
          <div className="et-right-panel">
            {/* Charts */}
            <ChartPanel stats={stats} chartMode={chartMode} setChartMode={setChartMode} theme={theme} />

            {/* Savings Bar */}
            <div className="et-budget-bar">
              <div className="et-budget-header">
                <span>This Month's Savings Rate</span>
                <span>{stats.savingsRate}%</span>
              </div>
              <div className="et-progress-track">
                <div className="et-progress-fill" style={{ width: stats.savingsRate + "%" }} />
              </div>
            </div>

            {/* Filters */}
            <FiltersBar filter={filter} setFilter={setFilter} />

            {/* List */}
            <div>
              <div className="et-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="et-list-title">Transactions</div>
                <button className="et-hbtn" style={{ color: '#ff5e5e', borderColor: 'rgba(255,94,94,0.3)' }} onClick={handleClearHistory} title="Clear all transactions">
                  🗑️ Clear All
                </button>
              </div>
              <TransactionList
                filtered={filtered}
                runningBalances={runningBal}
                onEdit={(id) => { setEditingId(id); document.getElementById("formPanel")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div id="et-toast" className="et-toast" />

      {/* Modal */}
      <Modal modal={modal} onClose={() => setModal(null)} />

      {/* Monthly Report */}
      {showReport && <MonthlyReport txs={transactions} onClose={() => setShowReport(false)} />}

      {/* Subscription Tracker */}
      {showSubscriptions && <SubscriptionTracker subscriptions={subscriptions} setSubscriptions={setSubscriptions} onClose={() => setShowSubscriptions(false)} />}

      {/* Pricing Modal */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
}
