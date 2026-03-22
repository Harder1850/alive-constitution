export interface Decision {
  id: string;
  selectedActionId: string;
  rationale: string;
  confidence: number;
  timestamp: number;
}
