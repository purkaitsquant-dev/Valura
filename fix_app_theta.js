import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.tsx', 'utf8');

const oldUpdatePortfolio = `  const updatePortfolio = (currentProfile: UserProfile, currentRawGoals: Goal[], currentConfig: ReturnsConfig) => {
    const baseRiskScore = calculateRiskScore(currentProfile);
    const geoWeights = calculateGeographicWeights(currentProfile);
    
    let maxRiskScore = baseRiskScore;
    currentRawGoals.forEach(g => {
      const tempComputed = computeGoalGlidePath(g, baseRiskScore, geoWeights, { allowRiskOverride: true, returnsConfig: currentConfig });
      if (tempComputed.effectiveRiskScore && tempComputed.effectiveRiskScore > maxRiskScore) {
        maxRiskScore = tempComputed.effectiveRiskScore;
      }
    });

    const computedGoals = currentRawGoals.map(g => {
      const cg = computeGoalGlidePath(g, maxRiskScore, geoWeights, { allowRiskOverride: false, returnsConfig: currentConfig });
      // ensure the effectiveRiskScore reflects the max risk score we applied
      return { ...cg, effectiveRiskScore: maxRiskScore };
    });
    setGoals(computedGoals);
    
    const agg = computeAggregatePortfolio(computedGoals, geoWeights, currentConfig);
    setAggregateAllocations(agg);
  };`;

const newUpdatePortfolio = `  const updatePortfolio = (currentProfile: UserProfile, currentRawGoals: Goal[], currentConfig: ReturnsConfig) => {
    const baseRiskScore = calculateRiskScore(currentProfile);
    const geoWeights = calculateGeographicWeights(currentProfile);
    
    let maxRiskScore = baseRiskScore;
    currentRawGoals.forEach(g => {
      const tempComputed = computeGoalGlidePath(g, baseRiskScore, geoWeights, { allowRiskOverride: true, returnsConfig: currentConfig });
      if (tempComputed.effectiveRiskScore && tempComputed.effectiveRiskScore > maxRiskScore) {
        maxRiskScore = tempComputed.effectiveRiskScore;
      }
    });

    let maxTheta = 0;
    currentRawGoals.forEach(g => {
      const tempComputed = computeGoalGlidePath(g, maxRiskScore, geoWeights, { allowRiskOverride: false, returnsConfig: currentConfig });
      if (tempComputed.theta > maxTheta) {
        maxTheta = tempComputed.theta;
      }
    });

    const computedGoals = currentRawGoals.map(g => {
      const cg = computeGoalGlidePath(g, maxRiskScore, geoWeights, { allowRiskOverride: false, returnsConfig: currentConfig, overrideTheta: maxTheta });
      return { ...cg, effectiveRiskScore: maxRiskScore };
    });
    setGoals(computedGoals);
    
    const agg = computeAggregatePortfolio(computedGoals, geoWeights, currentConfig);
    setAggregateAllocations(agg);
  };`;

c = c.replace(oldUpdatePortfolio, newUpdatePortfolio);
writeFileSync('src/App.tsx', c);
