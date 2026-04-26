import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from "recharts";

const SEGMENTS = [
  {
    id: 0, name: "Premium Spenders", short: "Premium", emoji: "💎",
    count: 804, pct: 9.0,
    color: "#c084fc",
    risk: "Medium", value: "High",
    balance: 4820, purchases: 2740, cashAdvance: 420, creditLimit: 8900,
    payments: 3100, fullPayPct: 18, purchaseFreq: 0.51, cashAdvFreq: 0.09,
    desc: "High balance, large one-off purchases, above-average credit limit.",
    reco: "Monitor balance-to-limit ratio. Offer balance transfer promotions. Reward large one-off purchases with bonus points.",
    tags: ["High Balance", "One-Off Buyer", "Moderate Risk"]
  },
  {
    id: 1, name: "Installment Buyers", short: "Installment", emoji: "🛒",
    count: 1786, pct: 20.0,
    color: "#34d399",
    risk: "Low", value: "Medium",
    balance: 710, purchases: 2190, cashAdvance: 95, creditLimit: 4300,
    payments: 1980, fullPayPct: 12, purchaseFreq: 0.74, cashAdvFreq: 0.04,
    desc: "Low balance, regular buyers who prefer installment purchases.",
    reco: "Promote 0% installment offers. Partner with electronics & appliance retailers. Introduce flexible EMI options.",
    tags: ["Installment Focused", "Low Risk", "Active Buyer"]
  },
  {
    id: 2, name: "Dormant Revolvers", short: "Dormant", emoji: "😴",
    count: 2039, pct: 22.8,
    color: "#fb923c",
    risk: "High", value: "Low",
    balance: 5480, purchases: 28, cashAdvance: 310, creditLimit: 5900,
    payments: 890, fullPayPct: 3, purchaseFreq: 0.06, cashAdvFreq: 0.12,
    desc: "High balance carried month-to-month, virtually no purchases — carrying old debt.",
    reco: "Offer debt restructuring plans. Engage with financial wellness tools. Introduce 'fresh start' reduced-APR incentive.",
    tags: ["Debt Carrier", "High Risk", "Inactive"]
  },
  {
    id: 3, name: "VIP Shoppers", short: "VIP", emoji: "🏆",
    count: 458, pct: 5.1,
    color: "#fbbf24",
    risk: "Low", value: "Very High",
    balance: 2960, purchases: 8740, cashAdvance: 180, creditLimit: 12400,
    payments: 9200, fullPayPct: 42, purchaseFreq: 0.92, cashAdvFreq: 0.03,
    desc: "Highest purchases, highest credit limits, most frequent transactions, best full-payment rate.",
    reco: "Enroll in premium rewards program. Proactively offer credit limit upgrades. Provide concierge support to prevent churn.",
    tags: ["Top Spender", "Low Risk", "High Frequency"]
  },
  {
    id: 4, name: "One-Time Shoppers", short: "One-Time", emoji: "🛍️",
    count: 1066, pct: 11.9,
    color: "#60a5fa",
    risk: "Low", value: "Medium",
    balance: 1940, purchases: 2580, cashAdvance: 130, creditLimit: 5200,
    payments: 2240, fullPayPct: 15, purchaseFreq: 0.22, cashAdvFreq: 0.05,
    desc: "Moderate balance, infrequent but large one-off purchases.",
    reco: "Run reactivation campaigns tied to seasonal events. Offer limited-time cashback to trigger transactions.",
    tags: ["Sporadic Buyer", "Low Risk", "Growth Potential"]
  },
  {
    id: 5, name: "Cash Advance Dep.", short: "Cash Adv.", emoji: "⚠️",
    count: 1021, pct: 11.4,
    color: "#f87171",
    risk: "Very High", value: "Low",
    balance: 3760, purchases: 110, cashAdvance: 3840, creditLimit: 5100,
    payments: 1870, fullPayPct: 5, purchaseFreq: 0.08, cashAdvFreq: 0.41,
    desc: "Minimal purchases, heavy reliance on cash advances — financial distress signal.",
    reco: "Implement enhanced credit monitoring. Offer personal loan alternatives at lower rates. Limit credit exposure.",
    tags: ["Cash Reliant", "Very High Risk", "Distress Signal"]
  },
  {
    id: 6, name: "Low-Activity Savers", short: "Savers", emoji: "🐣",
    count: 776, pct: 8.7,
    color: "#a3e635",
    risk: "Very Low", value: "Low→Medium",
    balance: 320, purchases: 490, cashAdvance: 40, creditLimit: 2800,
    payments: 510, fullPayPct: 31, purchaseFreq: 0.19, cashAdvFreq: 0.02,
    desc: "Low balance, minimal spending, lower credit limits, but excellent payment discipline.",
    reco: "Offer credit limit increase to reward discipline. Run entry-level cashback campaigns. Cross-sell savings or loan products.",
    tags: ["Disciplined Payer", "Very Low Risk", "Growth Opportunity"]
  }
];

