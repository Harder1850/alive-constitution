import type { Action } from './action';

export interface Decision {
  id: string;
  selected_action: Action;
  confidence: number;
  admissibility_status: 'pending' | 'passed' | 'blocked';
  reason: string;
}
