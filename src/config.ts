export const config = {
  returns: {
    CASH:      { ret: 0.025, vol: 0.005 },
    BOND_DIR:  { ret: 0.040, vol: 0.04  },
    REIT:      { ret: 0.075, vol: 0.18  },
    GOLD:      { ret: 0.045, vol: 0.15  }
  },
  regional: {
    US: {
      etf:    { ret: 0.080, vol: 0.15 },
      mf:     { ret: 0.077, vol: 0.15 },
      stocks: { ret: 0.085, vol: 0.20 }
    },
    Europe: {
      etf:    { ret: 0.075, vol: 0.16 },
      mf:     { ret: 0.072, vol: 0.16 },
      stocks: { ret: 0.080, vol: 0.21 }
    },
    EM: {
      etf:    { ret: 0.090, vol: 0.22 },
      mf:     { ret: 0.087, vol: 0.22 },
      stocks: { ret: 0.095, vol: 0.27 }
    }
  },
  equity_splits: {
    US:      { ETF: 0.5, MF: 0.3, STOCKS: 0.2 },
    Europe:  { ETF: 0.6, MF: 0.3, STOCKS: 0.1 },
    EM:      { ETF: 0.7, MF: 0.2, STOCKS: 0.1 }
  },
  st_portfolio: {
    CASH: 0.25,
    BOND_DIR: 0.75
  },
  lt_params: {
    1:  { total_equity: 0.00, reit: 0.00, gold: 0.00, cash: 0.70 },
    2:  { total_equity: 0.00, reit: 0.00, gold: 0.00, cash: 0.60 },
    3:  { total_equity: 0.10, reit: 0.00, gold: 0.00, cash: 0.40 },
    4:  { total_equity: 0.15, reit: 0.00, gold: 0.00, cash: 0.30 },
    5:  { total_equity: 0.30, reit: 0.00, gold: 0.00, cash: 0.20 },
    6:  { total_equity: 0.40, reit: 0.00, gold: 0.00, cash: 0.15 },
    7:  { total_equity: 0.55, reit: 0.05, gold: 0.05, cash: 0.10 },
    8:  { total_equity: 0.70, reit: 0.10, gold: 0.00, cash: 0.05 },
    9:  { total_equity: 0.85, reit: 0.10, gold: 0.00, cash: 0.00 },
    10: { total_equity: 0.95, reit: 0.10, gold: 0.05, cash: 0.00 }
  } as Record<number, { total_equity: number, cash: number, reit: number, gold: number }>,
  structured: {
    min_ticket: 100000,
    max_pct: 0.5,
    participation_rate: 0.5,
    vol: 0.05,
    pool_assets: ['CASH', 'BOND_DIR', 'US_ETF', 'US_MF', 'EU_ETF', 'EU_MF']
  },
  private: {
    min_ticket: 250000,
    max_pct: 0.20,
    expected_return: 0.11,
    vol: 0.25,
    long_horizon_years: 10,
    exit_years: 3
  },
  general: {
    inflation_default: 0.03,
    max_required_return: 0.15,
    max_risk_score: 10
  }
};
