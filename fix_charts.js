import { readFileSync, writeFileSync } from 'fs';
let d = readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = `  const allocationsToDisplay = selectedGoal ? selectedGoal.allocations : aggregateAllocations;

  const chartData = allocationsToDisplay.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  }));

  const initialAlloc = allocationsToDisplay[0] || {};`;

const replacement = `  const allocationsToDisplay = selectedGoal ? selectedGoal.allocations : aggregateAllocations;
  const initialAlloc = allocationsToDisplay[0] || {};

  const aggregateChartData = aggregateAllocations.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  }));

  const goalChartData = selectedGoal ? selectedGoal.allocations.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  })) : [];`;

d = d.replace(target, replacement);

writeFileSync('src/components/Dashboard.tsx', d);
