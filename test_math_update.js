import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/lib/math.ts', 'utf8');

if (!c.includes('expectedReturn: number')) {
    c = c.replace('export interface ComputedGoal extends Goal {', 'export interface ComputedGoal extends Goal {\n  expectedReturn: number;');
}

writeFileSync('src/lib/math.ts', c);
