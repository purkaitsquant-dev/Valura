import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.tsx', 'utf8');

if (!c.includes("import { Settings } from './components/Settings';")) {
  c = c.replace(
      "import { InfoPage } from './components/InfoPage';",
      "import { InfoPage } from './components/InfoPage';\nimport { Settings } from './components/Settings';\nimport { config } from './config';\nimport { ReturnsConfig } from './types';"
  );
}

c = c.replace(
    "type AppState = 'GOALS_SETUP' | 'ONBOARDING' | 'DASHBOARD' | 'GOAL_FORM' | 'INFO';",
    "type AppState = 'GOALS_SETUP' | 'ONBOARDING' | 'DASHBOARD' | 'GOAL_FORM' | 'INFO' | 'SETTINGS';"
);

if (!c.includes("const [returnsConfig, setReturnsConfig] =")) {
  c = c.replace(
      "  const [aggregateAllocations, setAggregateAllocations] = useState<AllocationMap[]>([]);",
      `  const [aggregateAllocations, setAggregateAllocations] = useState<AllocationMap[]>([]);
  const [returnsConfig, setReturnsConfig] = useState<ReturnsConfig>({
    returns: {
      CASH: { ret: config.returns.CASH.ret },
      BOND_DIR: { ret: config.returns.BOND_DIR.ret },
      REIT: { ret: config.returns.REIT.ret },
      GOLD: { ret: config.returns.GOLD.ret }
    },
    regional: {
      US: {
        etf: { ret: config.regional.US.etf.ret },
        mf: { ret: config.regional.US.mf.ret },
        stocks: { ret: config.regional.US.stocks.ret }
      },
      Europe: {
        etf: { ret: config.regional.Europe.etf.ret },
        mf: { ret: config.regional.Europe.mf.ret },
        stocks: { ret: config.regional.Europe.stocks.ret }
      },
      EM: {
        etf: { ret: config.regional.EM.etf.ret },
        mf: { ret: config.regional.EM.mf.ret },
        stocks: { ret: config.regional.EM.stocks.ret }
      }
    }
  });`
  );
}

// In handleProfileComplete
c = c.replace(
    'const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { allowRiskOverride: true }));',
    'const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig }));'
);
c = c.replace(
    'const agg = computeAggregatePortfolio(computedGoals, geoWeights);',
    'const agg = computeAggregatePortfolio(computedGoals, geoWeights, returnsConfig);'
);

// In handleAddGoal
c = c.replace(
    'const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { allowRiskOverride: true });',
    'const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig });'
);
c = c.replace(
    'const agg = computeAggregatePortfolio(newGoals, geoWeights);',
    'const agg = computeAggregatePortfolio(newGoals, geoWeights, returnsConfig);'
);

// In header
const targetHeader = `<div className="flex items-center gap-6 text-sm">
            {appState !== 'INFO' ? (
              <button onClick={() => { setPreviousState(appState); setAppState('INFO'); }} className="text-blue-600 hover:text-blue-800 font-medium">
                Methodology & Blueprint
              </button>
            ) : (
              <button onClick={() => setAppState(previousState)} className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Tool
              </button>
            )}`;

const newHeader = `<div className="flex items-center gap-6 text-sm">
            {appState !== 'INFO' && appState !== 'SETTINGS' ? (
              <>
                <button onClick={() => { setPreviousState(appState); setAppState('SETTINGS'); }} className="text-gray-600 hover:text-gray-900 font-medium">
                  Expected Returns
                </button>
                <button onClick={() => { setPreviousState(appState); setAppState('INFO'); }} className="text-blue-600 hover:text-blue-800 font-medium">
                  Methodology & Blueprint
                </button>
              </>
            ) : (
              <button onClick={() => setAppState(previousState)} className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Tool
              </button>
            )}`;

c = c.replace(targetHeader, newHeader);

// In body
const targetBody = `{appState === 'DASHBOARD' && (`;
const newBody = `{appState === 'SETTINGS' && (
          <Settings 
            currentConfig={returnsConfig}
            onSave={(newConfig) => {
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
            }}
            onCancel={() => setAppState(previousState)}
          />
        )}
        {appState === 'DASHBOARD' && (`;
c = c.replace(targetBody, newBody);

writeFileSync('src/App.tsx', c);
