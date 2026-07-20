import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/config.ts', 'utf8');

c = c.replace(/CASH:       \{ ret: [0-9.]+, vol: [0-9.]+ \}/, 'CASH:       { ret: 0.035, vol: 0.005 }');
c = c.replace(/BOND_DIR:   \{ ret: [0-9.]+,  vol: [0-9.]+  \}/, 'BOND_DIR:   { ret: 0.055,  vol: 0.04  }');
c = c.replace(/REIT:       \{ ret: [0-9.]+, vol: [0-9.]+  \}/, 'REIT:       { ret: 0.085, vol: 0.18  }');
c = c.replace(/GOLD:       \{ ret: [0-9.]+, vol: [0-9.]+  \}/, 'GOLD:       { ret: 0.065, vol: 0.15  }');

c = c.replace(/US: \{ etf_return: [0-9.]+, mf_return: [0-9.]+, vol: [0-9.]+ \}/, 'US: { etf_return: 0.10, mf_return: 0.095, vol: 0.15 }');
c = c.replace(/Europe: \{ etf_return: [0-9.]+, mf_return: [0-9.]+, vol: [0-9.]+ \}/, 'Europe: { etf_return: 0.09, mf_return: 0.085, vol: 0.16 }');
c = c.replace(/EM: \{ etf_return: [0-9.]+, mf_return: [0-9.]+, vol: [0-9.]+ \}/, 'EM: { etf_return: 0.11, mf_return: 0.105, vol: 0.22 }');

c = c.replace(/1:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '1:  { total_equity: 0.20, cash: 0.30, bonds: 0.50, reit: 0.0, gold: 0.0 }');
c = c.replace(/2:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '2:  { total_equity: 0.30, cash: 0.20, bonds: 0.50, reit: 0.0, gold: 0.0 }');
c = c.replace(/3:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '3:  { total_equity: 0.40, cash: 0.15, bonds: 0.45, reit: 0.0, gold: 0.0 }');
c = c.replace(/4:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '4:  { total_equity: 0.50, cash: 0.10, bonds: 0.40, reit: 0.0, gold: 0.0 }');
c = c.replace(/5:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '5:  { total_equity: 0.60, cash: 0.05, bonds: 0.35, reit: 0.0, gold: 0.0 }');
c = c.replace(/6:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '6:  { total_equity: 0.70, cash: 0.00, bonds: 0.30, reit: 0.0, gold: 0.0 }');
c = c.replace(/7:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '7:  { total_equity: 0.80, cash: 0.00, bonds: 0.10, reit: 0.05, gold: 0.05 }');
c = c.replace(/8:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '8:  { total_equity: 0.85, cash: 0.00, bonds: 0.05, reit: 0.10, gold: 0.0 }');
c = c.replace(/9:  \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '9:  { total_equity: 0.90, cash: 0.00, bonds: 0.00, reit: 0.10, gold: 0.0 }');
c = c.replace(/10: \{ total_equity: [0-9.]+, cash: [0-9.]+, bonds: [0-9.]+, reit: [0-9.]+, gold: [0-9.]+ \}/, '10: { total_equity: 0.95, cash: 0.00, bonds: 0.00, reit: 0.05, gold: 0.00 }');

writeFileSync('src/config.ts', c);
