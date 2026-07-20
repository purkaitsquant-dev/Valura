import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalsSetupProps {
  onComplete: (goals: Goal[]) => void;
}

const defaultGoals: Goal[] = [
  {
    id: 'g1',
    name: 'Retirement',
    type: 'Retirement',
    pv: 100000,
    c: 10000,
    t: 20,
    income: 50000,
    retirementDuration: 30
  },
  {
    id: 'g2',
    name: 'House Down-payment',
    type: 'LumpSum',
    pv: 20000,
    c: 5000,
    t: 8,
    target: 200000,
    applyInflation: true
  },
  {
    id: 'g3',
    name: 'Kids College',
    type: 'LumpSum',
    pv: 10000,
    c: 2000,
    t: 15,
    target: 150000,
    applyInflation: true
  }
];

export function GoalsSetup({ onComplete }: GoalsSetupProps) {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);

  const handleRemove = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleComplete = () => {
    onComplete(goals);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Set Your Financial Goals
        </h2>
        <p className="text-gray-500 mt-2">
          We have pre-filled three common goals. You can edit these later from the dashboard. Review them and proceed to your risk profile.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {goals.map(goal => (
          <div key={goal.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-900">{goal.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {goal.type === 'Retirement' ? 'Retirement Income' : 'Lump Sum Target'} • {goal.t} Years
              </p>
            </div>
            <div className="text-right">
              {goal.type === 'Retirement' ? (
                <div className="text-sm text-gray-900 font-medium">Target Income: ${goal.income?.toLocaleString()}</div>
              ) : (
                <div className="text-sm text-gray-900 font-medium">Target: ${goal.target?.toLocaleString()}</div>
              )}
              <button 
                onClick={() => handleRemove(goal.id)}
                className="text-red-500 text-sm hover:text-red-700 mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="text-gray-500 text-center py-4">No goals selected. Proceed to add them later.</div>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleComplete}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Next: Risk Profile
        </button>
      </div>
    </div>
  );
}
