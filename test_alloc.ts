import { computeAggregatePortfolio, computeGoalGlidePath } from './src/lib/math';
import { Goal } from './src/types';

const goals: Goal[] = [
  {
    id: 'g2',
    name: 'High Target',
    type: 'LumpSum',
    pv: 1000000,
    c: 10000,
    t: 20,
    target: 5000000,
    applyInflation: false
  }
];

const riskScore = 9;
const geoWeights = { US: 0.24, Europe: 0.16, EM: 0.60 };

const computedGoals = goals.map(g => computeGoalGlidePath(g, riskScore, geoWeights));
console.log('rStar:', computedGoals[0].requiredIrr);
console.log('theta:', computedGoals[0].theta);

const agg = computeAggregatePortfolio(computedGoals, geoWeights);
console.log(agg[0]);

