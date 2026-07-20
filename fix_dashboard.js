import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!c.includes('Expected Return:')) {
    c = c.replace(
        '                  Required Return: {(goal.requiredIrr * 100).toFixed(2)}%\n                </div>',
        '                  Required Return: {(goal.requiredIrr * 100).toFixed(2)}%\n                </div>\n                <div className="text-sm font-medium text-blue-600 mt-1">\n                  Expected Return: {(goal.expectedReturn! * 100).toFixed(2)}%\n                </div>'
    );
}

writeFileSync('src/components/Dashboard.tsx', c);
