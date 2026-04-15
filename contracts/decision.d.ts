/**
 * DECISION CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * A Decision is the sole output of alive-mind's cognitive cycle.
 * It carries an Action recommendation, a confidence score, and an integrity hash
 * that alive-runtime verifies before authorising execution.
 *
 * Invariants:
 *   - alive-mind must set `integrity_hash` using `computeDecisionIntegrityHash`
 *     before returning a Decision.
 *   - alive-runtime must reject any Decision whose recomputed hash does not match.
 *   - alive-body must never receive a Decision whose `admissibility_status` is 'blocked'.
 *
 * alive-constitution imports only from sibling contracts.
 * All other repos import from here.
 */
import type { Action } from './action';
import type { AdmissibilityStatus } from './admissibility';
export interface Decision {
    /** Unique decision identifier (UUID). */
    id: string;
    /** The action alive-mind recommends executing. */
    selected_action: Action;
    /**
     * Confidence in this decision — 0.0 (no confidence) to 1.0 (certain).
     * Informational; does not gate execution.
     */
    confidence: number;
    /**
     * Admissibility lifecycle status.
     * Set to 'pending' by alive-mind; updated by alive-runtime admissibility-check.
     */
    admissibility_status: AdmissibilityStatus;
    /** Human-readable rationale for this decision. */
    reason: string;
    /**
     * FNV-1a integrity hash over `{ id, selected_action, confidence, admissibility_status, reason }`.
     * Set by alive-mind; verified by alive-runtime before execution is authorised.
     * Tampering with any field invalidates this hash and triggers an admissibility block.
     */
    integrity_hash: string;
}
/**
 * Compute the FNV-1a integrity hash for a Decision.
 *
 * Called by alive-mind when producing a Decision, and again by alive-runtime
 * admissibility-check to verify the Decision has not been tampered with.
 *
 * Only the five payload fields are hashed — timestamps and metadata are excluded
 * so the hash is deterministic and independent of when it is verified.
 */
export declare function computeDecisionIntegrityHash(decision: Pick<Decision, 'id' | 'selected_action' | 'confidence' | 'admissibility_status' | 'reason'>): string;
//# sourceMappingURL=decision.d.ts.map