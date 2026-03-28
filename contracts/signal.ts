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
 */

// ─── Supporting Types ─────────────────────────────────────────────────────────

/** All recognised origination points for a signal. */
export type SignalSource =
  | 'camera'      // Physical camera sensor
  | 'microphone'  // Audio / speech input
  | 'telemetry'   // Automated system metrics
  | 'system_api'  // Internal API or test harness
  | 'peer_bot';   // External peer agent (restricted — see CONSTITUTION.json)

/** Lifecycle status set by alive-body firewall. */
export type FirewallStatus =
  | 'pending'   // Not yet inspected
  | 'cleared'   // Passed all firewall rules
  | 'blocked';  // Rejected — must not proceed further

// ─── Signal ───────────────────────────────────────────────────────────────────

export interface Signal {
  /** Unique identifier — used for traceability across all pipeline stages. */
  id: string;

  /** Where the signal came from. */
  source: SignalSource;

  /**
   * The unparsed data (text, JSON string, base64 image, transcript, etc.).
   * Intentionally typed as `any` — raw sensor data has no guaranteed shape.
   * Convention: callers use String(signal.raw_content ?? '') before processing.
   * alive-body always normalises to string before passing to runtime or mind.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw_content: any;

  /** Epoch ms when this signal was created / first observed. */
  timestamp: number;

  /**
   * Lazy reflex trigger.
   * When true, alive-runtime may bypass the full cognitive pipeline and execute
   * a hardcoded emergency protocol immediately. Set by alive-body sensors only.
   */
  threat_flag: boolean;

  /**
   * Set by alive-body firewall.
   * Starts as 'pending'. Becomes 'cleared' or 'blocked' after inspection.
   * A signal with status !== 'cleared' must never reach alive-mind.
   */
  firewall_status: FirewallStatus;

  /**
   * Set to true by alive-runtime STG after granting this signal access to the brain.
   * No other layer may set this field.
   */
  stg_verified?: boolean;

  /** Epoch ms when alive-body first perceived this signal. */
  perceived_at?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return the signal's unique ID. Exists for call-site symmetry across older code. */
export function getSignalId(signal: Signal): string {
  return signal.id;
}
