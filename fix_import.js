import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/lib/math.ts', 'utf8');
c = c.replace("import { config } from './config';", "import { config } from '../config';");
c = c.replace("import { Goal, UserProfile, ComputedGoal, AllocationMap } from './types';", "import { Goal, UserProfile, ComputedGoal, AllocationMap } from '../types';");
writeFileSync('src/lib/math.ts', c);
