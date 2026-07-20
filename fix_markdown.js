const fs = require('fs');
let content = fs.readFileSync('src/components/InfoPage.tsx', 'utf8');

// Replace template literal start
content = content.replace('const markdownContent = `', 'const markdownContent = String.raw`');

// Fix unescaped dollar signs in text that cause math block matching issues
content = content.replace('Cash: $8,000, Bonds: $25,000', 'Cash: \\$8,000, Bonds: \\$25,000');
content = content.replace('Long‑horizon equity (goals >10yr) = $200,000 → > $250k?', 'Long‑horizon equity (goals >10yr) = \\$200,000 → > \\$250k?');

// Fix dollar signs inside math mode
content = content.replace('$LR < \\\\$100,000$', '$LR < 100,000$');
content = content.replace('$LR = \\\\$33,000$', '$LR = 33,000$');
content = content.replace('$PV = \\\\$100,000$, $C = \\\\$10,000\\\\text{/year}$', '$\\text{PV} = 100,000$, $\\text{C} = 10,000\\text{/year}$');
content = content.replace('Desired income \\\\$50,000', 'Desired income \\$50,000');
content = content.replace('$50,000 \\\\times', '50,000 \\times'); // wait, First income = $50,000 \times 1.03^{20} = \$90,305$
// Wait, the First income line is:
// First income = $50,000 \\times 1.03^{20} = \\$90,305$.
// We want it to be:
// First income = $50,000 \times 1.03^{20} = 90,305$.
content = content.replace('First income = $50,000 \\\\times 1.03^{20} = \\\\$90,305$.', 'First income = $\\$50,000 \\times 1.03^{20} = \\$90,305$.'); // Wait, if I do this, kaTeX will fail on \$!
// Let's just make it outside math!
content = content.replace('First income = $50,000 \\\\times 1.03^{20} = \\\\$90,305$.', 'First income = $\\text{\\$50,000} \\times 1.03^{20} = \\text{\\$90,305}$.');
content = content.replace('$FV = 90,305 \\\\times \\\\frac{1 - 1.0506^{-30}}{0.0506} \\\\approx \\\\$1,386,000$.', '$FV = 90,305 \\times \\frac{1 - 1.0506^{-30}}{0.0506} \\approx 1,386,000$.');
content = content.replace('$PV = \\\\$20,000$, $C = \\\\$5,000$, $T=8$, target = \\\\$200,000$ (nominal).', '$\\text{PV} = 20,000$, $\\text{C} = 5,000$, $T=8$, target = \\$200,000 (nominal).');

// Wait, since I'm switching to String.raw, any existing \\ something will become \\ something!
// E.g. \\times will become literally \ \ t i m e s!
// I need to change all \\ to \ in the markdownContent string!
