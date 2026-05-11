/* ═══════════════════════════════════════════════════════════════
   PURE HELPERS  (no side-effects, no state)
═══════════════════════════════════════════════════════════════ */
export function parseDate(str) {
  const parts = str.split("-");
  if (parts.length !== 3) return new Date(str);
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

export function sameMonth(dateStr, ref) {
  const d = parseDate(dateStr);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

export function inPeriod(dateStr, period, from, to) {
  const d = parseDate(dateStr);
  const now = new Date();
  if (period === "month") return sameMonth(dateStr, now);
  if (period === "3months") {
    const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 3); cutoff.setDate(1);
    return d >= cutoff;
  }
  if (period === "year") return d.getFullYear() === now.getFullYear();
  if (period === "custom" && from && to) {
    const f = parseDate(from), t2 = parseDate(to); t2.setHours(23, 59, 59);
    return d >= f && d <= t2;
  }
  return true;
}

export function fmt(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function n2(n) {
  return (+n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function computeStats(transactions) {
  const now = new Date();
  let totalIncome = 0, totalExpense = 0, monthIncome = 0, monthExpense = 0;
  const catMap = {}, monthMap = {};
  transactions.forEach((t) => {
    const amt = t.amount;
    if (t.type === "income") {
      totalIncome += amt;
      if (sameMonth(t.date, now)) monthIncome += amt;
    } else {
      totalExpense += amt;
      catMap[t.category] = (catMap[t.category] || 0) + amt;
      if (sameMonth(t.date, now)) monthExpense += amt;
    }
    const d = parseDate(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
    if (t.type === "income") monthMap[key].income += amt;
    else monthMap[key].expense += amt;
  });
  const savingsRate = monthIncome > 0
    ? Math.max(0, Math.min(100, Math.round((monthIncome - monthExpense) / monthIncome * 100))) : 0;
  const catSorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense,
    monthIncome, monthExpense, savingsRate, catMap, catSorted, monthMap };
}

export function getFiltered(transactions, filter) {
  let list = [...transactions];
  if (filter.type !== "all") list = list.filter((t) => t.type === filter.type);
  if (filter.period !== "all") list = list.filter((t) => inPeriod(t.date, filter.period, filter.dateFrom, filter.dateTo));
  if (filter.search.trim()) {
    const q = filter.search.toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  list.sort((a, b) => {
    let cmp = 0;
    if (filter.sortBy === "amount") cmp = a.amount - b.amount;
    else if (filter.sortBy === "category") cmp = a.category.localeCompare(b.category);
    else cmp = parseDate(a.date) - parseDate(b.date);
    return filter.sortDir === "asc" ? cmp : -cmp;
  });
  return list;
}

export function getRunningBalances(list) {
  const sorted = [...list].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  let running = 0;
  const map = {};
  sorted.forEach((t) => { running += t.type === "income" ? t.amount : -t.amount; map[t.id] = running; });
  return map;
}

export function validateTx(fields) {
  const errors = [];
  if (!fields.desc?.trim()) errors.push("Description is required.");
  const amt = parseFloat(fields.amount);
  if (isNaN(amt) || amt <= 0) errors.push("Enter a valid positive amount.");
  if (amt > 10000000) errors.push("Amount seems unrealistically large.");
  if (!fields.date) errors.push("Date is required.");
  return errors;
}

export function exportCSV(transactions) {
  if (!transactions.length) return false;
  const headers = ["Date", "Type", "Description", "Category", "Amount (₹)"];
  const rows = transactions.map((t) => [
    t.date, t.type, `"${t.desc.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`, t.amount.toFixed(2),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `expenses_${new Date().toISOString().slice(0, 10)}.csv`;
  a.style.display = "none"; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  return true;
}
