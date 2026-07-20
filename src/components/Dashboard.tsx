import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ComputedGoal, AllocationMap } from '../types';

interface DashboardProps {
  goals: ComputedGoal[];
  aggregateAllocations: AllocationMap[];
  onAddGoal: () => void;
}

const COLORS = {
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
};

export function Dashboard({ goals, aggregateAllocations, onAddGoal }: DashboardProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const selectedGoal = selectedGoalId ? goals.find(g => g.id === selectedGoalId) : null;
  const allocationsToDisplay = selectedGoal ? selectedGoal.allocations : aggregateAllocations;
  const initialAlloc = allocationsToDisplay[0] || {};

  const aggregateChartData = aggregateAllocations.map((alloc, idx) => ({
    year: `Year ${idx}`,
    ...alloc
  }));

  const goalChartData = selectedGoal ? selectedGoal.allocations.map((alloc, idx) => ({
    year: `Year ${idx}`,
    ...alloc
  })) : [];
  const pieData = Object.keys(initialAlloc)
    .filter(k => (initialAlloc[k as keyof AllocationMap] || 0) > 0)
    .map(k => ({
      name: k,
      value: initialAlloc[k as keyof AllocationMap]! * 100
    }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Portfolio Dashboard</h2>
        <button onClick={onAddGoal} className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
          + Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Initial Allocation Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Initial Allocation (Year 0)</h3>
            {selectedGoalId && (
              <button onClick={() => setSelectedGoalId(null)} className="text-sm text-blue-600 hover:text-blue-800">
                View Aggregate
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {pieData.map(entry => (
              <div key={entry.name} className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }} />
                <span>{entry.name} ({entry.value.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregate Glide Path Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Aggregate Portfolio Glide Path
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
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
                <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
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
      )}

      {/* Goals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Your Goals</h3>
          <span className="text-sm text-gray-500">Click a goal to view its specific allocations</span>
        </div>
        <div className="divide-y divide-gray-100">
          {goals.map(goal => (
            <div 
              key={goal.id} 
              onClick={() => setSelectedGoalId(goal.id === selectedGoalId ? null : goal.id)}
              className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${selectedGoalId === goal.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div>
                <h4 className="text-base font-medium text-gray-900">{goal.name}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {goal.type === 'LumpSum' ? 'Lump Sum Target' : 'Retirement Income'} • {goal.t} Years
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Required Return: {(goal.requiredIrr * 100).toFixed(2)}%
                </div>
                <div className="text-sm font-medium text-blue-600 mt-1">
                  Expected Return: {(goal.expectedReturn! * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Risk Usage: {(goal.theta * 100).toFixed(0)}% (Score: {goal.effectiveRiskScore})
                </div>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No goals added yet. Add a goal to see your personalized investment plan.
            </div>
          )}
        </div>
      </div>
      
      {/* Allocation Table */}
      {allocationsToDisplay.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedGoal ? `${selectedGoal.name} Annual Allocations (%)` : 'Aggregate Annual Allocations (%)'}
            </h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Year</th>
                {Object.keys(COLORS).map(k => <th key={k} className="px-6 py-3 font-medium">{k}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allocationsToDisplay.map((alloc, i) => (
                <React.Fragment key={i}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{i}</td>
                    {Object.keys(COLORS).map(k => (
                      <td key={k} className="px-6 py-3 text-gray-600">
                        {(((alloc[k as keyof AllocationMap] as number) || 0) * 100).toFixed(1)}%
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
