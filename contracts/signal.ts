export interface Signal {
  id: string;
  signal_id: string;
  source: string;
  origin: 'external' | 'internal';
  raw_content: string;
  timestamp: number;
  firewall_status: 'pending' | 'passed' | 'blocked';
  quality_score: number;
  stg_verified: boolean;
  binding_complete?: boolean;
}

export function getSignalId(signal: Signal): string {
  return signal.signal_id || signal.id;
}
