import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/types.ts', 'utf8');

const t = `export interface ReturnsConfig {
  returns: {
    CASH: { ret: number; vol?: number };
    BOND_DIR: { ret: number; vol?: number };
    REIT: { ret: number; vol?: number };
    GOLD: { ret: number; vol?: number };
  };
  regional: {
    US: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
    Europe: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
    EM: {
      etf: { ret: number; vol?: number };
      mf: { ret: number; vol?: number };
      stocks: { ret: number; vol?: number };
    };
  };
}

export type RiskScore =`;

c = c.replace('export type RiskScore =', t);
writeFileSync('src/types.ts', c);
