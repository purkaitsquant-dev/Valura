import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.tsx', 'utf8');

const updateLogic = `  const updatePortfolio = (currentProfile: UserProfile, currentRawGoals: Goal[], currentConfig: ReturnsConfig) => {
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

// Insert the updatePortfolio function before handleGoalsComplete
c = c.replace("const handleGoalsComplete = (initialGoals: Goal[]) => {", updateLogic + "\n\n  const handleGoalsComplete = (initialGoals: Goal[]) => {");

// Replace handleProfileComplete body
const handleProfileCompleteBody = `const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    
    const riskScore = calculateRiskScore(p);
    const geoWeights = calculateGeographicWeights(p);
    
        const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig }));
    setGoals(computedGoals);
    
    const agg = computeAggregatePortfolio(computedGoals, geoWeights, returnsConfig);
    setAggregateAllocations(agg);
    
    setAppState('DASHBOARD');
  };`;

const newHandleProfileCompleteBody = `const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    updatePortfolio(p, rawGoals, returnsConfig);
    setAppState('DASHBOARD');
  };`;

c = c.replace(handleProfileCompleteBody, newHandleProfileCompleteBody);

// Replace handleAddGoal body
const handleAddGoalBody = `const handleAddGoal = (goal: Goal) => {
    const newGoals = [...rawGoals, goal];
    setRawGoals(newGoals);
    
    if (profile) {
      const riskScore = calculateRiskScore(profile);
      const geoWeights = calculateGeographicWeights(profile);
      
      const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig });
      setGoals([...goals, computedGoal]);
      
      const agg = computeAggregatePortfolio(newGoals, geoWeights, returnsConfig);
      setAggregateAllocations(agg);
    }
    
    setAppState('DASHBOARD');
  };`;

const newHandleAddGoalBody = `const handleAddGoal = (goal: Goal) => {
    const newGoals = [...rawGoals, goal];
    setRawGoals(newGoals);
    
    if (profile) {
      updatePortfolio(profile, newGoals, returnsConfig);
    }
    
    setAppState('DASHBOARD');
  };`;
c = c.replace(handleAddGoalBody, newHandleAddGoalBody);

// Replace Settings onSave
const settingsOnSave = `onSave={(newConfig) => {
              setReturnsConfig(newConfig);
              if (profile && rawGoals.length > 0) {
                const riskScore = calculateRiskScore(profile);
                const geoWeights = calculateGeographicWeights(profile);
                const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig: newConfig }));
                setGoals(computedGoals);
                const agg = computeAggregatePortfolio(computedGoals, geoWeights, newConfig);
                setAggregateAllocations(agg);
              }
              setAppState(previousState);
            }}`;

const newSettingsOnSave = `onSave={(newConfig) => {
              setReturnsConfig(newConfig);
              if (profile && rawGoals.length > 0) {
                updatePortfolio(profile, rawGoals, newConfig);
              }
              setAppState(previousState);
            }}`;
c = c.replace(settingsOnSave, newSettingsOnSave);

writeFileSync('src/App.tsx', c);
