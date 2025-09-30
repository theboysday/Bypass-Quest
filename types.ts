
export type BypassState = 'ON' | 'OFF';
export type StatusState = 'Running' | 'Not running';

export interface PanelData {
  name: string;
  bypass: BypassState;
  cr1: 0 | 1;
  cr2: 0 | 1;
  crbp: 0 | 1;
  status: StatusState;
  fault: 0 | 1;
  feedback: string;
}

export interface Scenario {
  scenarioId: string;
  faultPanel: string;
  panels: PanelData[];
}
