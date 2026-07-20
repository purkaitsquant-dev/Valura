import { readFileSync, writeFileSync } from 'fs';

// 1. Update types.ts
let t = readFileSync('src/types.ts', 'utf8');
t = t.replace(
    'theta: number;\n  allocations: AllocationMap[];',
    'theta: number;\n  effectiveRiskScore?: number;\n  allocations: AllocationMap[];'
);
writeFileSync('src/types.ts', t);

// 2. Update math.ts
let m = readFileSync('src/lib/math.ts', 'utf8');
const oldMath = `  let currentLt = lt;
  
  if (options.allowRiskOverride && fvMax < fv) {
      currentLt = getLTPortfolio(10, geoWeights);
      fvMax = evaluateTheta(1, currentLt);
  }`;
const newMath = `  let currentLt = lt;
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
  }`;
m = m.replace(oldMath, newMath);

const oldReturn = `  return {
    ...goal,
    requiredIrr: rStar,
    expectedReturn,
    theta,
    allocations,
    balances
  };`;
const newReturn = `  return {
    ...goal,
    requiredIrr: rStar,
    expectedReturn,
    theta,
    effectiveRiskScore,
    allocations,
    balances
  };`;
m = m.replace(oldReturn, newReturn);
writeFileSync('src/lib/math.ts', m);
