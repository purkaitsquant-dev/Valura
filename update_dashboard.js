import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/components/Dashboard.tsx', 'utf8');

c = c.replace(
    /const COLORS = \{[^]*?\};/,
    `const COLORS = {
  CASH: '#10B981', // emerald-500
  BOND_DIR: '#6366F1', // indigo-500
  US_ETF: '#3B82F6', // blue-500
  US_MF: '#2563EB', // blue-600
  US_STOCKS: '#1D4ED8', // blue-700
  EU_ETF: '#F59E0B', // amber-500
  EU_MF: '#D97706', // amber-600
  EU_STOCKS: '#B45309', // amber-700
  EM_ETF: '#EF4444', // red-500
  EM_MF: '#DC2626', // red-600
  EM_STOCKS: '#B91C1C', // red-700
  REIT: '#8B5CF6', // violet-500
  GOLD: '#EAB308', // yellow-500
  STRUCTURED: '#06B6D4', // cyan-500
  PRIVATE: '#EC4899', // pink-500
};`
);

// We should also show STRUCTURED_RETURN and STRUCTURED_BASKET if present
c = c.replace(
    '                  {Object.keys(COLORS).map(k => (',
    `                  {Object.keys(COLORS).map(k => (
                    <td key={k} className="px-6 py-3 text-gray-600">
                      {((alloc[k as keyof AllocationMap] || 0) * 100).toFixed(1)}%
                    </td>
                  ))}
                  {(alloc as any).STRUCTURED_RETURN && (
                     <td className="px-6 py-3 text-gray-500 text-xs col-span-full border-t border-gray-50 bg-gray-50">
                        Structured Note Return: {((alloc as any).STRUCTURED_RETURN * 100).toFixed(2)}% <br/>
                        Basket: {(alloc as any).STRUCTURED_BASKET}
                     </td>
                  )}
                  {/* replaced above */}`
);

// We can just add a single row underneath if there's a structured product
c = c.replace(
    '                  {Object.keys(COLORS).map(k => (',
    `{/* REMOVED DUMMY */}                  {Object.keys(COLORS).map(k => (`
);

writeFileSync('src/components/Dashboard.tsx', c);
