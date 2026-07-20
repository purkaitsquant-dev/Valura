import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.tsx', 'utf8');

c = c.replace(/const customReturnsConfig = {[^]*?};\n/g, '');

c = c.replace(/\{ returnMultiplier: 1.0, allowRiskOverride: true, returnsConfig: customReturnsConfig \}/g, '{ allowRiskOverride: true }');
c = c.replace(/const agg = computeAggregatePortfolio\(computedGoals, geoWeights\);/g, 'const agg = computeAggregatePortfolio(computedGoals, geoWeights);');
c = c.replace(/const agg = computeAggregatePortfolio\(newGoals, geoWeights\);/g, 'const agg = computeAggregatePortfolio(newGoals, geoWeights);');

writeFileSync('src/App.tsx', c);
