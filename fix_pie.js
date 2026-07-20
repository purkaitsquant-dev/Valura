import { readFileSync, writeFileSync } from 'fs';
let d = readFileSync('src/components/Dashboard.tsx', 'utf8');

d = d.replace(
    'const initialAlloc = aggregateAllocations[0] || {};',
    'const initialAlloc = allocationsToDisplay[0] || {};'
);

writeFileSync('src/components/Dashboard.tsx', d);
