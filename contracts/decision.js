"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeDecisionIntegrityHash = computeDecisionIntegrityHash;
// ─── Integrity Hash ───────────────────────────────────────────────────────────
/**
 * Compute the FNV-1a integrity hash for a Decision.
 *
 * Called by alive-mind when producing a Decision, and again by alive-runtime
 * admissibility-check to verify the Decision has not been tampered with.
 *
 * Only the five payload fields are hashed — timestamps and metadata are excluded
 * so the hash is deterministic and independent of when it is verified.
 */
function computeDecisionIntegrityHash(decision) {
    const payload = JSON.stringify({
        id: decision.id,
        selected_action: decision.selected_action,
        confidence: decision.confidence,
        admissibility_status: decision.admissibility_status,
        reason: decision.reason,
    });
    // FNV-1a 32-bit
    let hash = 2166136261;
    for (let i = 0; i < payload.length; i++) {
        hash ^= payload.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
