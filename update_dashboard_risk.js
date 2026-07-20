import { readFileSync, writeFileSync } from 'fs';
let d = readFileSync('src/components/Dashboard.tsx', 'utf8');

d = d.replace(
    'Risk Usage: {(goal.theta * 100).toFixed(0)}% of Max',
    'Risk Usage: {(goal.theta * 100).toFixed(0)}% (Score: {goal.effectiveRiskScore})'
);

writeFileSync('src/components/Dashboard.tsx', d);
