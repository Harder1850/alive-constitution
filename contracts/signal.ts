export interface Signal {
  id: string;
  type: string;
  source: string;
  timestamp: number;
  payload: unknown;
}
