import { readFileSync, writeFileSync } from 'fs';

// Fix Dashboard.tsx
let d = readFileSync('src/components/Dashboard.tsx', 'utf8');
d = d.replace(
    '{((alloc[k as keyof AllocationMap] || 0) * 100).toFixed(1)}%',
    '{(((alloc[k as keyof AllocationMap] as number) || 0) * 100).toFixed(1)}%'
);
writeFileSync('src/components/Dashboard.tsx', d);

// Fix math.ts
let m = readFileSync('src/lib/math.ts', 'utf8');
m = m.replace(
    'res[key] = (A[key] || 0) * weightA + (B[key] || 0) * (1 - weightA);',
    'if (key !== "STRUCTURED_BASKET") (res as any)[key] = ((A[key] as number) || 0) * weightA + ((B[key] as number) || 0) * (1 - weightA); else (res as any)[key] = A[key];'
);
writeFileSync('src/lib/math.ts', m);
