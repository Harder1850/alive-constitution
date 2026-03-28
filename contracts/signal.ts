/**
 * SIGNAL CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * Represents a raw perception from the physical or digital environment.
 * Handled first by alive-body (ingest → firewall), then routed by alive-runtime.
 *
 * Immutable rule: a Signal is NEVER modified after firewall inspection.
 * The only exception is `stg_verified`, which is set once by alive-runtime STG
 * and must never be set by any other layer.
 *
 * alive-constitution imports nothing. All other repos import from here.
 *
 * v16 amendment: added kind, urgency, novelty, confidence, quality_score
 * required by STG scoring (§6A.4) and rule store (§31.7).
 */

export type SignalSource =
  | 'camera'
  | 'microphone'
  | 'telemetry'
  | 'system_api'
  | 'filesystem'
  | 'process'
  | 'github'
  | 'peer_bot';

export type SignalKind =
  | 'cpu_utilization'
  | 'disk_available'
  | 'file_change_event'
  | 'process_error'
  | 'process_health'
  | 'repo_commit'
  | 'repo_pr'
  | 'user_input'
  | 'system_startup'
  | 'unknown';

export type FirewallStatus =
  | 'pending'
  | 'cleared'
  | 'blocked';

export interface Signal {
  id: string;
  source: SignalSource;
  kind: SignalKind;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw_content: any;
  timestamp: number;
  urgency: number;
  novelty: number;
  confidence: number;
  quality_score: number;
  threat_flag: boolean;
  firewall_status: FirewallStatus;
  stg_verified?: boolean;
  perceived_at?: number;
  payload?: Record<string, unknown>;
}

export function getSignalId(signal: Signal): string {
  return signal.id;
}

export function makeSignal(
  overrides: Partial<Signal> & Pick<Signal, 'id' | 'source' | 'kind' | 'raw_content'>
): Signal {
  return {
    timestamp: Date.now(),
    urgency: 0.5,
    novelty: 0.0,
    confidence: 1.0,
    quality_score: 1.0,
    threat_flag: false,
    firewall_status: 'pending',
    ...overrides,
  };
}
