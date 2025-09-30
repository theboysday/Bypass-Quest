
import React, { useState, useEffect, useCallback } from 'react';
import { Panel } from './components/Panel';
import { SuccessModal } from './components/SuccessModal';
import { Footer } from './components/Footer';
import { generateScenario } from './services/scenarioService';
import type { PanelData, BypassState } from './types';

const App: React.FC = () => {
  const [panels, setPanels] = useState<PanelData[]>([]);
  const [faultPanelName, setFaultPanelName] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('Welcome! Click "Start New Scenario" to begin.');
  const [attempts, setAttempts] = useState<number>(0);

  const startNewScenario = useCallback(() => {
    const scenario = generateScenario();
    // Start with all bypasses OFF and all panels not running
    const initialPanels = scenario.panels.map(p => ({
      ...p,
      bypass: 'OFF' as BypassState,
      status: 'Not running',
      cr1: 0,
      cr2: 0,
      crbp: p.name === 'Master' ? 1 : 0, // Master CRBP is always on conceptually
    }));
    
    // Set initial dead state
    const deadStatePanels = initialPanels.map((p, index) => {
      if (index === 0) { // Master
        return { ...p, status: 'Running', cr1: 1, cr2: 1 };
      }
      if (index === 1 && p.name === scenario.faultPanel) { // If child 1 is the fault
        return {...p, status: 'Not running', cr1: 1, cr2: 0};
      }
      if (index === 1) { // If child 1 is not the fault
        return {...p, status: 'Running', cr1: 1, cr2: 1};
      }
      return p;
    });

    // Manually calculate the initial "dead" state
    let commActive = true;
    const finalInitialPanels = scenario.panels.map(p => {
        const panelState = {...p, bypass: 'OFF' as BypassState};
        if (commActive) {
            panelState.status = 'Running';
            panelState.cr1 = 1;
            panelState.cr2 = 1;

            if(p.name === 'Master') {
                panelState.crbp = 1;
            }

            if (p.fault === 1 && p.bypass === 'OFF') {
                commActive = false;
                panelState.status = 'Not running';
                panelState.cr2 = 0;
            }
        } else {
            panelState.status = 'Not running';
            panelState.cr1 = 0;
            panelState.cr2 = 0;
        }
        return panelState;
    });

    setPanels(finalInitialPanels);
    setFaultPanelName(scenario.faultPanel);
    setIsSolved(false);
    setFeedback('A fault has occurred in the system. Use the bypass switches to isolate it.');
    setAttempts(0);
  }, []);

  useEffect(() => {
    // This effect is not used to start the game to avoid running on every render.
    // The user explicitly starts the game with the button.
  }, []);

  const handleBypassChange = (panelName: string, newBypassState: BypassState) => {
    if (isSolved) return;

    setAttempts(prev => prev + 1);

    const updatedPanels = panels.map(p => 
      p.name === panelName ? { ...p, bypass: newBypassState } : p
    );

    let isCommActive = true;
    const recalculatedPanels = updatedPanels.map(p => {
      const panelState = { ...p };
      if (isCommActive) {
        panelState.status = 'Running';
        panelState.cr1 = 1;
        panelState.cr2 = 1;
        if(p.name === 'Master') panelState.crbp = 1;

        if (p.fault === 1 && p.bypass === 'OFF') {
          isCommActive = false;
          panelState.status = 'Not running';
          panelState.cr2 = 0;
        }
      } else {
        panelState.status = 'Not running';
        panelState.cr1 = 0;
        panelState.cr2 = 0;
      }
      return panelState;
    });

    setPanels(recalculatedPanels);

    const changedPanel = recalculatedPanels.find(p => p.name === panelName);
    if(changedPanel) {
      setFeedback(`Panel ${panelName}: ${changedPanel.feedback}`);
    }

    const faultPanel = recalculatedPanels.find(p => p.fault === 1);
    if (faultPanel?.bypass === 'ON') {
      const allRunning = recalculatedPanels.every(p => p.status === 'Running');
      if (allRunning) {
        setIsSolved(true);
        setFeedback(`Success! You isolated the fault at ${faultPanelName}.`);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-cyan-400">Conveyor Bypass Training</h1>
          <p className="text-gray-400 mt-2">Isolate the communication fault by using the bypass switches.</p>
        </header>

        <div className="flex justify-center mb-6">
          <button
            onClick={startNewScenario}
            className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-300"
          >
            Start New Scenario
          </button>
        </div>
        
        {panels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {panels.map(panel => (
              <Panel key={panel.name} panelData={panel} onBypassChange={handleBypassChange} isGameSolved={isSolved} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <p>Click "Start New Scenario" to begin the training exercise.</p>
          </div>
        )}

        <Footer feedback={feedback} attempts={attempts} />
      </div>

      <SuccessModal 
        isOpen={isSolved} 
        onClose={startNewScenario}
        faultyPanel={faultPanelName}
      />
    </div>
  );
};

export default App;
