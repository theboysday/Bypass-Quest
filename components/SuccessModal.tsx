
import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  faultyPanel: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, faultyPanel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-2 border-cyan-500">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
        <p className="text-gray-300 mb-6">
          You've successfully isolated the fault at <span className="font-bold text-cyan-400">{faultyPanel}</span>. Check the communication cable and relay.
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-300"
        >
          Play New Scenario
        </button>
      </div>
    </div>
  );
};
