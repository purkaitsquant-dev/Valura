
import { Goal, UserProfile, ComputedGoal, AllocationMap } from '../types';
import { config } from '../config';

export function calculateRiskScore(p: UserProfile): number {
  const sum = p.t1 + p.t2 + p.t3 + p.t4 + p.t5 + p.t6 + p.t7;
  if (sum <= 12) return 1;
  if (sum <= 15) return 2;
  if (sum <= 18) return 3;
  if (sum <= 21) return 4;
  if (sum <= 24) return 5;
  if (sum <= 27) return 6;
  if (sum <= 30) return 7;
  if (sum <= 33) return 8;
  if (sum <= 36) return 9;
  return 10;
}

export function calculateGeographicWeights(p: UserProfile) {
  if (p.g6 !== null) {
    const hb = p.g6 / 100;
    const rem = 1 - hb;
    if (p.country === 'US') return { US: hb, Europe: rem * 0.5, EM: rem * 0.5 };
    if (p.country === 'Europe') return { US: rem * 0.5, Europe: hb, EM: rem * 0.5 };
    return { US: rem * 0.5, Europe: rem * 0.5, EM: hb };
  }
  return { US: 0.5, Europe: 0.3, EM: 0.2 };
}

export function getLTPortfolio(riskScore: number, geoWeights: { US: number, Europe: number, EM: number }): AllocationMap {
  const pt = config.lt_params[riskScore as keyof typeof config.lt_params];
  const bonds = Math.max(0, 1 - pt.total_equity - pt.reit - pt.gold - pt.cash);
  
  const eqTarget = pt.total_equity;
  const usEq = eqTarget * geoWeights.US;
  const euEq = eqTarget * geoWeights.Europe;
  const emEq = eqTarget * geoWeights.EM;
  
  const usSplit = config.equity_splits.US;
  const euSplit = config.equity_splits.Europe;
  const emSplit = config.equity_splits.EM;

  return {
    CASH: pt.cash,
    BOND_DIR: bonds,
    US_ETF: usEq * usSplit.ETF,
    US_MF: usEq * usSplit.MF,
    US_STOCKS: usEq * usSplit.STOCKS,
    EU_ETF: euEq * usSplit.ETF,
    EU_MF: euEq * usSplit.MF,
    EU_STOCKS: euEq * usSplit.STOCKS,
    EM_ETF: emEq * usSplit.ETF,
    EM_MF: emEq * usSplit.MF,
    EM_STOCKS: emEq * usSplit.STOCKS,
    REIT: pt.reit,
    GOLD: pt.gold,
    STRUCTURED: 0,
    PRIVATE: 0
  };
}

export function getSTPortfolio(): AllocationMap {
  const st = config.st_portfolio;
  return {
    CASH: st.CASH,
    BOND_DIR: st.BOND_DIR,
    US_ETF: 0, US_MF: 0, US_STOCKS: 0,
    EU_ETF: 0, EU_MF: 0, EU_STOCKS: 0,
    EM_ETF: 0, EM_MF: 0, EM_STOCKS: 0,
    REIT: 0, GOLD: 0,
    STRUCTURED: 0, PRIVATE: 0
  };
}

export function solveRequiredIRR(pv: number, c: number, t: number, fv: number): number {
  if (t === 0) return 0;
  if (c === 0) return Math.pow(fv / (pv || 1), 1 / t) - 1;
  
  let low = -0.5, high = 0.5, guess = 0;
  for (let i = 0; i < 100; i++) {
    guess = (low + high) / 2;
    let computedFV = pv * Math.pow(1 + guess, t) + (guess === 0 ? c * t : c * (Math.pow(1 + guess, t) - 1) / guess);
    if (Math.abs(computedFV - fv) < 0.01) break;
    if (computedFV < fv) low = guess;
    else high = guess;
  }
  return guess;
}

export function calculateGoalFV(goal: Goal): number {
  if (goal.type === 'LumpSum') {
    const fvTarget = goal.target || 0;
    return goal.applyInflation ? fvTarget * Math.pow(1 + config.general.inflation_default, goal.t) : fvTarget;
  } else {
    const income = goal.income || 0;
    const dur = goal.retirementDuration || 30;
    const inf = config.general.inflation_default;
    const rReal = 0.02; // config.safe_real_return_default not defined directly in general, hardcode 0.02 or add it
    const rSafeNom = (1 + rReal) * (1 + inf) - 1;
    const firstIncome = income * Math.pow(1 + inf, goal.t);
    return firstIncome * ((1 - Math.pow(1 + rSafeNom, -dur)) / rSafeNom);
  }
}

