import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { PALETTE } from "../../constants";

/* ═══════════════════════════════════════════════════════════════
   CHART PANEL COMPONENT
═══════════════════════════════════════════════════════════════ */
function ChartPanel({ stats, chartMode, setChartMode, theme }) {
  const dark = theme === "dark";

  // Prepare data for Monthly Income vs Expense Chart
  const mainData = useMemo(() => {
    const res = [];
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const monthStats = stats.monthMap[key] || { income: 0, expense: 0 };
      res.push({
        name: label,
        Income: monthStats.income || 0,
        Expense: monthStats.expense || 0,
      });
    }
    return res;
  }, [stats]);

  // Prepare data for Category Pie Chart
  const catData = useMemo(() => {
    return stats.catSorted.map(([name, value]) => ({
      name: name.split(" ").slice(1).join(" ") || name, // Strip icon if any
      value
    }));
  }, [stats]);

  const mainLabel = chartMode === "line" ? "Income & Expense Trend" : "Monthly Income vs Expenses";

  const tooltipStyle = {
    backgroundColor: dark ? '#1c1c28' : '#fff',
    borderColor: dark ? '#333' : '#eee',
    color: dark ? '#fff' : '#000',
    borderRadius: '8px'
  };

  return (
    <div className="et-chart-panel">
      <div className="et-chart-header">
        <div className="et-chart-title">Analytics</div>
        <div className="et-chart-tabs">
          {[["bar", "Monthly"], ["line", "Trend"], ["donut", "Category"]].map(([m, label]) => (
            <button key={m} className={`et-chart-tab${chartMode === m ? " active" : ""}`}
              onClick={() => setChartMode(m)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="et-charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Chart: Bar or Line */}
        <div style={{ minWidth: 0 }}>
          <div className="et-chart-box-title">{mainLabel}</div>
          <div className="et-chart-wrap" style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'line' ? (
                <LineChart data={mainData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#333" : "#eee"} vertical={false} />
                  <XAxis dataKey="name" stroke={dark ? "#8888a0" : "#666"} tickLine={false} axisLine={false} />
                  <YAxis stroke={dark ? "#8888a0" : "#666"} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Income" stroke="#4ecb71" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Expense" stroke="#ff5e5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={mainData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#333" : "#eee"} vertical={false} />
                  <XAxis dataKey="name" stroke={dark ? "#8888a0" : "#666"} tickLine={false} axisLine={false} />
                  <YAxis stroke={dark ? "#8888a0" : "#666"} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? '#2a2a35' : '#f5f5f5' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Income" fill="#4ecb71" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="#ff5e5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div style={{ minWidth: 0 }}>
          <div className="et-chart-box-title">Expense by Category</div>
          <div className="et-chart-wrap" style={{ height: 260, width: '100%', position: 'relative' }}>
            {catData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: dark ? '#8888a0' : '#666' }}>
                No expenses yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {catData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipStyle} formatter={(val) => `₹${val}`} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartPanel;
