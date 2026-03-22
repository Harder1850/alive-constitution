export interface Transition {
  from: string;
  to: string;
  trigger: string;
  probability: number;
  timestamp: number;
}
