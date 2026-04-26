# Customer Segmentation for Credit Card Customers

Unsupervised machine learning project that segments 8,950 credit card customers into 7 distinct behavioral personas using Gaussian Mixture Models (GMM), with a full business analysis and an interactive React dashboard.

---

## Dataset

**Source:** [Customer Segmentation - Credit Cards (Kaggle)](https://www.kaggle.com/code/des137/customer-segmentation-credit-cards)

- **8,950** credit card holders
- **17 behavioral features** covering balance, purchases, cash advances, payments, credit limit, and tenure

---

## Project Structure

```
├── Customer_Segmentation_Final.ipynb   # Main analysis notebook
├── CC GENERAL.csv                      # Dataset
├── dashboard/                          # React interactive dashboard
│   └── CustomerSegmentationDashboard.jsx
└── README.md
```

---

## Methodology

### Phase 1 — Data Exploration & Preprocessing
- Explored distributions, correlations, and skewness across all 17 features
- **Custom rule-based imputation** for 313 missing `MINIMUM_PAYMENTS` values using tiered credit-limit logic — preserving distributional integrity
- Applied **log1p transformation** to 10 right-skewed features (skewness up to 13.8)

### Phase 2 — Determining Optimal Clusters
Identified k=7 using **5 independent validation methods**, all converging on the same result:

| Method | Finding |
|---|---|
| Elbow (WCSS) | Curve flattens at k=7 |
| KMeans Silhouette | Peaks at **0.4232** (k=7) |
| GMM BIC | Plateaus at k=7 |
| GMM Silhouette | Peaks at **0.4392** (k=7) |
| t-SNE Visual | Clearest separation at k=7 |

**GMM chosen over KMeans** for its soft probabilistic assignments and ability to model elliptical cluster shapes — better suited to overlapping real-world customer behavior.

### Phase 3 — Customer Segmentation
Applied GMM (k=7) and profiled each cluster on **original scale** values for interpretability.

### Phase 4 — Visualization & Analysis
- PCA and t-SNE scatter plots
- Behavioral comparison bar charts
- Normalized behavioral fingerprint heatmap
- Segment size distribution (donut chart)
- Full payment rate ranking

### Phase 5 — Business Insights & Recommendations
Segment-specific strategies covering retention, risk mitigation, and revenue optimization.

---

## The 7 Customer Segments

| Segment | Size | Risk | Key Characteristic |
|---|---|---|---|
| 💎 Premium Spenders | 9.0% | Medium | High balance, large one-off purchases |
| 🛒 Installment Buyers | 20.0% | Low | Regular buyers, installment-focused |
| 😴 Dormant Revolvers | 22.8% | High | Highest balance, near-zero purchases |
| 🏆 VIP High-Value Shoppers | 5.1% | Low | Highest purchases, best payment rate |
| 🛍️ One-Time Shoppers | 11.9% | Low | Infrequent but large purchases |
| ⚠️ Cash Advance Dependent | 11.4% | Very High | Heavy cash advance reliance |
| 🐣 Low-Activity Savers | 8.7% | Very Low | Minimal spend, disciplined payer |

---

## Key Results

- **Silhouette Score:** 0.439 (GMM)
- **Optimal Clusters:** k = 7
- **Model:** Gaussian Mixture Model with soft probabilistic assignments
- **Risk concentration:** ~34% of customers in high-risk segments (Cash Advance Dependent + Dormant Revolvers)
- **Revenue concentration:** VIP Shoppers (5%) drive disproportionate interchange revenue

---

## Interactive Dashboard

Built with **React** and **Recharts** — 4 tabs:

- **Overview** — segment cards, donut distribution, behavioral bar chart
- **Segments** — detailed profile per segment with radar chart and recommendations
- **Compare** — side-by-side horizontal bar rankings across key metrics
- **Insights** — portfolio-level business conclusions and methodology summary

### Running the Dashboard

```bash
npm create vite@5 my-dashboard -- --template react
cd my-dashboard
npm install recharts
```

Replace `src/App.jsx` with `CustomerSegmentationDashboard.jsx`, then:

```bash
npm run dev
```

---

## Tech Stack

- **Python** — pandas, numpy, scikit-learn, matplotlib, seaborn
- **Clustering** — Gaussian Mixture Models, KMeans
- **Dimensionality Reduction** — PCA, t-SNE
- **Dashboard** — React, Recharts

---

## Portfolio-Level Business Insights

1. **Revenue Concentration** — VIP Shoppers (~5%) likely generate a disproportionate share of fee and interchange revenue. Retention is critical.
2. **Risk Concentration** — 34% of customers sit in high-risk segments requiring active monitoring and early intervention.
3. **Growth Opportunity** — Installment Buyers and Low-Activity Savers are low-risk and convertible to higher-value customers.
4. **Churn Risk** — One-Time Shoppers show low engagement and are most vulnerable to switching.
5. **Personalisation ROI** — A one-size-fits-all approach is ineffective. Seven segments demand seven distinct strategies.
