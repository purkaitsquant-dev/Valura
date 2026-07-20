import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/components/Dashboard.tsx', 'utf8');

const s = c.substring(c.indexOf('<tbody'), c.indexOf('</tbody>') + 8);
const newS = `<tbody className="divide-y divide-gray-100">
              {allocationsToDisplay.map((alloc, i) => (
                <React.Fragment key={i}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{i}</td>
                    {Object.keys(COLORS).map(k => (
                      <td key={k} className="px-6 py-3 text-gray-600">
                        {((alloc[k as keyof AllocationMap] || 0) * 100).toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  {(alloc as any).STRUCTURED_RETURN ? (
                    <tr className="bg-cyan-50/30">
                      <td colSpan={Object.keys(COLORS).length + 1} className="px-6 py-2 text-xs text-gray-500">
                        <span className="font-medium text-cyan-700">Structured Note Return:</span> {((alloc as any).STRUCTURED_RETURN * 100).toFixed(2)}% | <span className="font-medium text-cyan-700">Basket:</span> {(alloc as any).STRUCTURED_BASKET}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>`;

writeFileSync('src/components/Dashboard.tsx', c.replace(s, newS));