const RISK_COLOR = {
  "Very Low": "#a3e635", "Low": "#34d399", "Medium": "#fbbf24",
  "High": "#fb923c", "Very High": "#f87171"
};

const radarKeys = ["Balance", "Purchases", "Cash Adv.", "Credit Limit", "Full Pay %", "Purchase Freq"];

function normalize(segments, key) {
  const vals = segments.map(s => s[key]);
  const max = Math.max(...vals);
  return vals.map(v => +(v / max * 100).toFixed(1));
}

function buildRadar(seg) {
  const all = SEGMENTS;
  const keys = ["balance", "purchases", "cashAdvance", "creditLimit", "fullPayPct", "purchaseFreq"];
  return radarKeys.map((label, i) => {
    const max = Math.max(...all.map(s => s[keys[i]]));
    return { label, value: +(seg[keys[i]] / max * 100).toFixed(1) };
  });
}

const pieData = SEGMENTS.map(s => ({ name: s.short, value: s.count, color: s.color }));

const barData = SEGMENTS.map(s => ({
  name: s.short,
  Balance: s.balance,
  Purchases: s.purchases,
  "Cash Adv": s.cashAdvance,
  color: s.color
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || "#e2e8f0", fontSize: 13, margin: "2px 0" }}>
            {p.name}: <strong>${p.value?.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [selected, setSelected] = useState(SEGMENTS[3]);
  const [activeTab, setActiveTab] = useState("overview");

  const totalCustomers = SEGMENTS.reduce((a, b) => a + b.count, 0);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #080e1a; }
        body { margin: 0 !important; padding: 0 !important; }
      `}</style>
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#080e1a",
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      color: "#e2e8f0",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0,
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "20px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        flexShrink: 0
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#fbbf24", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>
            Credit Card Analytics
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: "normal", color: "#f8fafc", letterSpacing: -0.5 }}>
            Customer Segmentation
          </h1>
          <p style={{ margin: "4px 0 0", color: "#bfc6cd", fontSize: 13 }}>
            CC GENERAL Dataset · 8,950 customers · 7 behavioral segments · GMM k=7
          </p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["8,950", "Total Customers"], ["7", "Segments"], ["0.439", "Silhouette Score"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, color: "#fbbf24", fontWeight: "bold", fontFamily: "monospace" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#bfc6cd", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 0, padding: "0 32px", background: "#0d1526", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
        {[["overview", "Overview"], ["segments", "Segments"], ["compare", "Compare"], ["insights", "Insights"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "14px 20px", fontSize: 18, letterSpacing: 0.5,
            color: activeTab === key ? "#fbbf24" : "#8f9aa9",
            borderBottom: activeTab === key ? "2px solid #fbbf24" : "2px solid transparent",
            transition: "all 0.2s", fontFamily: "Georgia, serif"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "24px 32px", flex: 1, overflowY: "auto", overflowX: "hidden", width: "100%" }}>

        {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
        {activeTab === "overview" && (
          <div>
            {/* Segment cards row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 32 }}>
              {SEGMENTS.map(seg => (
                <div key={seg.id} onClick={() => { setSelected(seg); setActiveTab("segments"); }}
                  style={{
                    background: "#0f172a", border: `1px solid ${selected.id === seg.id ? seg.color : "#1e293b"}`,
                    borderRadius: 10, padding: "14px 12px", cursor: "pointer",
                    transition: "all 0.2s", borderTop: `3px solid ${seg.color}`
                  }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{seg.emoji}</div>
                  <div style={{ fontSize: 18, color: "#f8fafc", marginBottom: 4, lineHeight: 1.3 }}>{seg.name}</div>
                  <div style={{ fontSize: 20, color: seg.color, fontWeight: "bold", fontFamily: "monospace" }}>{seg.pct}%</div>
                  <div style={{ fontSize: 14, color: "#f8fafc", marginTop: 2 }}>{seg.count.toLocaleString()} customers</div>
                  <div style={{ marginTop: 8, fontSize: 10, color: RISK_COLOR[seg.risk], background: "#1e293b", borderRadius: 4, padding: "2px 6px", display: "inline-block" }}>
                    {seg.risk} Risk
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
              {/* Pie */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Segment Distribution</div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      dataKey="value" paddingAngle={2}
                      label={({ name, pct }) => `${name}`} labelLine={false}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="#080e1a" strokeWidth={2} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [v.toLocaleString(), "Customers"]}
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                      itemStyle={{ color: "#ffffff" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {SEGMENTS.map(s => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 11, color: "#64748b" }}>{s.short}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Avg Balance vs Purchases vs Cash Advances ($)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} barSize={10} barGap={3}>
                    <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Balance" fill="#c084fc" radius={[3,3,0,0]} />
                    <Bar dataKey="Purchases" fill="#34d399" radius={[3,3,0,0]} />
                    <Bar dataKey="Cash Adv" fill="#f87171" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {[["Balance", "#c084fc"], ["Purchases", "#34d399"], ["Cash Adv", "#f87171"]].map(([l, c]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                      <span style={{ fontSize: 11, color: "#64748b" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ SEGMENTS TAB ══════════════════ */}
        {activeTab === "segments" && (
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "sticky", top: 0 }}>
              {SEGMENTS.map(seg => (
                <button key={seg.id} onClick={() => setSelected(seg)} style={{
                  background: selected.id === seg.id ? "#1e293b" : "#0f172a",
                  border: `1px solid ${selected.id === seg.id ? seg.color : "#1e293b"}`,
                  borderLeft: `3px solid ${selected.id === seg.id ? seg.color : "transparent"}`,
                  borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s"
                }}>
                  <span style={{ fontSize: 20 }}>{seg.emoji}</span>
                  <div>
                    <div style={{ fontSize: 16, color: "#f8fafc" }}>{seg.name}</div>
                    <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>{seg.count.toLocaleString()} · {seg.pct}%</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div>
              <div style={{ background: "#0f172a", border: `1px solid #1e293b`, borderTop: `3px solid ${selected.color}`, borderRadius: 12, padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{selected.emoji}</div>
                    <h2 style={{ margin: 0, fontSize: 22, color: selected.color, fontWeight: "normal" }}>{selected.name}</h2>
                    <p style={{ margin: "6px 0 0", color: "#cbd5e1", fontSize: 14 }}>{selected.desc}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ background: "#1e293b", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 18, color: selected.color, fontFamily: "monospace", fontWeight: "bold" }}>{selected.count.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1 }}>Customers</div>
                    </div>
                    <div style={{ background: "#1e293b", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 18, color: RISK_COLOR[selected.risk], fontFamily: "monospace", fontWeight: "bold" }}>{selected.risk}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1 }}>Risk Level</div>
                    </div>
                    <div style={{ background: "#1e293b", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 18, color: "#fbbf24", fontFamily: "monospace", fontWeight: "bold" }}>{selected.value}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1 }}>Business Value</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  {selected.tags.map(t => (
                    <span key={t} style={{ background: "#1e293b", border: `1px solid ${selected.color}33`, color: selected.color, fontSize: 12, borderRadius: 20, padding: "4px 12px" }}>{t}</span>
                  ))}
                </div>

                {/* Metrics grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
                  {[
                    ["Avg Balance", `$${selected.balance.toLocaleString()}`],
                    ["Avg Purchases", `$${selected.purchases.toLocaleString()}`],
                    ["Cash Advance", `$${selected.cashAdvance.toLocaleString()}`],
                    ["Credit Limit", `$${selected.creditLimit.toLocaleString()}`],
                    ["Full Pay %", `${selected.fullPayPct}%`],
                    ["Purchase Freq", selected.purchaseFreq.toFixed(2)],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background: "#080e1a", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 16, color: selected.color, fontFamily: "monospace", fontWeight: "bold" }}>{val}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Radar + recommendation */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#cbd5e1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Behavioral Profile</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={buildRadar(selected)}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="label" tick={{ fill: "#e2e8f0", fontSize: 12 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name={selected.name} dataKey="value" stroke={selected.color} fill={selected.color} fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#cbd5e1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Strategic Recommendations</div>
                    <div style={{ background: "#080e1a", border: "1px solid #1e293b", borderRadius: 8, padding: 16 }}>
                      {selected.reco.split(". ").filter(Boolean).map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: selected.color, marginTop: 6, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>{r}.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ COMPARE TAB ══════════════════ */}
        {activeTab === "compare" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Horizontal bar comparisons */}
            {[
              { key: "balance", label: "Average Balance ($)", max: 6000 },
              { key: "purchases", label: "Average Purchases ($)", max: 10000 },
              { key: "cashAdvance", label: "Average Cash Advance ($)", max: 5000 },
              { key: "fullPayPct", label: "Full Payment % (avg)", max: 50 },
            ].map(({ key, label, max }) => (
              <div key={key} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 18, color: "#f8fafc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{label}</div>
                {SEGMENTS.sort((a, b) => b[key] - a[key]).map(seg => (
                  <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 130, fontSize: 16, color: "#cfd4da", textAlign: "right", flexShrink: 0 }}>
                      {seg.emoji} {seg.short}
                    </div>
                    <div style={{ flex: 1, background: "#1e293b", borderRadius: 4, height: 22, overflow: "hidden" }}>
                      <div style={{
                        width: `${(seg[key] / max * 100).toFixed(1)}%`, height: "100%",
                        background: `linear-gradient(90deg, ${seg.color}99, ${seg.color})`,
                        borderRadius: 4, transition: "width 0.5s ease",
                        display: "flex", alignItems: "center", paddingLeft: 8
                      }}>
                        <span style={{ fontSize: 13, color: "#fff", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                          {key === "fullPayPct" ? `${seg[key]}%` : `$${seg[key].toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════ INSIGHTS TAB ══════════════════ */}
        {activeTab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 8 }}>
              {[
                { icon: "💰", title: "Revenue Concentration", color: "#fbbf24",
                  text: "VIP Shoppers (~5%) likely generate a disproportionate share of interchange and fee revenue. Losing even a small fraction has outsized financial impact." },
                { icon: "⚠️", title: "Risk Concentration", color: "#f87171",
                  text: "Cash Advance Dependent (11%) and Dormant Revolvers (23%) together represent ~34% of the portfolio. Active monitoring and early intervention are essential." },
                { icon: "🌱", title: "Growth Opportunity", color: "#34d399",
                  text: "Installment Buyers (20%) and Low-Activity Savers (9%) are low-risk segments that can be converted to higher-value customers through targeted engagement." },
                { icon: "🔄", title: "Churn Risk", color: "#60a5fa",
                  text: "One-Time Shoppers (12%) show low engagement and are most vulnerable to switching to a competitor. Periodic reactivation campaigns are critical." },
                { icon: "🎯", title: "Personalization ROI", color: "#c084fc",
                  text: "A one-size-fits-all approach is ineffective. These 7 segments have fundamentally different needs, requiring tailored product design and communication." },
                { icon: "📊", title: "Portfolio Balance", color: "#a3e635",
                  text: "The largest segment (Dormant Revolvers at 23%) is also one of the riskiest. The portfolio is skewed toward passive, high-balance customers — rebalancing is needed." },
              ].map(({ icon, title, color, text }) => (
                <div key={title} style={{ background: "#0f172a", border: "1px solid #1e293b", borderLeft: `3px solid ${color}`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 18, color, fontWeight: "bold", marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 15, color: "#c6cfd7", lineHeight: 1.6 }}>{text}</div>
                </div>
              ))}
            </div>

            {/* Methodology summary */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "22px 28px" }}>
              <div style={{ fontSize: 16, color: "#f8fafc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Methodology Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {[
                  ["Elbow Method", "WCSS flattens at k=7", "#fbbf24"],
                  ["KMeans Silhouette", "Peaks at 0.4232 (k=7)", "#34d399"],
                  ["GMM BIC", "Plateaus at k=7", "#60a5fa"],
                  ["GMM Silhouette", "Peaks at 0.4392 (k=7)", "#c084fc"],
                  ["t-SNE Visual", "Best separation at k=7", "#fb923c"],
                ].map(([title, detail, color]) => (
                  <div key={title} style={{ background: "#080e1a", border: "1px solid #1e293b", borderTop: `2px solid ${color}`, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ fontSize: 15, color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#f8fafc" }}>{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}