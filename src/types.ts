export interface ReturnsConfig {
  returns: {
    CASH: { ret: number; vol?: number };
    BOND_DIR: { ret: number; vol?: number };
    REIT: { ret: number; vol?: number };
    GOLD: { ret: number; vol?: number };
  };
  regional: {
    US: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
    Europe: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
    EM: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
  };
}

export type RiskScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface UserProfile {
  age: number;
  country: string;
  incomeStability: number;
  savingsRate: number;
  yearsToWithdrawal: number;
  lossResponse: number;
  insurance: number;
  maxLoss: number;
  
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  t5: number;
  t6: number;
  t7: number;

  g1: number;
  g2: number;
  g3: string[]; // ['US', 'Europe', 'EM'] ordered
  g4: number;
  g5: string; // Region to deduct from or 'None'
  g6: number | null; // Override home bias (0-100) or null
}

export type GoalType = 'LumpSum' | 'Retirement';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  pv: number; // Current savings
  c: number;  // Annual contribution
  t: number;  // Years to goal / retirement
  
  // For LumpSum
  target?: number; 
  applyInflation?: boolean;
  
  // For Retirement
  income?: number; // Desired annual income in today's money
  retirementDuration?: number; 
}

export interface ComputedGoal extends Goal {
  requiredIrr: number;
  expectedReturn?: number;
  theta: number;
  effectiveRiskScore?: number;
  allocations: AllocationMap[]; // Year by year allocations (percentages)
  balances: number[]; // Year by year balances
}

export interface AllocationMap {
  CASH: number;
  BOND_DIR: number;
  US_ETF: number;
  US_MF: number;
  US_STOCKS: number;
  EU_ETF: number;
  EU_MF: number;
  EU_STOCKS: number;
  EM_ETF: number;
  EM_MF: number;
  EM_STOCKS: number;
  REIT: number;
  GOLD: number;
  STRUCTURED?: number;
  PRIVATE?: number;
  STRUCTURED_RETURN?: number; // to store the structured product's return if present
  STRUCTURED_BASKET?: string; // to store the structured product's basket if present
}
