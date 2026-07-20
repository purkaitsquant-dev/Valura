import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 40,
    country: 'IN',
    incomeStability: 10,
    savingsRate: 10,
    yearsToWithdrawal: 10,
    lossResponse: 7,
    insurance: 10,
    maxLoss: 6,
    t1: 4,
    t2: 3,
    t3: 3,
    t4: 3,
    t5: 4,
    t6: 4,
    t7: 3,
    g1: 2,
    g2: 0,
    g3: ['EM', 'US', 'Europe'],
    g4: 2,
    g5: 'None',
    g6: null,
  });

  const update = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile as UserProfile);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {step === 1 && "Demographics & Capacity"}
          {step === 2 && "Risk Tolerance"}
          {step === 3 && "Geographic Tilt"}
        </h2>
        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input type="number" required min="18" max="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                  value={profile.age || ''} onChange={e => update('age', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country Code (e.g. IN, US)</label>
                <input type="text" required maxLength={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                  value={profile.country || ''} onChange={e => update('country', e.target.value.toUpperCase())} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">How stable is your current income?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.incomeStability || ''} onChange={e => update('incomeStability', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="10">Very stable</option>
                <option value="8">Stable</option>
                <option value="5">Somewhat variable</option>
                <option value="2">Highly variable</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">% of income available for savings?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.savingsRate || ''} onChange={e => update('savingsRate', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="10">&gt; 30%</option>
                <option value="8">20-30%</option>
                <option value="6">10-20%</option>
                <option value="4">5-10%</option>
                <option value="2">&lt; 5%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Years until you need to start withdrawing?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.yearsToWithdrawal || ''} onChange={e => update('yearsToWithdrawal', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="10">&gt; 20 years</option>
                <option value="8">15-20 years</option>
                <option value="6">10-15 years</option>
                <option value="4">5-10 years</option>
                <option value="2">&lt; 5 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">If portfolio lost 20%, how cover expenses?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.lossResponse || ''} onChange={e => update('lossResponse', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="10">Easily from other sources</option>
                <option value="7">With adjustments</option>
                <option value="4">Would have to sell at a loss</option>
                <option value="1">Not possible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adequate insurance?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.insurance || ''} onChange={e => update('insurance', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="10">Yes</option>
                <option value="5">Partial</option>
                <option value="2">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max acceptable loss in 12 months?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.maxLoss || ''} onChange={e => update('maxLoss', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="0">0%</option>
                <option value="2">&lt; 5%</option>
                <option value="4">5-10%</option>
                <option value="6">10-20%</option>
                <option value="8">20-30%</option>
                <option value="10">&gt; 30%</option>
              </select>
            </div>
            
            <div className="flex justify-end pt-4">
              <button type="button" onClick={handleNext} className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {[
              { id: 't1', label: 'Willing to accept higher volatility for higher long-term returns' },
              { id: 't2', label: 'Anxious when portfolio drops, even if not needed' },
              { id: 't3', label: 'Prefer steady, predictable returns' },
              { id: 't4', label: 'Rather miss gains than risk large loss' },
              { id: 't5', label: 'Comfortable with assets that can lose 30%+' }
            ].map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{q.label} (1 = Strongly Disagree, 5 = Strongly Agree)</label>
                <div className="flex gap-4">
                  {[1,2,3,4,5].map(v => (
                    <label key={v} className="flex items-center gap-1">
                      <input type="radio" name={q.id} value={v} required
                        checked={profile[q.id as keyof UserProfile] === v}
                        onChange={() => update(q.id as keyof UserProfile, v)}
                      /> {v}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Market decline scenario:</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.t6 || ''} onChange={e => update('t6', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="1">Sell immediately</option>
                <option value="2">Wait for small rebound then sell</option>
                <option value="4">Hold and do nothing</option>
                <option value="5">Buy more expecting recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Investment preference:</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.t7 || ''} onChange={e => update('t7', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="1">Guaranteed 5% with no risk</option>
                <option value="3">50% chance of 20% gain, 50% chance 5% loss</option>
                <option value="5">50% chance of 40% gain, 50% chance 20% loss</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <button type="button" onClick={handleBack} className="text-gray-600 hover:text-gray-900 px-4 py-2">Back</button>
              <button type="button" onClick={handleNext} className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">% of future expenses in non-domestic currency?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.g1 || ''} onChange={e => update('g1', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="0">None</option>
                <option value="1">&lt; 20%</option>
                <option value="2">20-50%</option>
                <option value="3">&gt; 50%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confidence in home economy vs global?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.g2 || ''} onChange={e => update('g2', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="-2">Much stronger</option>
                <option value="-1">Slightly stronger</option>
                <option value="0">On par</option>
                <option value="1">Slightly weaker</option>
                <option value="2">Much weaker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rank growth expectations (1st to 3rd)</label>
              <div className="flex gap-2 mt-1">
                {['US', 'Europe', 'EM'].map((r, i) => (
                  <select key={i} className="flex-1 rounded-md border-gray-300 shadow-sm p-2 border"
                    value={profile.g3?.[i] || ''} 
                    onChange={e => {
                      const newG3 = [...(profile.g3 || ['US', 'Europe', 'EM'])];
                      newG3[i] = e.target.value;
                      update('g3', newG3);
                    }}>
                    <option value="US">US</option>
                    <option value="Europe">Europe</option>
                    <option value="EM">Emerging Markets</option>
                  </select>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Concern about currency risk when investing abroad?</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.g4 || ''} onChange={e => update('g4', parseInt(e.target.value))}>
                <option value="" disabled>Select...</option>
                <option value="0">Not concerned</option>
                <option value="1">Slightly</option>
                <option value="2">Moderately</option>
                <option value="3">Very concerned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Significant assets tied to a region?</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={profile.g5 || 'None'} onChange={e => update('g5', e.target.value)}>
                <option value="None">None</option>
                <option value="US">US</option>
                <option value="Europe">Europe</option>
                <option value="EM">Emerging Markets</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <button type="button" onClick={handleBack} className="text-gray-600 hover:text-gray-900 px-4 py-2">Back</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">Complete Profile</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
