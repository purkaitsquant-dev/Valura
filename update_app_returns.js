import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.tsx', 'utf8');

const returnConfigString = `const customReturnsConfig = {
      vehicles: {
        CASH: { ret: 0.04 },
        BOND_DIR: { ret: 0.06 },
        REIT: { ret: 0.09 },
        GOLD: { ret: 0.07 }
      },
      regional_equity: {
        US: { etf_return: 0.12, mf_return: 0.115 },
        Europe: { etf_return: 0.10, mf_return: 0.095 },
        EM: { etf_return: 0.13, mf_return: 0.125 }
      }
    };`;

c = c.replace(
    'const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { returnMultiplier: 1.15, allowRiskOverride: true }));',
    `${returnConfigString}\n    const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { returnMultiplier: 1.0, allowRiskOverride: true, returnsConfig: customReturnsConfig }));`
);

c = c.replace(
    'const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { returnMultiplier: 1.15, allowRiskOverride: true });',
    `${returnConfigString}\n    const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { returnMultiplier: 1.0, allowRiskOverride: true, returnsConfig: customReturnsConfig });`
);

writeFileSync('src/App.tsx', c);
