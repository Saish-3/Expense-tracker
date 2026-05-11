/* ═══════════════════════════════════════════════════════════════
   TOAST  (singleton outside React tree)
═══════════════════════════════════════════════════════════════ */
let _toastTimer = null;

export function fireToast(msg, type = "success") {
  const el = document.getElementById("et-toast");
  if (!el) return;
  el.innerHTML = msg; el.className = `et-toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}
