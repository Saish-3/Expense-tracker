import { PALETTE, ANIM_MS } from "../constants";

const animRefs = { main: null, cat: null };

function animateTo(id, fromPcts, toPcts, drawFn) {
  if (animRefs[id]) cancelAnimationFrame(animRefs[id]);
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / ANIM_MS);
    const ease = 1 - Math.pow(1 - t, 3);
    const current = fromPcts.map((f, i) => f + (toPcts[i] - f) * ease);
    drawFn(current);
    if (t < 1) animRefs[id] = requestAnimationFrame(frame);
  }
  animRefs[id] = requestAnimationFrame(frame);
}

function setupCanvas(canvas) {
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const wrapW = wrap.clientWidth || 400;
  const w = Math.max(wrapW, 400), h = wrap.clientHeight || 220;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + "px"; canvas.style.height = h + "px";
  const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
  return { ctx, W: w, H: h };
}

function getClr(dark) {
  return {
    grid: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
    tick: dark ? "#6b6b85" : "#8888a0",
    bg:   dark ? "#1c1c28" : "#f0f0f8",
    text: dark ? "#f0ede8" : "#1a1a2e",
    empty:dark ? "#4a4a60" : "#b0b0c8",
  };
}

function drawRoundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getLast6Months() {
  const res = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
    res.push({
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    });
  }
  return res;
}

export function drawMainChart(canvas, stats, mode, dark, prevRef) {
  if (!canvas) return;
  const { ctx, W, H } = setupCanvas(canvas);
  const PAD = { top: 24, right: 20, bottom: 38, left: 60 };
  const CW = W - PAD.left - PAD.right, CH = H - PAD.top - PAD.bottom;
  const c = getClr(dark);
  const months = getLast6Months();
  const incData = months.map((m) => (stats.monthMap[m.key] || {}).income || 0);
  const expData = months.map((m) => (stats.monthMap[m.key] || {}).expense || 0);
  const maxVal = Math.max(...incData, ...expData, 1);
  const allPcts = [...incData.map((v) => v / maxVal), ...expData.map((v) => v / maxVal)];
  const prevAll = prevRef.current || allPcts.map(() => 0);
  prevRef.current = allPcts;

  function render(pcts) {
    ctx.clearRect(0, 0, W, H);
    const iP = pcts.slice(0, months.length), eP = pcts.slice(months.length);
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + CH - (CH / 4 * i);
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + CW, y); ctx.stroke();
      const v = Math.round(maxVal / 4 * i);
      ctx.fillStyle = c.tick; ctx.font = "10px DM Sans,sans-serif"; ctx.textAlign = "right";
      ctx.fillText(v >= 1000 ? (v / 1000).toFixed(0) + "k" : v, PAD.left - 6, y + 4);
    }
    const step = CW / months.length;
    if (mode === "line") {
      [{ pcts: iP, color: "#4ecb71", fill: "rgba(78,203,113,0.10)" },
       { pcts: eP, color: "#ff5e5e", fill: "rgba(255,94,94,0.08)" }].forEach(({ pcts: pp, color, fill }) => {
        const pts = pp.map((p, i) => ({ x: PAD.left + step * i + step / 2, y: PAD.top + CH - p * CH }));
        ctx.beginPath(); ctx.moveTo(pts[0].x, PAD.top + CH);
        pts.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length - 1].x, PAD.top + CH);
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
        pts.forEach((p) => {
          ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();
          ctx.strokeStyle = c.bg; ctx.lineWidth = 2; ctx.stroke();
        });
      });
    } else {
      const bw = step * 0.32, gap = step * 0.04;
      iP.forEach((p, i) => {
        const x = PAD.left + step * i + gap, bh = Math.max(2, p * CH), y = PAD.top + CH - bh;
        drawRoundRect(ctx, x, y, bw, bh, 4); ctx.fillStyle = "rgba(78,203,113,0.82)"; ctx.fill();
      });
      eP.forEach((p, i) => {
        const x = PAD.left + step * i + bw + gap * 3, bh = Math.max(2, p * CH), y = PAD.top + CH - bh;
        drawRoundRect(ctx, x, y, bw, bh, 4); ctx.fillStyle = "rgba(255,94,94,0.82)"; ctx.fill();
      });
    }
    ctx.fillStyle = c.tick; ctx.font = "11px DM Sans,sans-serif"; ctx.textAlign = "center";
    months.forEach((m, i) => ctx.fillText(m.label, PAD.left + step * i + step / 2, PAD.top + CH + 18));
    const lx = PAD.left;
    [{ color: mode === "line" ? "#4ecb71" : "rgba(78,203,113,0.82)", label: "Income" },
     { color: mode === "line" ? "#ff5e5e" : "rgba(255,94,94,0.82)", label: "Expense" }].forEach(({ color, label }, i) => {
      const x = lx + i * 80; ctx.fillStyle = color; ctx.fillRect(x, H - 14, 10, 10);
      ctx.fillStyle = c.tick; ctx.font = "10px DM Sans,sans-serif"; ctx.textAlign = "left";
      ctx.fillText(label, x + 13, H - 5);
    });
  }
  animateTo("main", prevAll, allPcts, render);
}

