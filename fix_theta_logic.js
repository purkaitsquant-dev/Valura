import { readFileSync, writeFileSync } from 'fs';

let m = readFileSync('src/lib/math.ts', 'utf8');

// 1. Update signature
m = m.replace(
    'options: { returnMultiplier?: number, allowRiskOverride?: boolean, returnsConfig?: any } = {}',
    'options: { returnMultiplier?: number, allowRiskOverride?: boolean, returnsConfig?: any, overrideTheta?: number } = {}'
);

// 2. Update theta logic
const oldLogic = `  let low = 0, high = 1, theta = 0;
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
      if (fvMid < fv) {
        low = theta;
      } else {
        high = theta;
      }
    }
    finalFV = evaluateTheta(theta, currentLt);
  }`;

const newLogic = `  let low = 0, high = 1, theta = 0;
  const fvMin = evaluateTheta(0);
  let fvMax = evaluateTheta(1);
  let currentLt = lt;
  let effectiveRiskScore = riskScore;
  let finalFV = fvMin;
  
  if (options.overrideTheta !== undefined) {
    theta = options.overrideTheta;
    finalFV = evaluateTheta(theta, currentLt);
  } else {
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
          if (fvMid < fv) {
            low = theta;
          } else {
            high = theta;
          }
        }
        finalFV = evaluateTheta(theta, currentLt);
      }
  }
  
  let expectedReturn = 0;`;

m = m.replace(oldLogic, newLogic);
writeFileSync('src/lib/math.ts', m);
