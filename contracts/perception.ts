export interface Perception {
  signal_id: string;
  mapped_symbols: string[];
  novelty_score: number;
  change_delta: number;
  confidence: number;
}
