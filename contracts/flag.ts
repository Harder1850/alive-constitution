/**
 * FLAG CONTRACT — alive-constitution
 *
 * A Flag is a structured annotation raised by any layer when it detects
 * something significant about a Signal or the system state. Flags are the
 * primary mechanism through which ALIVE's layers communicate urgency,
 * opportunity, and recommended routing without coupling to each other.
 *
 * Priority scale:
 *   0 = INFO       (log only, no routing change)
 *   1 = LOW        (note for next cycle)
 *   2 = MEDIUM     (influence routing, non-urgent)
 *   3 = HIGH       (urgent — escalate processing)
 *   4 = CRITICAL   (override — immediate reflex response)
 */

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

export type FlagPriority = 0 | 1 | 2 | 3 | 4;

export type FlagRoute =
  | 'reflex'     // Bypass brain — execute hardcoded safety response immediately
  | 'brain'      // Route to full cognitive pipeline (evaluateNovelSignal)
  | 'defer'      // Buffer for next cycle — not urgent enough now
  | 'log_only';  // Record and discard — no action needed

export interface Flag {
  /** Unique flag identifier */
  flag_id: string;

  /** The Signal that triggered this flag */
  signal_id: string;

  /** Which layer raised this flag */
  source_layer: 'body' | 'runtime' | 'mind';

  /** Semantic category */
  flag_type: FlagType;

  /** Urgency level 0–4 */
  priority: FlagPriority;

  /** Confidence in this flag's assessment (0.0–1.0) */
  confidence: number;

  /** Human-readable explanation */
  reason: string;

  /** Optional ID of supporting story/memory that informed this flag */
  support_ref?: string;

  /** Epoch ms when this flag expires (if not acted upon) */
  expires_at?: number;

  /** Recommended processing route */
  recommended_route: FlagRoute;

  /** Whether this flag requires an explicit decision before proceeding */
  requires_decision: boolean;

  /** When this flag was created */
  created_at: number;
}

/** Create a flag with defaults for optional fields. */
export function createFlag(
  partial: Omit<Flag, 'flag_id' | 'created_at'> & { flag_id?: string; created_at?: number },
): Flag {
  return {
    ...partial,
    flag_id: partial.flag_id ?? crypto.randomUUID(),
    created_at: partial.created_at ?? Date.now(),
  };
}
