export interface MemoryEntry {
  id: string;
  layer: "uc" | "stm" | "ltm";
  content: unknown;
  confidence: number;
  timestamp: number;
  expiresAt?: number;
}
