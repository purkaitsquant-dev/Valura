import { computeAggregatePortfolio, computeGoalGlidePath } from './src/lib/math';
import { Goal } from './src/types';

// Let's test a stateful loop conceptually
let privateMarketActivated = false;

for (let y = 0; y <= 15; y++) {
    let longHorizonEquity = 300000;
    if (y > 12) longHorizonEquity = 300000 * (15 - y) / 3;
    
    if (longHorizonEquity >= 250000) {
        privateMarketActivated = true;
    }
    
    if (privateMarketActivated && longHorizonEquity > 0) {
        const pAmount = Math.min(0.2 * longHorizonEquity, 0.2 * longHorizonEquity);
        console.log(`Year ${y}: pAmount=${pAmount}`);
    } else {
        console.log(`Year ${y}: pAmount=0`);
    }
}
