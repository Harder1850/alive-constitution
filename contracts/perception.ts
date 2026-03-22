export interface Perception {
  id: string;
  raw: unknown;
  normalized: unknown;
  quality: number; // 0-1
  timestamp: number;
}
