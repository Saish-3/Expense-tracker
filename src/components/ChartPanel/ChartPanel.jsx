import { useRef, useEffect, useCallback } from "react";
import { drawMainChart, drawCatChart } from "../../charts";

/* ═══════════════════════════════════════════════════════════════
   CHART PANEL COMPONENT
═══════════════════════════════════════════════════════════════ */
function ChartPanel({ stats, chartMode, setChartMode, theme }) {
  const mainRef = useRef(null);
  const catRef  = useRef(null);
  const prevMainRef = useRef(null);
  const prevCatRef  = useRef(null);
  const dark = theme === "dark";

  const redraw = useCallback(() => {
    if (mainRef.current) drawMainChart(mainRef.current, stats, chartMode, dark, prevMainRef);
    if (catRef.current)  drawCatChart(catRef.current, stats, chartMode, dark, prevCatRef);
  }, [stats, chartMode, dark]);

  useEffect(() => { redraw(); }, [redraw]);

  useEffect(() => {
    let t = null;
    const handler = () => { clearTimeout(t); t = setTimeout(redraw, 180); };
    window.addEventListener("resize", handler);
    return () => { window.removeEventListener("resize", handler); clearTimeout(t); };
  }, [redraw]);

  const mainLabel = chartMode === "line" ? "Income & Expense Trend" : "Monthly Income vs Expenses";

  return (
    <div className="et-chart-panel">
      <div className="et-chart-header">
        <div className="et-chart-title">Analytics</div>
        <div className="et-chart-tabs">
          {[["bar","Monthly"],["line","Trend"],["donut","Category"]].map(([m, label]) => (
            <button key={m} className={`et-chart-tab${chartMode === m ? " active" : ""}`}
              onClick={() => { prevMainRef.current = null; prevCatRef.current = null; setChartMode(m); }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="et-charts-grid">
        <div>
          <div className="et-chart-box-title">{mainLabel}</div>
          <div className="et-chart-wrap"><canvas ref={mainRef} /></div>
        </div>
        <div>
          <div className="et-chart-box-title">Expense by Category</div>
          <div className="et-chart-wrap"><canvas ref={catRef} /></div>
        </div>
      </div>
    </div>
  );
}

export default ChartPanel;
