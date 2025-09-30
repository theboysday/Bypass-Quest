
import React from 'react';
import { RelayIndicator } from './RelayIndicator';
import { StatusIndicator } from './StatusIndicator';
import type { PanelData, BypassState } from '../types';

interface PanelProps {
  panelData: PanelData;
  onBypassChange: (panelName: string, newBypassState: BypassState) => void;
  isGameSolved: boolean;
}

export const Panel: React.FC<PanelProps> = ({ panelData, onBypassChange, isGameSolved }) => {
  const { name, bypass, cr1, cr2, crbp, status } = panelData;
  const isMaster = name === 'Master';
  const isRunning = status === 'Running';

  const baseBorder = 'border-2 rounded-xl shadow-lg transition-all duration-300';
  const borderColor = isRunning ? 'border-green-500/80 shadow-green-500/20' : 'border-red-500/80 shadow-red-500/20';
  const bgColor = 'bg-gray-800/80 backdrop-blur-sm';

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onBypassChange(name, event.target.value as BypassState);
  };

  return (
    <div className={`${baseBorder} ${borderColor} ${bgColor} p-3 flex flex-col justify-between`}>
      <div>
        <h3 className={`font-bold text-lg text-center mb-2 ${isRunning ? 'text-gray-100' : 'text-gray-400'}`}>{name}</h3>
        <StatusIndicator status={status} />
        <div className="mt-3 border-t border-gray-700 pt-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-2 text-center">Relays</h4>
          <div className="flex justify-center space-x-3">
            <RelayIndicator label="CR-1" isActive={cr1 === 1} />
            <RelayIndicator label="CR-2" isActive={cr2 === 1} />
            {isMaster && <RelayIndicator label="CR-BP" isActive={crbp === 1} />}
          </div>
        </div>
      </div>

      {!isMaster && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-2 text-center">Bypass</h4>
          <div className="flex justify-around text-sm">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name={`bypass-${name}`}
                value="ON"
                checked={bypass === 'ON'}
                onChange={handleRadioChange}
                disabled={isGameSolved}
                className="form-radio text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 disabled:opacity-50"
              />
              <span>ON</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name={`bypass-${name}`}
                value="OFF"
                checked={bypass === 'OFF'}
                onChange={handleRadioChange}
                disabled={isGameSolved}
                className="form-radio text-pink-500 bg-gray-700 border-gray-600 focus:ring-pink-500 disabled:opacity-50"
              />
              <span>OFF</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
