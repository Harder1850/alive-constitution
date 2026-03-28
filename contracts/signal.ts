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

// ─── Supporting Types ─────────────────────────────────────────────────────────

/** All recognised origination points for a signal. */
export type SignalSource =
  | 'camera'        // Physical camera sensor
  | 'microphone'    // Audio / speech input
  | 'telemetry'     // Automated system metrics
  | 'system_api'    // Internal API or test harness
  | 'filesystem'    // Filesystem watcher events
  | 'process'       // Process health / stdout / stderr
  | 'github'        // GitHub API adapter
  | 'peer_bot';     // External peer agent (restricted)

/**
 * Signal kind — structural classification of what the signal represents.
 * Body assigns kind based on data shape and source type.
 * Body does NOT assign semantic meaning.
 */
export type SignalKind =
  | 'cpu_utilization'     // CPU usage reading (0–100%)
  | 'disk_available'      // Available disk space in bytes
  | 'file_change_event'   // Filesystem create / modify / rename / delete
  | 'process_error'       // Stderr output or unhandled exception
  | 'process_health'      // Process heartbeat / health check
  | 'repo_commit'         // New commit on a watched branch
  | 'repo_pr'             // Pull request opened / updated / merged
  | 'user_input'          // Direct user input via interface
  | 'system_startup'      // System initialisation signal
  | 'unknown';            // Unclassified — sandboxed until runtime authorises

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
   * Structural classification of signal type.
   * Assigned by alive-body normalization based on source and data shape.
   * Never assigned based on semantic meaning.
   */
  kind: SignalKind;

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
   * How time-sensitive this signal is. 0.0 = can wait, 1.0 = act immediately.
   * Computed by alive-body normalization from source metrics.
   * Used by STG scoring (§6A.7 urgency_weight).
   */
  urgency: number;

  /**
   * How different this signal is from recent baseline. 0.0 = identical, 1.0 = completely new.
   * Populated by alive-runtime CB after comparison against baseline.
   * alive-body sets this to 0.0 initially; runtime updates it.
   */
  novelty: number;

  /**
   * How confident alive-body is in the quality of this signal. 0.0–1.0.
   * Low confidence = noisy sensor reading, partial data, or inferred value.
   */
  confidence: number;

  /**
   * Composite signal quality score computed by alive-body normalization.
   * Considers: sensor reliability, data completeness, timestamp freshness.
   * Below 0.3 → runtime may DENY without STG evaluation.
   */
  quality_score: number;

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

  /**
   * Optional structured payload extracted from raw_content by alive-body normalization.
   * Shape varies by kind. alive-mind reads this for rule matching.
   * alive-body populates it; alive-mind reads it; no other layer writes it.
   */
  payload?: Record<string, unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return the signal's unique ID. */
export function getSignalId(signal: Signal): string {
  return signal.id;
}

/** Build a minimal valid Signal with safe defaults. Used by body adapters. */
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
