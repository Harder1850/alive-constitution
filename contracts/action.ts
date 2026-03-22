export interface Action {
  id: string;
  type: string;
  payload: unknown;
  reversible: boolean;
  authorizedBy: string;
  timestamp: number;
}
