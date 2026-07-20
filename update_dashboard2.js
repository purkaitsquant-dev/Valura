import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!c.includes("import React, { useState } from 'react';")) {
  c = c.replace(
      "import { useState } from 'react';",
      "import React, { useState } from 'react';"
  );
}

const target = `<tbody className="divide-y divide-gray-100">
              {allocationsToDisplay.map((alloc, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{i}</td>{/* REMOVED DUMMY */}                  {Object.keys(COLORS).map(k => (
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
                  {/* replaced above */}                </tr>
              ))}
            </tbody>`;

const replacement = `<tbody className="divide-y divide-gray-100">
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

c = c.replace(target, replacement);

writeFileSync('src/components/Dashboard.tsx', c);
