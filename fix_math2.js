import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/lib/math.ts', 'utf8');

if (!c.includes('returnMultiplier = 1.0')) {
    c = c.replace(
        'export function computeGoalGlidePath(goal: Goal, riskScore: number, geoWeights: { US: number, Europe: number, EM: number }): ComputedGoal {',
        'export function computeGoalGlidePath(goal: Goal, riskScore: number, geoWeights: { US: number, Europe: number, EM: number }, options: { returnMultiplier?: number, allowRiskOverride?: boolean } = {}): ComputedGoal {\n  const returnMultiplier = options.returnMultiplier || 1.0;'
    );

    // Apply returnMultiplier to vehicle returns
    c = c.replace(
        '  const { etfReturn, mfReturn } = computeVehicleReturns(geoWeights);',
        '  const { etfReturn, mfReturn } = computeVehicleReturns(geoWeights);\n  const adjEtf = etfReturn * returnMultiplier;\n  const adjMf = mfReturn * returnMultiplier;'
    );

    c = c.replace(
        'const ret = computePortfolioReturn(At, etfReturn, mfReturn);',
        'const ret = computePortfolioReturn(At, adjEtf, adjMf) * returnMultiplier;'
    );

    // To prevent the code from breaking if it uses computePortfolioReturn in other places:
    // Wait, let's just make expectedFV use the adjusted return.
    
    // Also, if allowRiskOverride is true and fvMax is still < fv, we could bump riskScore to 10
    // But riskScore is passed in.
    
    // Actually, "reduce allocation towards bonds/cash for higher return"
    c = c.replace(
        '  const evaluateTheta = (theta: number) => {',
        `  const evaluateTheta = (theta: number, overrideLt?: any) => {
    const currentLt = overrideLt || lt;
    const A0 = mixPortfolios(currentLt, st, theta);`
    );

    c = c.replace(
        'const A0 = mixPortfolios(lt, st, theta);',
        '// Replaced below'
    );
    
    // Let's just rewrite the evaluateTheta calls to use overrideLt
    c = c.replace(
        '  let low = 0, high = 1, theta = 0;\n  const fvMin = evaluateTheta(0);\n  const fvMax = evaluateTheta(1);\n  \n  let finalFV = fvMin;\n  let expectedReturn = 0;',
        `  let low = 0, high = 1, theta = 0;
  const fvMin = evaluateTheta(0);
  let fvMax = evaluateTheta(1);
  let currentLt = lt;
  
  if (options.allowRiskOverride && fvMax < fv) {
      currentLt = getLTPortfolio(10); // max risk
      fvMax = evaluateTheta(1, currentLt);
  }
  
  let finalFV = fvMin;
  let expectedReturn = 0;`
    );

    c = c.replace(
        '      const fvMid = evaluateTheta(theta);',
        '      const fvMid = evaluateTheta(theta, currentLt);'
    );

    c = c.replace(
        '  const A0 = mixPortfolios(lt, st, theta);\n// Replaced below',
        '  const A0 = mixPortfolios(currentLt, st, theta);'
    );
}

writeFileSync('src/lib/math.ts', c);
