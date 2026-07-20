import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/types.ts', 'utf8');

if (!c.includes('expectedReturn?: number;')) {
    c = c.replace('requiredIrr: number;', 'requiredIrr: number;\n  expectedReturn?: number;');
}

writeFileSync('src/types.ts', c);
