export interface ContinuityRecord {
  sessionId: string;
  previousSessionId: string | null;
  startedAt: number;
  checkpointAt: number;
}
