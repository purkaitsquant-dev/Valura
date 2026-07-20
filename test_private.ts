import { computeAggregatePortfolio, computeGoalGlidePath } from './src/lib/math';
import { Goal } from './src/types';

const goals: Goal[] = [
  {
    id: 'g1',
    name: 'Retirement',
    type: 'LumpSum',
    pv: 1000000,
    c: 10000,
    t: 15,
    target: 5000000,
    applyInflation: false
  }
];

const riskScore = 9;
const geoWeights = { US: 0.24, Europe: 0.16, EM: 0.60 };

const computedGoals = goals.map(g => computeGoalGlidePath(g, riskScore, geoWeights));
console.log('Theta:', computedGoals[0].theta);
const agg = computeAggregatePortfolio(computedGoals, geoWeights);

for(let i=0; i<=15; i++) {
  console.log(`Year ${i} PRIVATE: ${(agg[i].PRIVATE || 0).toFixed(4)}`);
}
