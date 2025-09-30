
import React from 'react';

interface RelayIndicatorProps {
  label: string;
  isActive: boolean;
}

export const RelayIndicator: React.FC<RelayIndicatorProps> = ({ label, isActive }) => {
  const lightColor = isActive ? 'bg-green-400' : 'bg-red-500/50';
  const pulseClass = isActive ? 'animate-pulse' : '';

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
        <div className={`w-3 h-3 rounded-full ${lightColor} ${pulseClass} transition-colors duration-300`}></div>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
};
