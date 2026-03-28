/**
 * FLAG CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * A Flag is a structured annotation raised by any layer when it detects
 * something significant about a Signal or the system state.
 *
 * Flags are the primary inter-layer signalling mechanism. They communicate
 * urgency, category, and recommended routing without coupling layers to each
 * other's internals.
 *
 * Raising a Flag never, by itself, causes action. A Flag is evidence presented
 * to the next decision point (Triage, STG, Executive) — not a command.
 *
 * Priority scale:
 *   0 = INFO      — log only, no routing change
 *   1 = LOW       — note for next cycle
 *   2 = MEDIUM    — influence routing, non-urgent
 *   3 = HIGH      — urgent — escalate processing
 *   4 = CRITICAL  — override — immediate reflex response
 *
 * alive-constitution imports nothing. All other repos import from here.
 */

// ─── Supporting Types ─────────────────────────────────────────────────────────

/** Semantic category of the condition being flagged. */
export type FlagType =
  | 'threat'        // Active danger to mission, vessel, or operator
  | 'anomaly'       // Statistical deviation from baseline
  | 'opportunity'   // Positive signal worth pursuing
  | 'recall'        // Stored memory pattern matched
  | 'contradiction' // Current signal conflicts with known state
  | 'deadline'      // Time-sensitive constraint approaching
  | 'degradation'   // System health declining
  | 'completion'    // Goal or task reached terminal state
  | 'suggestion';   // Non-urgent recommendation

/** Urgency integer 0–4. Higher is more urgent. */
export type FlagPriority = 0 | 1 | 2 | 3 | 4;

/**
 * Recommended processing route for a flagged signal.
 *
 *   reflex    — bypass brain; execute hardcoded safety response immediately
 *   brain     — route to full cognitive pipeline (evaluateNovelSignal)
 *   defer     — buffer for next cycle; not urgent enough right now
 *   log_only  — record and discard; no action needed
 */
export type FlagRoute = 'reflex' | 'brain' | 'defer' | 'log_only';

// ─── Flag ─────────────────────────────────────────────────────────────────────

export interface Flag {
  /** Unique flag identifier. */
  flag_id: string;

  /** The Signal that triggered this flag. */
  signal_id: string;

  /** Which layer raised this flag. */
  source_layer: 'body' | 'runtime' | 'mind';

  /** Semantic category. */
  flag_type: FlagType;

  /** Urgency level 0–4. */
  priority: FlagPriority;

  /** Confidence in this flag's assessment (0.0–1.0). */
  confidence: number;

  /** Human-readable explanation of why this flag was raised. */
  reason: string;

  /** Optional ID of a supporting story or memory that informed this flag. */
  support_ref?: string;

  /** Epoch ms when this flag expires if not acted upon. Omit for no expiry. */
  expires_at?: number;

  /** Recommended processing route. */
  recommended_route: FlagRoute;

  /**
   * When true, a downstream decision-maker must produce an explicit Decision
   * before this signal may proceed. When false, routing alone is sufficient.
   */
  requires_decision: boolean;

  /** Epoch ms when this flag was created. */
  created_at: number;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Create a Flag with auto-generated `flag_id` and `created_at` defaults.
 * All required fields must be supplied; optional fields may be omitted.
 */
export function createFlag(
  partial: Omit<Flag, 'flag_id' | 'created_at'> & { flag_id?: string; created_at?: number },
): Flag {
  return {
    ...partial,
    flag_id:    partial.flag_id    ?? crypto.randomUUID(),
    created_at: partial.created_at ?? Date.now(),
  };
}
