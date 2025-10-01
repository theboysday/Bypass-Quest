
import React, { useState, useEffect, useCallback } from 'react';
import { Panel } from './components/Panel';
import { SuccessModal } from './components/SuccessModal';
import { Footer } from './components/Footer';
import { generateScenario } from './services/scenarioService';
import type { PanelData, BypassState, Difficulty } from './types';

const App: React.FC = () => {
  const [panels, setPanels] = useState<PanelData[]>([]);
  const [faultPanelName, setFaultPanelName] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('Select a difficulty and click "Start New Scenario" to begin.');
  const [attempts, setAttempts] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const startNewScenario = useCallback(() => {
    const scenario = generateScenario(difficulty);
    // In a real fault condition, the entire series is down.
    const initialPanels = scenario.panels.map(p => ({
      ...p,
      bypass: 'OFF' as BypassState,
      status: p.name === 'Master' ? 'Running' : 'Not running', // Only master shows as running initially
      cr1: p.name === 'Master' ? 1 : 0,
      cr2: p.name === 'Master' ? 1 : 0,
      crbp: p.name === 'Master' ? 1 : 0,
    }));

    setPanels(initialPanels);
    setFaultPanelName(scenario.faultPanel);
    setIsSolved(false);
    setFeedback('A fault has occurred, bringing the system offline. Use the bypass switches to isolate the fault.');
    setAttempts(0);
  }, [difficulty]);

  useEffect(() => {
    // This effect is not used to start the game to avoid running on every render.
    // The user explicitly starts the game with the button.
  }, []);

  const handleBypassChange = (panelName: string, newBypassState: BypassState) => {
    if (isSolved) return;

    setAttempts(prev => prev + 1);

    const temporaryPanels = panels.map(p => 
      p.name === panelName ? { ...p, bypass: newBypassState } : p
    );
    
    // As per documentation, only the first bypass in the series matters.
    // We will find it and test the segment up to that point.
    const firstBypassOnIndex = temporaryPanels.findIndex(p => p.name !== 'Master' && p.bypass === 'ON');
    const segmentEndIndex = firstBypassOnIndex !== -1 ? firstBypassOnIndex : temporaryPanels.length - 1;

    // Check if there is a fault within the active segment (Master panel is at index 0, children start at 1)
    const faultInSegment = temporaryPanels.slice(1, segmentEndIndex + 1).some(p => p.fault === 1);

    let recalculatedPanels: PanelData[];

    if (faultInSegment) {
      // The fault is in the tested segment, so nothing runs.
      recalculatedPanels = temporaryPanels.map(p => ({
        ...p,
        status: p.name === 'Master' ? 'Running' : 'Not running',
        cr1: p.name === 'Master' ? 1 : 0,
        cr2: p.name === 'Master' ? 1 : 0,
      }));
      setFeedback('The fault is in the active segment. System remains offline.');
    } else {
      // Segment is healthy. Run all panels up to the bypass.
      recalculatedPanels = temporaryPanels.map((p, index) => {
        if (index > 0 && index <= segmentEndIndex) {
          // This panel is in the healthy, active segment
          return { ...p, status: 'Running', cr1: 1, cr2: 1 };
        } else {
          // Master or panels outside the active segment
           return { 
             ...p,
             status: p.name === 'Master' ? 'Running' : 'Not running',
             cr1: p.name === 'Master' ? 1 : 0,
             cr2: p.name === 'Master' ? 1 : 0
            };
        }
      });
      setFeedback('Segment is healthy and running. The fault is downstream from the active bypass.');
    }
    
    setPanels(recalculatedPanels);

    // Winning condition: The user has correctly identified the faulty panel by bypassing it.
    const faultPanel = recalculatedPanels.find(p => p.fault === 1);
    if (faultPanel?.name === panelName && newBypassState === 'ON') {
        setIsSolved(true);
        setFeedback(`Success! You isolated the fault at ${faultPanelName}.`);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto pb-24">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-cyan-400">Conveyor Bypass Training</h1>
          <p className="text-gray-400 mt-2">Isolate the communication fault by using the bypass switches.</p>
        </header>

        <div className="flex flex-col items-center mb-6 space-y-4">
          <div className="flex justify-center p-1 bg-gray-800 rounded-lg space-x-1 border border-gray-700">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-5 py-2 text-sm font-bold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 ${
                  difficulty === level
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

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
            <p>Select a difficulty and click "Start New Scenario" to begin the training exercise.</p>
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
