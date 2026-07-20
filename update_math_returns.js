import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/lib/math.ts', 'utf8');

c = c.replace(
    'export function computeVehicleReturns(geoWeights: { US: number, Europe: number, EM: number }) {',
    'export function computeVehicleReturns(geoWeights: { US: number, Europe: number, EM: number }, options?: any) {'
);

c = c.replace(
    '  const reg = config.regional_equity;\n  const etfReturn = US * reg.US.etf_return + Europe * reg.Europe.etf_return + EM * reg.EM.etf_return;\n  const mfReturn = US * reg.US.mf_return + Europe * reg.Europe.mf_return + EM * reg.EM.mf_return;',
    `  const reg = options?.regional_equity || config.regional_equity;
  const etfReturn = US * reg.US.etf_return + Europe * reg.Europe.etf_return + EM * reg.EM.etf_return;
  const mfReturn = US * reg.US.mf_return + Europe * reg.Europe.mf_return + EM * reg.EM.mf_return;`
);

c = c.replace(
    'function computePortfolioReturn(A: AllocationMap, etfRet: number, mfRet: number): number {',
    'function computePortfolioReturn(A: AllocationMap, etfRet: number, mfRet: number, options?: any): number {'
);

c = c.replace(
    '    (A.CASH || 0) * config.vehicles.CASH.ret +\n    (A.BOND_DIR || 0) * config.vehicles.BOND_DIR.ret +\n    (A.ETF || 0) * etfRet +\n    (A.MF || 0) * mfRet +\n    (A.REIT || 0) * config.vehicles.REIT.ret +\n    (A.GOLD || 0) * config.vehicles.GOLD.ret',
    `    (A.CASH || 0) * (options?.vehicles?.CASH?.ret || config.vehicles.CASH.ret) +
    (A.BOND_DIR || 0) * (options?.vehicles?.BOND_DIR?.ret || config.vehicles.BOND_DIR.ret) +
    (A.ETF || 0) * etfRet +
    (A.MF || 0) * mfRet +
    (A.REIT || 0) * (options?.vehicles?.REIT?.ret || config.vehicles.REIT.ret) +
    (A.GOLD || 0) * (options?.vehicles?.GOLD?.ret || config.vehicles.GOLD.ret)`
);

c = c.replace(
    'export function computeGoalGlidePath(goal: Goal, riskScore: number, geoWeights: { US: number, Europe: number, EM: number }, options: { returnMultiplier?: number, allowRiskOverride?: boolean } = {}): ComputedGoal {',
    'export function computeGoalGlidePath(goal: Goal, riskScore: number, geoWeights: { US: number, Europe: number, EM: number }, options: { returnMultiplier?: number, allowRiskOverride?: boolean, returnsConfig?: any } = {}): ComputedGoal {'
);

c = c.replace(
    '  const { etfReturn, mfReturn } = computeVehicleReturns(geoWeights);\n  const adjEtf = etfReturn * returnMultiplier;\n  const adjMf = mfReturn * returnMultiplier;',
    `  const { etfReturn, mfReturn } = computeVehicleReturns(geoWeights, options.returnsConfig);
  const adjEtf = etfReturn * returnMultiplier;
  const adjMf = mfReturn * returnMultiplier;`
);

c = c.replace(
    '    const ret = computePortfolioReturn(At, adjEtf, adjMf) * returnMultiplier;',
    '    const ret = computePortfolioReturn(At, adjEtf, adjMf, options.returnsConfig) * returnMultiplier;'
);

writeFileSync('src/lib/math.ts', c);
