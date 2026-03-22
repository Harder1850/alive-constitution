export interface Signal {
  id: string;
  source: string;
  raw_content: string;
  timestamp: number;
  firewall_status: 'pending' | 'passed' | 'blocked';
  quality_score: number;
}
