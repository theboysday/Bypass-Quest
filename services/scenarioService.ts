
import type { Scenario, PanelData, Difficulty } from '../types';

const DIFFICULTY_CONFIG = {
  Easy: { panels: 8 },
  Medium: { panels: 15 },
  Hard: { panels: 24 },
};

export const generateScenario = (difficulty: Difficulty): Scenario => {
  const panelCount = DIFFICULTY_CONFIG[difficulty].panels;
  const faultIndex = Math.floor(Math.random() * panelCount) + 1; // Random fault from Child 1 to panelCount
  const faultPanelName = `Child ${faultIndex}`;

  const panels: PanelData[] = [];

  // Create Master Panel
  panels.push({
    name: 'Master',
    bypass: 'ON', // Master bypass is conceptually always ON for the loop
    cr1: 1,
    cr2: 1,
    crbp: 1,
    status: 'Running',
    fault: 0,
    feedback: 'Comm loop initiated from Master Panel.',
  });

  // Create Child Panels
  for (let i = 1; i <= panelCount; i++) {
    const isFaulty = i === faultIndex;
    panels.push({
      name: `Child ${i}`,
      bypass: 'OFF', // Initial state
      cr1: 0,
      cr2: 0,
      crbp: 0,
      status: 'Not running', // Initial state
      fault: isFaulty ? 1 : 0,
      feedback: isFaulty
        ? 'CR-2 relay failed here. System downstream is offline.'
        : 'Panel is operating normally.',
    });
  }
  
  // Downstream panels should have specific feedback
  let faultFound = false;
  for (let i = 1; i < panels.length; i++) {
    if (panels[i].fault) {
      faultFound = true;
      continue;
    }
    if (faultFound) {
      panels[i].feedback = 'Downstream from fault, no communication signal.';
    }
  }


  return {
    scenarioId: `SCN-${Date.now()}`,
    faultPanel: faultPanelName,
    panels,
  };
};
