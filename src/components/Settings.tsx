import React, { useState } from 'react';
import { ReturnsConfig } from '../types';
import { config } from '../config';

interface SettingsProps {
  currentConfig: ReturnsConfig;
  onSave: (config: ReturnsConfig) => void;
  onCancel: () => void;
}

export function Settings({ currentConfig, onSave, onCancel }: SettingsProps) {
  const [formData, setFormData] = useState<ReturnsConfig>(currentConfig);

  const handleChange = (category: 'returns' | 'regional', key1: string, key2: string, value: string) => {
    const num = parseFloat(value) / 100;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (category === 'returns') {
        newData.returns = {
          ...newData.returns,
          [key1]: { ...newData.returns[key1 as keyof typeof newData.returns], [key2]: num }
        };
      } else {
        newData.regional = {
          ...newData.regional,
          [key1]: {
            ...newData.regional[key1 as keyof typeof newData.regional],
            [key2]: { ...newData.regional[key1 as keyof typeof newData.regional][key2 as 'etf'|'mf'|'stocks'], ret: num }
          }
        };
      }
      return newData;
    });
  };

  const handleReset = () => {
    setFormData({
      returns: {
        CASH: { ret: config.returns.CASH.ret },
        BOND_DIR: { ret: config.returns.BOND_DIR.ret },
        REIT: { ret: config.returns.REIT.ret },
        GOLD: { ret: config.returns.GOLD.ret }
      },
      regional: {
        US: {
          etf: { ret: config.regional.US.etf.ret },
          mf: { ret: config.regional.US.mf.ret },
          stocks: { ret: config.regional.US.stocks.ret }
        },
        Europe: {
          etf: { ret: config.regional.Europe.etf.ret },
          mf: { ret: config.regional.Europe.mf.ret },
          stocks: { ret: config.regional.Europe.stocks.ret }
        },
        EM: {
          etf: { ret: config.regional.EM.etf.ret },
          mf: { ret: config.regional.EM.mf.ret },
          stocks: { ret: config.regional.EM.stocks.ret }
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Expected Returns Configuration</h2>
        <div className="space-x-4">
          <button onClick={handleReset} className="text-sm font-medium text-gray-500 hover:text-gray-700">
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Base Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(formData.returns).map(asset => (
              <div key={asset}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{asset}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={(formData.returns[asset as keyof typeof formData.returns].ret * 100).toFixed(1)}
                    onChange={(e) => handleChange('returns', asset, 'ret', e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Equity</h3>
          <div className="space-y-6">
            {Object.keys(formData.regional).map(region => (
              <div key={region} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-800 mb-3">{region}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['etf', 'mf', 'stocks'].map(type => (
                    <div key={type}>
                      <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">{type}</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={(formData.regional[region as keyof typeof formData.regional][type as 'etf'|'mf'|'stocks'].ret * 100).toFixed(1)}
                          onChange={(e) => handleChange('regional', region, type, e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
