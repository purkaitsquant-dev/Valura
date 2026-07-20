import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/lib/math.ts', 'utf8');

if (!c.includes('expectedReturn: expectedReturn,')) {
    c = c.replace(
        '  const fvMax = evaluateTheta(1);',
        '  const fvMax = evaluateTheta(1);\n  \n  let finalFV = fvMin;\n  let expectedReturn = 0;'
    );

    c = c.replace(
        '  if (fv <= fvMin) theta = 0;\n  else if (fv >= fvMax) theta = 1;',
        '  if (fv <= fvMin) {\n    theta = 0;\n    finalFV = fvMin;\n  } else if (fv >= fvMax) {\n    theta = 1;\n    finalFV = fvMax;\n  }'
    );

    c = c.replace(
        '      theta = (low + high) / 2;\n      const fvMid = evaluateTheta(theta);\n      if (Math.abs(fvMid - fv) < 1) break;\n      if (fvMid < fv) low = theta;\n      else high = theta;\n    }\n  }',
        '      theta = (low + high) / 2;\n      const fvMid = evaluateTheta(theta);\n      finalFV = fvMid;\n      if (Math.abs(fvMid - fv) < 1) break;\n      if (fvMid < fv) low = theta;\n      else high = theta;\n    }\n  }\n  \n  expectedReturn = solveRequiredIRR(goal.pv, goal.c, goal.t, finalFV);'
    );

    c = c.replace(
        '    requiredIrr: rStar,\n    theta,\n    allocations,\n    balances\n  };',
        '    requiredIrr: rStar,\n    expectedReturn,\n    theta,\n    allocations,\n    balances\n  };'
    );
}

writeFileSync('src/lib/math.ts', c);
