import React, { useState } from 'react';
import { Goal, GoalType } from '../types';

interface GoalFormProps {
  onAdd: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ onAdd, onCancel }: GoalFormProps) {
  const [type, setType] = useState<GoalType>('Retirement');
  const [name, setName] = useState('Retirement');
  const [pv, setPv] = useState<number>(100000);
  const [c, setC] = useState<number>(10000);
  const [t, setT] = useState<number>(20);
  
  // LumpSum specific
  const [target, setTarget] = useState<number>(200000);
  const [applyInflation, setApplyInflation] = useState(true);

  // Retirement specific
  const [income, setIncome] = useState<number>(50000);
  const [retirementDuration, setRetirementDuration] = useState<number>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    onAdd({
      id, name, type, pv, c, t,
      ...(type === 'LumpSum' ? { target, applyInflation } : { income, retirementDuration })
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Add New Goal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Goal Type</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'LumpSum'} onChange={() => setType('LumpSum')} />
              Lump Sum Target
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'Retirement'} onChange={() => setType('Retirement')} />
              Retirement Income
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Goal Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="e.g. Buy a House" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Savings (PV)</label>
            <input type="number" required min="0" value={pv} onChange={e => setPv(Number(e.target.value))} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Annual Contribution</label>
            <input type="number" required min="0" value={c} onChange={e => setC(Number(e.target.value))} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Years to Goal</label>
            <input type="number" required min="1" max="100" value={t} onChange={e => setT(Number(e.target.value))} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
        </div>

        {type === 'LumpSum' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Amount (Today's Value)</label>
              <input type="number" required min="0" value={target} onChange={e => setTarget(Number(e.target.value))} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={applyInflation} onChange={e => setApplyInflation(e.target.checked)} />
                Apply Inflation (3%)
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Desired Annual Income (Today's Value)</label>
              <input type="number" required min="0" value={income} onChange={e => setIncome(Number(e.target.value))} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Retirement Duration (Years)</label>
              <input type="number" required min="1" max="50" value={retirementDuration} onChange={e => setRetirementDuration(Number(e.target.value))} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
          <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">Save Goal</button>
        </div>
      </form>
    </div>
  );
}
