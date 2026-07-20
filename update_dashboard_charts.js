import { readFileSync, writeFileSync } from 'fs';
let d = readFileSync('src/components/Dashboard.tsx', 'utf8');

const s = `  const allocationsToDisplay = selectedGoal ? selectedGoal.allocations : aggregateAllocations;
  const chartData = allocationsToDisplay.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  }));

  const initialAlloc = allocationsToDisplay[0] || {};`;

const newS = `  const aggregateChartData = aggregateAllocations.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  }));

  const goalChartData = selectedGoal ? selectedGoal.allocations.map((alloc, idx) => ({
    year: \`Year \${idx}\`,
    ...alloc
  })) : [];

  const allocationsToDisplay = selectedGoal ? selectedGoal.allocations : aggregateAllocations;
  const initialAlloc = aggregateAllocations[0] || {};`;

d = d.replace(s, newS);

// Now for the JSX AreaChart part
const jsxS = `        {/* Aggregate Glide Path Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedGoal ? \`\${selectedGoal.name} Glide Path\` : 'Aggregate Portfolio Glide Path'}
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => \`\${(val * 100).toFixed(0)}%\`} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => \`\${(value * 100).toFixed(1)}%\`} />
                {Object.keys(COLORS).reverse().map(key => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[key as keyof typeof COLORS]}
                    fill={COLORS[key as keyof typeof COLORS]}
                    fillOpacity={0.8}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>`;

const newJsxS = `        {/* Aggregate Glide Path Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Aggregate Portfolio Glide Path
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => \`\${(val * 100).toFixed(0)}%\`} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => \`\${(value * 100).toFixed(1)}%\`} />
                {Object.keys(COLORS).reverse().map(key => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[key as keyof typeof COLORS]}
                    fill={COLORS[key as keyof typeof COLORS]}
                    fillOpacity={0.8}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Goal Specific Glide Path Area Chart */}
      {selectedGoal && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedGoal.name} Glide Path
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={goalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => \`\${(val * 100).toFixed(0)}%\`} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => \`\${(value * 100).toFixed(1)}%\`} />
                {Object.keys(COLORS).reverse().map(key => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[key as keyof typeof COLORS]}
                    fill={COLORS[key as keyof typeof COLORS]}
                    fillOpacity={0.8}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}`;

d = d.replace(jsxS, newJsxS);

writeFileSync('src/components/Dashboard.tsx', d);