export function drawCatChart(canvas, stats, mode, dark, prevRef) {
  if (!canvas) return;
  const { ctx, W, H } = setupCanvas(canvas);
  const c = getClr(dark);
  const cats = stats.catSorted;
  if (!cats.length) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = c.empty; ctx.font = "13px DM Sans,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("No expenses yet", W / 2, H / 2); return;
  }
  const vals = cats.map(([, v]) => v);
  const total = vals.reduce((s, v) => s + v, 0);
  const prevVals = prevRef.current || vals.map(() => 0);
  prevRef.current = vals;

  if (mode === "donut") {
    const pcts = vals.map((v) => v / total);
    const prevP = prevVals.map((v) => v / total);
    animateTo("cat", prevP, pcts, (currentP) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.4, cy = H / 2, outerR = Math.min(cx, cy) * 0.82, innerR = outerR * 0.56;
      let angle = -Math.PI / 2;
      currentP.forEach((p, i) => {
        const slice = p * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, outerR, angle, angle + slice);
        ctx.closePath(); ctx.fillStyle = PALETTE[i % PALETTE.length]; ctx.fill();
        ctx.strokeStyle = c.bg; ctx.lineWidth = 2; ctx.stroke(); angle += slice;
      });
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.fillStyle = c.bg; ctx.fill();
      ctx.fillStyle = c.text; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "bold 12px DM Sans,sans-serif";
      ctx.fillText("₹" + (total >= 1000 ? (total / 1000).toFixed(0) + "k" : Math.round(total)), cx, cy);
      const maxLeg = Math.min(cats.length, 6), lx = W * 0.72, startY = H / 2 - (maxLeg * 18) / 2;
      cats.slice(0, maxLeg).forEach(([cat], i) => {
        const name = cat.split(" ").slice(1).join(" ") || cat;
        ctx.fillStyle = PALETTE[i % PALETTE.length]; ctx.fillRect(lx, startY + i * 20, 10, 10);
        ctx.fillStyle = c.tick; ctx.font = "10px DM Sans,sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText(name.length > 10 ? name.slice(0, 10) + "…" : name, lx + 13, startY + i * 20 + 9);
      });
    });
  } else {
    const topN = cats.slice(0, 7), maxVal = topN[0][1];
    const prevN = prevVals.slice(0, topN.length), curN = topN.map(([, v]) => v);
    const PAD = { top: 12, right: 60, bottom: 10, left: 10 };
    const labelW = 88, barW = W - PAD.left - PAD.right - labelW;
    const rowH = Math.floor((H - PAD.top - PAD.bottom) / topN.length);
    animateTo("cat", prevN.map((v) => v / maxVal), curN.map((v) => v / maxVal), (pcts) => {
      ctx.clearRect(0, 0, W, H);
      pcts.forEach((p, i) => {
        const y = PAD.top + i * rowH;
        const name = topN[i][0].split(" ").slice(1).join(" ") || topN[i][0];
        const val = topN[i][1];
        ctx.fillStyle = c.tick; ctx.font = "10px DM Sans,sans-serif";
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(name.length > 12 ? name.slice(0, 12) + "…" : name, PAD.left + labelW, y + rowH * 0.5);
        const bh = rowH * 0.58, bx = PAD.left + labelW + 6;
        const by = y + (rowH - bh) / 2, bwActual = Math.max(4, p * barW);
        drawRoundRect(ctx, bx, by, bwActual, bh, 3);
        ctx.fillStyle = PALETTE[i % PALETTE.length]; ctx.fill();
        const dv = val >= 1000 ? "₹" + (val / 1000).toFixed(0) + "k" : "₹" + Math.round(val);
        ctx.fillStyle = c.text; ctx.font = "10px DM Sans,sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(dv, bx + bwActual + 6, y + rowH * 0.5);
      });
    });
  }
}