function mixPortfolios(A: AllocationMap, B: AllocationMap, weightA: number): AllocationMap {
  const res = {} as AllocationMap;
  for (const key of Object.keys(A) as (keyof AllocationMap)[]) {
    if (key !== "STRUCTURED_BASKET") (res as any)[key] = ((A[key] as number) || 0) * weightA + ((B[key] as number) || 0) * (1 - weightA); else (res as any)[key] = A[key];
  }
  return res;
}

function computePortfolioReturn(A: AllocationMap, options?: any): number {
  const returns = options?.returns || config.returns;
  const regional = options?.regional || config.regional;
  
  return (
    (A.CASH || 0) * returns.CASH.ret +
    (A.BOND_DIR || 0) * returns.BOND_DIR.ret +
    (A.US_ETF || 0) * regional.US.etf.ret +
    (A.US_MF || 0) * regional.US.mf.ret +
    (A.US_STOCKS || 0) * regional.US.stocks.ret +
    (A.EU_ETF || 0) * regional.Europe.etf.ret +
    (A.EU_MF || 0) * regional.Europe.mf.ret +
    (A.EU_STOCKS || 0) * regional.Europe.stocks.ret +
    (A.EM_ETF || 0) * regional.EM.etf.ret +
    (A.EM_MF || 0) * regional.EM.mf.ret +
    (A.EM_STOCKS || 0) * regional.EM.stocks.ret +
    (A.REIT || 0) * returns.REIT.ret +
    (A.GOLD || 0) * returns.GOLD.ret +
    (A.STRUCTURED || 0) * (A.STRUCTURED_RETURN || 0) + // handle structured overlay if precalculated, though typically goals don't have it
    (A.PRIVATE || 0) * config.private.expected_return
  );
}

export function computeGoalGlidePath(goal: Goal, riskScore: number, geoWeights: { US: number, Europe: number, EM: number }, options: { returnMultiplier?: number, allowRiskOverride?: boolean, returnsConfig?: any, overrideTheta?: number } = {}): ComputedGoal {
  const returnMultiplier = options.returnMultiplier || 1.0;
  const fv = calculateGoalFV(goal);
  const rStar = solveRequiredIRR(goal.pv, goal.c, goal.t, fv);
  
  const lt = getLTPortfolio(riskScore, geoWeights);
  const st = getSTPortfolio();

  const evaluateTheta = (theta: number, overrideLt?: any) => {
    const currentLt = overrideLt || lt;
    const A0 = mixPortfolios(currentLt, st, theta);
    
    let expectedFV = goal.pv;
    for (let i = 0; i < goal.t; i++) {
      const w = 1 - (i / goal.t);
      const At = mixPortfolios(A0, st, w);
      const ret = computePortfolioReturn(At, options.returnsConfig) * returnMultiplier;
      expectedFV = expectedFV * (1 + ret) + goal.c;
    }
    return expectedFV;
  };

  let low = 0, high = 1, theta = 0;
  const fvMin = evaluateTheta(0);
  let fvMax = evaluateTheta(1);
  let currentLt = lt;
  let effectiveRiskScore = riskScore;
  
  if (options.allowRiskOverride && fvMax < fv) {
      for (let rs = riskScore + 1; rs <= 10; rs++) {
          const tempLt = getLTPortfolio(rs, geoWeights);
          const tempFvMax = evaluateTheta(1, tempLt);
          if (tempFvMax >= fv) {
              currentLt = tempLt;
              fvMax = tempFvMax;
              effectiveRiskScore = rs;
              break;
          } else if (rs === 10) {
              currentLt = tempLt;
              fvMax = tempFvMax;
              effectiveRiskScore = rs;
          }
      }
  }
  
  let finalFV = fvMin;
  let expectedReturn = 0;
  
  if (fv <= fvMin) {
    theta = 0;
    finalFV = fvMin;
  } else if (fv >= fvMax) {
    theta = 1;
    finalFV = fvMax;
  }
  else {
    for (let i = 0; i < 50; i++) {
      theta = (low + high) / 2;
      const fvMid = evaluateTheta(theta, currentLt);
      finalFV = fvMid;
      if (Math.abs(fvMid - fv) < 1) break;
      if (fvMid < fv) low = theta;
      else high = theta;
    }
  }
  
  expectedReturn = solveRequiredIRR(goal.pv, goal.c, goal.t, finalFV);
  const A0 = mixPortfolios(currentLt, st, theta);
  const allocations: AllocationMap[] = [];
  const balances: number[] = [goal.pv];
  
  let currBal = goal.pv;
  for (let i = 0; i <= goal.t; i++) {
    const w = goal.t === 0 ? 0 : 1 - (i / goal.t);
    const At = mixPortfolios(A0, st, w);
    allocations.push(At);
    
    if (i < goal.t) {
      const ret = computePortfolioReturn(At, options.returnsConfig) * returnMultiplier;
      currBal = currBal * (1 + ret) + goal.c;
      balances.push(currBal);
    }
  }

  return {
    ...goal,
    requiredIrr: rStar,
    expectedReturn,
    theta,
    effectiveRiskScore,
    allocations,
    balances
  };
}

