import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const markdownContent = String.raw`
# Complete Investment Management Tool
## Full Specification & Production‑Ready Blueprint
**Version:** 1.0 – Bonds, ETFs, Mutual Funds as Separate Vehicles

### Table of Contents
1. Introduction & Scope
2. User Profiling & Risk Scoring
3. Geographic Tilt Assessment
4. Asset Universe & Vehicle Definitions
5. Strategic Model Portfolios by Risk Score
6. Goal Input & Required Return Calculation
7. Goal‑Level Glide Path Construction
8. Portfolio‑Level Aggregation
9. Portfolio‑Level Enhancements
10. Final Output & Reporting
11. Configuration & Parameter File
12. Worked Example
13. Risk Disclaimers & Compliance

---

### 1. Introduction & Scope
This tool generates personalised, goal‑based investment plans. It takes a user through:
- A risk capacity and tolerance questionnaire → Risk Score (1–10)
- A geographic preference questionnaire → US / Europe / EM equity weights
- Entry of multiple financial goals (lump‑sum targets or retirement income) → required rates of return
- For each goal, a time‑varying glide path that stays within the investor’s risk limits and targets the required return.
- Aggregation of all goals into a household portfolio glide path.
- Automatic introduction of structured products (from the pooled safe assets) and private markets (from long‑horizon equity) when capital thresholds are met.

The output is a year‑by‑year allocation split into separate investment vehicles: Cash, Direct Bonds, Equity ETFs, Equity Mutual Funds, REIT ETF, Gold ETF, Structured Products, and Private Equity Fund. The tool is fully configurable via a central parameter file.

---

### 2. User Profiling & Risk Scoring
#### 2.1 Demographics & Financial Baseline
| Field | Data Type | Purpose |
| :--- | :--- | :--- |
| Age | Integer | Time horizon |
| Country of residence | ISO 3166‑1 alpha‑2 | Home bias |
| Employment status | Enum (salaried, self‑employed, retired, other) | Income stability |
| Annual gross income (local currency) | Decimal | Savings capacity |
| Total liquid net worth | Decimal | Capacity |
| Monthly essential expenses | Decimal | Liquidity need |
| Emergency fund (months of expenses) | Integer | Buffer |
| Existing debt (types & interest rates) | JSON array | Burden |
| Number of dependents | Integer | Consumption |
| Insurance (life, health, disability) | Boolean × 3 | Downside protection |
| Investment experience (years) | Integer | Knowledge |
| Self‑assessed knowledge | Scale 1‑4 (none to advanced) | Sophistication |

#### 2.2 Risk Capacity Questionnaire
Six questions, each scored individually. Maximum raw capacity score: 60.

| Code | Question | Answer & Score |
| :--- | :--- | :--- |
| C1 | How stable is your current income? | Very stable=10, Stable=8, Somewhat variable=5, Highly variable=2 |
| C2 | What % of income available for long‑term savings? | >30%=10, 20‑30%=8, 10‑20%=6, 5‑10%=4, <5%=2 |
| C3 | Years until you need to start withdrawing? | >20=10, 15‑20=8, 10‑15=6, 5‑10=4, <5=2 |
| C4 | If portfolio lost 20%, how would you cover expenses? | Easily from other sources=10, With adjustments=7, Would have to sell at a loss=4, Not possible=1 |
| C5 | Do you have adequate insurance? | Yes=10, Partial=5, No=2 |
| C6 | Maximum acceptable loss in 12 months? | 0%=0, <5%=2, 5‑10%=4, 10‑20%=6, 20‑30%=8, >30%=10 |

Capacity Score (0‑5) = floor( total_raw / 12 ), clamped to 0–5.

#### 2.3 Risk Tolerance Questionnaire
Five Likert statements (1‑5) and two scenario questions (1‑5 each). Maximum raw tolerance score: 35.

Statements:
| Code | Statement | Polarity |
| :--- | :--- | :--- |
| T1 | I am willing to accept higher volatility for higher long‑term returns. | Normal (1‑5) |
| T2 | I feel anxious when my portfolio drops, even if I don’t need the money. | Reversed (5‑1) |
| T3 | I prefer investments that offer steady, predictable returns. | Reversed (5‑1) |
| T4 | I would rather miss out on gains than risk a large loss. | Reversed (5‑1) |
| T5 | I am comfortable investing in assets that can lose 30%+ in a short period. | Normal (1‑5) |

**T6 – Market decline scenario:**
- Sell immediately = 1
- Wait for small rebound then sell = 2
- Hold and do nothing = 4
- Buy more expecting recovery = 5

**T7 – Investment preference:**
- Guaranteed 5% with no risk = 1
- 50% chance of 20% gain, 50% chance 5% loss = 3
- 50% chance of 40% gain, 50% chance 20% loss = 5

Tolerance Score (0‑5) = floor( total_raw / 7 ), clamped to 0–5.

#### 2.4 Combined Risk Score & Category
Risk Score = Capacity_Score + Tolerance_Score (if sum = 0, set to 1).

| Score Range | Category | Description |
| :--- | :--- | :--- |
| 1‑2 | Very Conservative | Capital preservation paramount |
| 3‑4 | Conservative | Minimal volatility, modest income |
| 5‑6 | Moderate | Balanced growth and stability |
| 7‑8 | Growth | Emphasis on long‑term capital appreciation |
| 9‑10 | Aggressive | Maximum growth, tolerates large drawdowns |

---

### 3. Geographic Tilt Assessment
#### 3.1 Questionnaire
| Code | Question | Options & Scoring |
| :--- | :--- | :--- |
| G1 | What % of future expenses in non‑domestic currency? | None=0, <20%=1, 20‑50%=2, >50%=3 |
| G2 | Confidence in home economy vs. global? | Much stronger=-2, Slightly=-1, On par=0, Slightly weaker=+1, Much weaker=+2 |
| G3 | Rank growth expectations: US, Europe, EM (1 = highest) | Used to set base weights |
| G4 | Concern about currency risk when investing abroad? | Not=0, Slightly=1, Moderately=2, Very=3 |
| G5 | Significant assets tied to a region? If yes, which? | Deduct 10% from that region |
| G6 | Preferred home bias (slider 0‑100%) | Direct override |

#### 3.2 Calculation of Regional Weights ($US_w, EU_w, EM_w$)
- Home region determination: from country of residence (e.g., India → EM).
- Base weights from G3: 1st = 50%, 2nd = 30%, 3rd = 20%.
- Home bias adjustment (G2 & G1):
  - If G2 > 0 (home weaker), add 5% × G2 to home, reduce others proportionally.
  - If G2 < 0, add 5% × |G2| (capped at +10%) to home (familiarity).
  - G1: if >2 (>50% foreign expenses), reduce home by 10%, redistribute.
- Currency concern (G4): Very=+15% to home, Moderate=+10%, Slight=+5%.
- Concentration (G5): Deduct 10% from indicated region, redistribute.
- Manual override (G6): Set home weight to slider value; split remainder between other two according to relative base weights.
- Normalise to sum = 1.0.

Output: $geo_w = \{US: u, Europe: e, EM: m\}$.

---

### 4. Asset Universe & Vehicle Definitions
#### 4.1 Goal‑Level Vehicles (6 core vehicles)
| Vehicle Code | Full Name | Expected Return | Volatility | Category |
| :--- | :--- | :--- | :--- | :--- |
| CASH | Money Market / T‑bills | 2.5% | 0.5% | Cash |
| BOND_DIR | Direct Investment‑Grade Bonds | 4.0% | 4.0% | Fixed Income |
| ETF | Equity ETFs (all regions combined) | computed | computed | Equity |
| MF | Equity Mutual Funds (all regions) | computed | computed | Equity |
| REIT | REIT ETF (VNQ) | 7.5% | 18.0% | Real Asset |
| GOLD | Gold ETF (GLD) | 4.5% | 15.0% | Real Asset |

*Note: There are no bond ETFs or bond mutual funds – fixed income is exclusively direct bonds and cash.*

#### 4.2 Portfolio‑Level Vehicles (used only at aggregate level)
| Vehicle Code | Full Name | Expected Return | Volatility | Description |
| :--- | :--- | :--- | :--- | :--- |
| STRUCTURED | Structured Product Fund | formula‑based | 5.0% | Principal‑protected note with equity participation |
| PRIVATE | Private Equity Fund | 11.0% | 25.0% | Illiquid private equity (long‑term) |

#### 4.3 Expected Return Computation for ETF and MF
Given $geo_w = \{US: u, Europe: e, EM: m\}$, with base asset returns:

| Region | ETF Return | Mutual Fund Return (ETF – 0.3%) |
| :--- | :--- | :--- |
| US | 8.0% | 7.7% |
| Europe | 7.5% | 7.2% |
| EM | 9.0% | 8.7% |

Then:
$$R_{ETF} = u \cdot 8.0\% + e \cdot 7.5\% + m \cdot 9.0\%$$
$$R_{MF} = u \cdot 7.7\% + e \cdot 7.2\% + m \cdot 8.7\%$$

Volatility is the weighted average of regional volatilities (15%, 16%, 22% respectively), weighted by $geo_w$.

Example: If $geo_w = \{US:0.5, EU:0.3, EM:0.2\}$ →
$$R_{ETF} = 0.5 \times 8.0 + 0.3 \times 7.5 + 0.2 \times 9.0 = 8.05\%$$
$$R_{MF} = 0.5 \times 7.7 + 0.3 \times 7.2 + 0.2 \times 8.7 = 7.75\%$$
ETF vol = $\sqrt{(0.5 \times 0.15)^2 + (0.3 \times 0.16)^2 + (0.2 \times 0.22)^2} \approx 0.158 \ (15.8\%)$

---

### 5. Strategic Model Portfolios by Risk Score
#### 5.1 Long‑Term (LT) Portfolio Tables
Each table shows percentage allocation to the 6 goal‑level vehicles. The equity allocation is split between ETF and MF according to a configurable ratio (default: 70% ETF, 30% MF). Gold and REIT are added for higher risk scores.

Configuration parameters per risk score:
- total_equity = fraction of portfolio in equity (ETF+MF+REIT)
- reit = fraction in REIT
- gold = fraction in Gold
- bonds = 1 – (total_equity + gold + cash)
- cash = fraction in cash

Default Split: ETF = $0.7 \times (total\_equity – reit)$, MF = $0.3 \times (total\_equity – reit)$.

| Risk Score | CASH | BOND_DIR | ETF | MF | REIT | GOLD |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 70% | 30% | 0% | 0% | 0% | 0% |
| 2 | 60% | 40% | 0% | 0% | 0% | 0% |
| 3 | 40% | 50% | 7% | 3% | 0% | 0% |
| 4 | 30% | 55% | 10.5% | 4.5% | 0% | 0% |
| 5 | 20% | 50% | 21% | 9% | 0% | 0% |
| 6 | 15% | 45% | 28% | 12% | 0% | 0% |
| 7 | 10% | 35% | 31.5% | 13.5% | 5% | 5% |
| 8 | 5% | 25% | 42% | 18% | 10% | 0% |
| 9 | 0% | 15% | 52.5% | 22.5% | 10% | 0% |
| 10 | 0% | 0% | 59.5% | 25.5% | 10% | 5% |

#### 5.2 Short‑Term (ST) Portfolio Tables
For all risk scores, the ST portfolio is designed for a 0‑2 year horizon: only safe assets.

| Vehicle | ST Weight |
| :--- | :--- |
| CASH | 25% |
| BOND_DIR | 75% |
| ETF | 0% |
| MF | 0% |
| REIT | 0% |
| GOLD | 0% |

This ensures principal protection and liquidity near the goal date.

---

### 6. Goal Input & Required Return Calculation
#### 6.1 Goal Types & Conversion
Users may enter multiple goals. For each, the system collects:

**Type A – Lump‑Sum Target**
- PV – current savings
- C – annual contribution (end of year, constant)
- T – years to goal
- FV_target – target amount in today’s money (optional inflation: user provides $i$ or nominal)
- If inflation applied: $FV = FV\_target \times (1 + i)^T$.

**Type B – Retirement Income**
- PV_ret – current retirement savings
- C_ret – annual contribution until retirement
- T – years to retirement
- Income – desired annual income (today’s value)
- Inflation (e.g., 3%)
- N – retirement duration (e.g., 30 years)
- r_safe_real – safe real return in retirement (default 2%)

Conversion to lump‑sum equivalent:
$$r_{safe\_nom} = (1 + r_{safe\_real})(1 + inflation) - 1$$
$$First\_Income = Income \times (1 + inflation)^T$$
$$FV = First\_Income \times \frac{1 - (1 + r_{safe\_nom})^{-N}}{r_{safe\_nom}}$$

Then treat as Type A with PV_ret, C_ret, T, FV.

#### 6.2 Required IRR Numerical Solver
The required return $r^*$ solves:
$$PV \cdot (1+r)^T + C \cdot \frac{(1+r)^T - 1}{r} = FV$$

If $C=0$, then $r^* = (FV/PV)^{1/T} - 1$.
Otherwise, we use Brent’s method with initial bracket [ -0.5, 0.5 ], expanding if necessary. If $r^* > 15\%$, issue warning.

---

### 7. Goal‑Level Glide Path Construction
#### 7.1 Glide Path Formula
For each goal, with horizon T, we define the starting portfolio $A_0$ and final portfolio $A_T = ST$ (the safe portfolio). The intermediate allocations are linear combinations:
$$A_0 = \theta \cdot LT + (1 - \theta) \cdot ST$$
$$A_t = \left(1 - \frac{t}{T}\right) A_0 + \left(\frac{t}{T}\right) ST$$
where $\theta \in [0,1]$ is the blend parameter. This yields a smooth reduction in equity risk over time.

All allocations are vectors of percentages in the six goal‑level vehicles: [CASH, BOND_DIR, ETF, MF, REIT, GOLD].

#### 7.2 Finding Optimal Blend Parameter $\theta$
We seek $\theta$ such that the expected annualized return of the glide path equals the required return $r^*$.

**Step 1:** For a given $\theta$, compute $A_0$ and then $A_t$ for $t = 0, 1, ..., T-1$.
**Step 2:** Compute portfolio expected return for each year: $\mu_t = A_t \cdot R_{vehicles}$ (dot product with the vehicle expected return vector).
**Step 3:** Compute expected future value:
$$E[V_T] = PV \cdot \prod_{t=0}^{T-1} (1 + \mu_t) + C \cdot \sum_{k=1}^{T} \prod_{t=k}^{T-1} (1 + \mu_t)$$
**Step 4:** Solve for expected IRR $r_{exp}$ from:
$$PV(1 + r_{exp})^T + C \frac{(1 + r_{exp})^T - 1}{r_{exp}} = E[V_T]$$
(Newton‑Raphson with initial guess $r^*$).
**Step 5:** Define $f(\theta) = r_{exp}(\theta) - r^*$. Find root in [0,1] using bisection:
- If $f(0) \ge 0 \rightarrow \theta = 0$ (goal easily achievable with safest path).
- If $f(1) \le 0 \rightarrow \theta = 1$ (goal not achievable even with maximum risk) → flag warning.
- Else, bisection yields optimal $\theta$.

#### 7.3 Annual Allocation Table for a Goal
After obtaining $\theta$, generate the allocation percentages for each year $t = 0..T$. The output table for the goal includes the six vehicle columns.

---

### 8. Portfolio‑Level Aggregation
#### 8.1 Balance Projection
For each goal $i$, with optimal $\theta_i$, we project the account balance year‑by‑year:
$$B_{i,0} = PV_i$$
$$B_{i,t} = B_{i,t-1} \times (1 + \mu_{i,t-1}) + C_i \quad \text{for } t = 1, ..., T_i$$
where $\mu_{i,t-1}$ is the expected return in year $t-1$ of that goal’s glide path.

#### 8.2 Raw Aggregate Allocation
For each future year $t$, sum the dollar amounts from all goals still active ($t \le T_i$):
$$D_{CASH,t} = \sum_i B_{i,t} \times w_{i,CASH,t}$$
… similarly for all six vehicles.

The raw portfolio percentage is $p_{j,t} = \frac{D_{j,t}}{\sum_k D_{k,t}}$.

---

### 9. Portfolio‑Level Enhancements
These overlays are applied at the aggregate level only, after all goal allocations have been summed.

#### 9.1 Structured Product Substitution
Pool: only CASH + BOND_DIR (since bond ETFs/MFs do not exist).
Low‑Risk Pool $LR = D_{CASH} + D_{BOND\_DIR}$.

Ticket Size: if $LR < 100,000$ → no structured product.
Max Allocation: $MaxStruct = \min(0.50 \times LR, user\_limit\_pct \times LR)$ (default 50%).
Structured Product Return:
$$R_{struct} = R_{BOND} + \alpha \cdot (R_{equity\_composite} - R_{BOND})$$
- $R_{BOND} = 4.0\%$
- $R_{equity\_composite}$ = weighted expected return of ETF, MF, and REIT in the current aggregate portfolio (using their vehicle returns).
- $\alpha$ = participation rate (default 0.50).

Carve‑out:
Reduction factor $f = MaxStruct / LR$.
New amounts:
- $D_{CASH\_new} = D_{CASH} \times (1 - f)$
- $D_{BOND\_DIR\_new} = D_{BOND\_DIR} \times (1 - f)$
- Add $D_{STRUCTURED} = MaxStruct$ with return $R_{struct}$ and volatility 5%.

#### 9.2 Private Markets Overlay
Long‑Horizon Equity Pool: Sum of $D_{ETF}, D_{MF}, D_{REIT}$ from goals with remaining horizon > 10 years.
If this pool $\ge 250,000$, allocate up to 20% of it to PRIVATE.
$PrivateAmount = \min(0.20 \times Pool, user\_limit)$.

Reduce the three equity vehicles (ETF, MF, REIT) proportionally by factor $(Pool - PrivateAmount) / Pool$.
Add PRIVATE with expected return 11%, vol 25%.

Exit rule: When the remaining horizon of the contributing goals falls below 3 years, the private allocation is liquidated gradually (1/3 per year) and recycled back into the equity vehicles proportionally.

---

### 10. Final Output & Reporting
#### 10.1 Portfolio Glide Path Table (after enhancements)
For each year, display dollar amounts (and percentages) in this structure:

| Year | CASH | BOND_DIR | ETF | MF | REIT | GOLD | STRUCTURED | PRIVATE | Total |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 1 | ... | ... | ... | ... | ... | ... | ... | ... | ... |

#### 10.2 Goal‑Level Tables
For each goal, show the annual allocation in the six core vehicles, without the portfolio‑level enhancements.

#### 10.3 Charts
- Stacked area chart of portfolio composition over time.
- Equity‑vs‑fixed‑income line chart.
- Goal feasibility status dashboard.
- Risk profile and geographic tilt visualisations.

---

### 11. Configuration & Parameter File
A YAML file stores all assumptions, making the tool updatable without code changes.
\`\`\`yaml
# asset_returns.yaml
vehicles:
  CASH:       { ret: 0.025, vol: 0.005 }
  BOND_DIR:   { ret: 0.04,  vol: 0.04  }
  REIT:       { ret: 0.075, vol: 0.18  }
  GOLD:       { ret: 0.045, vol: 0.15  }
  STRUCTURED: { vol: 0.05 }
  PRIVATE:    { ret: 0.11,  vol: 0.25  }

regional_equity:
  US:
    etf_return: 0.08
    mf_return:  0.077
    vol: 0.15
  Europe:
    etf_return: 0.075
    mf_return:  0.072
    vol: 0.16
  EM:
    etf_return: 0.09
    mf_return:  0.087
    vol: 0.22

strategic_allocation:
  etf_mf_split: { etf: 0.7, mf: 0.3 }
  st_portfolio: { CASH: 0.25, BOND_DIR: 0.75 }
  lt_portfolios:
    1:  { total_equity: 0.0, cash: 0.70, bonds: 0.30, reit: 0.0, gold: 0.0 }
    2:  { total_equity: 0.0, cash: 0.60, bonds: 0.40, reit: 0.0, gold: 0.0 }
    3:  { total_equity: 0.10, cash: 0.40, bonds: 0.50, reit: 0.0, gold: 0.0 }
    4:  { total_equity: 0.15, cash: 0.30, bonds: 0.55, reit: 0.0, gold: 0.0 }
    5:  { total_equity: 0.30, cash: 0.20, bonds: 0.50, reit: 0.0, gold: 0.0 }
    6:  { total_equity: 0.40, cash: 0.15, bonds: 0.45, reit: 0.0, gold: 0.0 }
    7:  { total_equity: 0.50, cash: 0.10, bonds: 0.35, reit: 0.05, gold: 0.05 }
    8:  { total_equity: 0.60, cash: 0.05, bonds: 0.25, reit: 0.10, gold: 0.0 }
    9:  { total_equity: 0.75, cash: 0.00, bonds: 0.15, reit: 0.10, gold: 0.0 }
    10: { total_equity: 0.85, cash: 0.00, bonds: 0.00, reit: 0.10, gold: 0.05 }

thresholds:
  structured_min_ticket: 100000
  structured_max_pct: 0.5
  structured_participation: 0.5
  private_min_ticket: 250000
  private_max_pct: 0.2
  long_horizon_years: 10
  private_exit_years: 3

inflation_default: 0.03
max_required_return: 0.15
\`\`\`

---

### 12. Worked Example
#### 12.1 User Profile
- Age: 40, Country: India → home = EM
- Income stable, high savings rate, long horizon → Capacity Score = 5
- Moderate tolerance → Tolerance Score = 4
- Risk Score = 9 (Aggressive)
- Geographic tilt: G3: 1) EM, 2) US, 3) Europe → base EM=50%, US=30%, EU=20%.
- Currency concern moderate → +10% home → EM=60%, US=24%, EU=16%.
- Normalised: $geo_w = \{US:0.24, EU:0.16, EM:0.60\}$.
- Vehicle returns computed:
  - $R_{ETF} = 0.24 \times 8.0 + 0.16 \times 7.5 + 0.60 \times 9.0 = 8.52\%$
  - $R_{MF} = 0.24 \times 7.7 + 0.16 \times 7.2 + 0.60 \times 8.7 = 8.22\%$

#### 12.2 Goals
**Goal 1 – Retirement (Type B)**
- Age 40, retire at 60 → $T=20$
- $PV = 100,000$, $C = 10,000\text{/year}$
- Desired income \$50,000 (today’s), inflation 3%, $N=30$, safe real return 2%.
- Conversion: $r_{safe\_nom} = (1.02)(1.03) - 1 = 5.06\%$.
- First income = \$50,000 $\times 1.03^{20} =$ \$90,305.
- $FV = 90,305 \times \frac{1 - 1.0506^{-30}}{0.0506} \approx 1,386,000$.
- Required IRR: solve → $r^* \approx 9.2\%$ (achievable with risk score 9).

**Goal 2 – House down‑payment**
- $PV = 20,000$, $C = 5,000$, $T=8$, target = \$200,000 (nominal).
- Required IRR → $11.5\%$ (high but within LT capability).

#### 12.3 Goal‑Level Glide Paths
For Goal 1, with $r^*=9.2\%$ and LT portfolio (score 9) having equity ~75% (ETF+MF+REIT), bonds 15%, cash 0%. ST is 25% cash / 75% bonds.
Solving for $\theta$ yields $\theta \approx 0.85$.
Annual allocations computed, decreasing equity from ~68% to 0% over 20 years.
For Goal 2, shorter horizon and higher required return → $\theta=1$ (maximum equity) and maybe warning if return > LT expected.

#### 12.4 Aggregation & Enhancements
After projecting balances and summing, suppose at year 0 the aggregate has:
Cash: \$8,000, Bonds: \$25,000 → $LR = 33,000$ (< \$100k) → no structured product.
Long‑horizon equity (goals >10yr) = \$200,000 → > \$250k? No. So no private overlay yet.
In later years, as portfolio grows, structured and private products may appear.

#### 12.5 Final Output Snippet (Year 0)
| Year | CASH | BOND_DIR | ETF | MF | REIT | GOLD | STRUCTURED | PRIVATE | Total |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | 8000 | 25000 | 72000 | 31000 | 15000 | 5000 | 0 | 0 | 156000 |

---

### 13. Risk Disclaimers & Compliance
- All projections are based on historical estimates and are not guaranteed.
- Structured products involve counterparty risk and may not be suitable for all investors.
- Private equity investments are illiquid and carry higher risk; they are only recommended for long‑term goals.
- The tool is an advisory aid; final investment decisions should involve a qualified financial advisor.
- User data must be protected according to GDPR/local regulations.
`;

export function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="prose prose-blue max-w-none 
          prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2
          prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-a:text-blue-600">
        <ReactMarkdown 
          remarkPlugins={[remarkMath, remarkGfm]} 
          rehypePlugins={[rehypeKatex]}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
