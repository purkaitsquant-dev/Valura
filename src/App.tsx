import React, { useState } from 'react';
import { UserProfile, Goal, ComputedGoal, AllocationMap } from './types';
import { GoalsSetup } from './components/GoalsSetup';
import { ProfileForm } from './components/ProfileForm';
import { GoalForm } from './components/GoalForm';
import { Dashboard } from './components/Dashboard';
import { InfoPage } from './components/InfoPage';
import { Settings } from './components/Settings';
import { config } from './config';
import { ReturnsConfig } from './types';
import { calculateRiskScore, calculateGeographicWeights, computeGoalGlidePath, computeAggregatePortfolio } from './lib/math';

type AppState = 'GOALS_SETUP' | 'ONBOARDING' | 'DASHBOARD' | 'GOAL_FORM' | 'INFO' | 'SETTINGS';

export default function App() {
  const [appState, setAppState] = useState<AppState>('GOALS_SETUP');
  const [previousState, setPreviousState] = useState<AppState>('GOALS_SETUP');
  const [rawGoals, setRawGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<ComputedGoal[]>([]);
  const [aggregateAllocations, setAggregateAllocations] = useState<AllocationMap[]>([]);
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
  });

    const updatePortfolio = (currentProfile: UserProfile, currentRawGoals: Goal[], currentConfig: ReturnsConfig) => {
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
  };

  const handleGoalsComplete = (initialGoals: Goal[]) => {
    setRawGoals(initialGoals);
    setAppState('ONBOARDING');
  };

  const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    
    const riskScore = calculateRiskScore(p);
    const geoWeights = calculateGeographicWeights(p);
    
        const computedGoals = rawGoals.map(g => computeGoalGlidePath(g, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig }));
    setGoals(computedGoals);
    
    const agg = computeAggregatePortfolio(computedGoals, geoWeights, returnsConfig);
    setAggregateAllocations(agg);

    setAppState('DASHBOARD');
  };

  const handleAddGoal = (goal: Goal) => {
    if (!profile) return;
    
    const riskScore = calculateRiskScore(profile);
    const geoWeights = calculateGeographicWeights(profile);
    
        const computedGoal = computeGoalGlidePath(goal, riskScore, geoWeights, { allowRiskOverride: true, returnsConfig });
    const newGoals = [...goals, computedGoal];
    setGoals(newGoals);
    setRawGoals([...rawGoals, goal]);
    
    const agg = computeAggregatePortfolio(newGoals, geoWeights, returnsConfig);
    setAggregateAllocations(agg);
    
    setAppState('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Investment Planner</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
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
            )}
            {profile && (
              <div className="flex items-center gap-4 text-sm border-l border-gray-200 pl-6">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                  Risk Score: {calculateRiskScore(profile)}
                </span>
                <button onClick={() => { setProfile(null); setGoals([]); setRawGoals([]); setAggregateAllocations([]); setAppState('GOALS_SETUP'); }} 
                  className="text-gray-500 hover:text-gray-900">
                  Reset Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState === 'INFO' && <InfoPage />}
        {appState === 'GOALS_SETUP' && <GoalsSetup onComplete={handleGoalsComplete} />}
        {appState === 'ONBOARDING' && <ProfileForm onComplete={handleProfileComplete} />}
        {appState === 'SETTINGS' && (
          <Settings 
            currentConfig={returnsConfig}
            onSave={(newConfig) => {
              setReturnsConfig(newConfig);
              if (profile && rawGoals.length > 0) {
                updatePortfolio(profile, rawGoals, newConfig);
              }
              setAppState(previousState);
            }}
            onCancel={() => setAppState(previousState)}
          />
        )}
        {appState === 'DASHBOARD' && (
          <Dashboard 
            goals={goals} 
            aggregateAllocations={aggregateAllocations} 
            onAddGoal={() => setAppState('GOAL_FORM')} 
          />
        )}
        {appState === 'GOAL_FORM' && (
          <div className="max-w-2xl mx-auto">
            <GoalForm onAdd={handleAddGoal} onCancel={() => setAppState('DASHBOARD')} />
          </div>
        )}
      </main>
    </div>
  );
}