export function computeAggregatePortfolio(goals: ComputedGoal[], geoWeights: {US: number, Europe: number, EM: number}, options?: any) {
  const maxT = Math.max(0, ...goals.map(g => g.t));
  const aggregateAllocations: AllocationMap[] = [];

  let privateMarketActivated = false;

  for (let y = 0; y <= maxT; y++) {
    let totalBal = 0;
    const dollarMap: Record<string, number> = {
      CASH: 0, BOND_DIR: 0, US_ETF: 0, US_MF: 0, US_STOCKS: 0,
      EU_ETF: 0, EU_MF: 0, EU_STOCKS: 0, EM_ETF: 0, EM_MF: 0, EM_STOCKS: 0,
      REIT: 0, GOLD: 0, STRUCTURED: 0, PRIVATE: 0
    };
    
    let longHorizonEquity = 0;
    
    goals.forEach(g => {
      if (y <= g.t) {
        const bal = g.balances[y] || 0;
        totalBal += bal;
        const alloc = g.allocations[y];
        
        dollarMap.CASH += bal * (alloc.CASH || 0);
        dollarMap.BOND_DIR += bal * (alloc.BOND_DIR || 0);
        dollarMap.US_ETF += bal * (alloc.US_ETF || 0);
        dollarMap.US_MF += bal * (alloc.US_MF || 0);
        dollarMap.US_STOCKS += bal * (alloc.US_STOCKS || 0);
        dollarMap.EU_ETF += bal * (alloc.EU_ETF || 0);
        dollarMap.EU_MF += bal * (alloc.EU_MF || 0);
        dollarMap.EU_STOCKS += bal * (alloc.EU_STOCKS || 0);
        dollarMap.EM_ETF += bal * (alloc.EM_ETF || 0);
        dollarMap.EM_MF += bal * (alloc.EM_MF || 0);
        dollarMap.EM_STOCKS += bal * (alloc.EM_STOCKS || 0);
        dollarMap.REIT += bal * (alloc.REIT || 0);
        dollarMap.GOLD += bal * (alloc.GOLD || 0);
        
        if (g.t > config.private.long_horizon_years) {
          const eq = bal * ((alloc.US_ETF || 0) + (alloc.US_MF || 0) + (alloc.US_STOCKS || 0) + 
                            (alloc.EU_ETF || 0) + (alloc.EU_MF || 0) + (alloc.EU_STOCKS || 0) + 
                            (alloc.EM_ETF || 0) + (alloc.EM_MF || 0) + (alloc.EM_STOCKS || 0) + 
                            (alloc.REIT || 0));
          const remaining = g.t - y;
          if (remaining >= config.private.exit_years) {
            longHorizonEquity += eq;
          } else if (remaining > 0) {
            longHorizonEquity += eq * (remaining / config.private.exit_years);
          }
        }
      }
    });

    let structReturn = 0;
    let structBasket = '';

    if (totalBal > 0) {
      // Structured product overlay
      const poolAmount = dollarMap.CASH + dollarMap.BOND_DIR + dollarMap.US_ETF + dollarMap.US_MF + dollarMap.EU_ETF + dollarMap.EU_MF;
      if (poolAmount >= config.structured.min_ticket) {
        const maxStruct = Math.min(config.structured.max_pct * poolAmount, 0.5 * poolAmount);
        const f = maxStruct / poolAmount;
        
        // compute basket return
        const returns = options?.returns || config.returns;
        const regional = options?.regional || config.regional;

        const wCASH = dollarMap.CASH / poolAmount;
        const wBOND = dollarMap.BOND_DIR / poolAmount;
        const wUSE = dollarMap.US_ETF / poolAmount;
        const wUSM = dollarMap.US_MF / poolAmount;
        const wEUE = dollarMap.EU_ETF / poolAmount;
        const wEUM = dollarMap.EU_MF / poolAmount;

        const basketReturn = 
            wCASH * returns.CASH.ret +
            wBOND * returns.BOND_DIR.ret +
            wUSE * regional.US.etf.ret +
            wUSM * regional.US.mf.ret +
            wEUE * regional.Europe.etf.ret +
            wEUM * regional.Europe.mf.ret;

        structReturn = returns.BOND_DIR.ret + config.structured.participation_rate * Math.max(0, basketReturn - returns.BOND_DIR.ret);
        
        const formatPct = (val) => (val * 100).toFixed(1) + '%';
        const parts = [];
        if (wCASH > 0) parts.push(`CASH: ${formatPct(wCASH)}`);
        if (wBOND > 0) parts.push(`BOND: ${formatPct(wBOND)}`);
        if (wUSE > 0) parts.push(`US_ETF: ${formatPct(wUSE)}`);
        if (wUSM > 0) parts.push(`US_MF: ${formatPct(wUSM)}`);
        if (wEUE > 0) parts.push(`EU_ETF: ${formatPct(wEUE)}`);
        if (wEUM > 0) parts.push(`EU_MF: ${formatPct(wEUM)}`);
        structBasket = parts.join(', ');

        dollarMap.CASH *= (1 - f);
        dollarMap.BOND_DIR *= (1 - f);
        dollarMap.US_ETF *= (1 - f);
        dollarMap.US_MF *= (1 - f);
        dollarMap.EU_ETF *= (1 - f);
        dollarMap.EU_MF *= (1 - f);
        dollarMap.STRUCTURED = maxStruct;
      }
      
      // Private markets overlay
      if (longHorizonEquity >= config.private.min_ticket) {
        privateMarketActivated = true;
      }
      
      if (privateMarketActivated && longHorizonEquity > 0) {
        const pAmount = Math.min(config.private.max_pct * longHorizonEquity, 0.2 * longHorizonEquity);
        const eqTotal = dollarMap.US_ETF + dollarMap.US_MF + dollarMap.US_STOCKS + 
                        dollarMap.EU_ETF + dollarMap.EU_MF + dollarMap.EU_STOCKS + 
                        dollarMap.EM_ETF + dollarMap.EM_MF + dollarMap.EM_STOCKS + 
                        dollarMap.REIT;
        if (eqTotal > 0) {
          const actualPAmount = Math.min(pAmount, eqTotal);
          const reductionRatio = (eqTotal - actualPAmount) / eqTotal;
          dollarMap.US_ETF *= reductionRatio;
          dollarMap.US_MF *= reductionRatio;
          dollarMap.US_STOCKS *= reductionRatio;
          dollarMap.EU_ETF *= reductionRatio;
          dollarMap.EU_MF *= reductionRatio;
          dollarMap.EU_STOCKS *= reductionRatio;
          dollarMap.EM_ETF *= reductionRatio;
          dollarMap.EM_MF *= reductionRatio;
          dollarMap.EM_STOCKS *= reductionRatio;
          dollarMap.REIT *= reductionRatio;
          dollarMap.PRIVATE = actualPAmount;
        }
      }
      
      const res: any = {};
      for (const k of Object.keys(dollarMap)) {
        res[k] = dollarMap[k] / totalBal;
      }
      if (res.STRUCTURED > 0) {
        res.STRUCTURED_RETURN = structReturn;
        res.STRUCTURED_BASKET = structBasket;
      }
      aggregateAllocations.push(res as AllocationMap);
    } else {
      aggregateAllocations.push(getSTPortfolio());
    }
  }
  
  return aggregateAllocations;
}
