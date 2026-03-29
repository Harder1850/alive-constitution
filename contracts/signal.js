"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignalId = getSignalId;
exports.makeSignal = makeSignal;
// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Return the signal's unique ID. */
function getSignalId(signal) {
    return signal.id;
}
/** Build a minimal valid Signal with safe defaults. Used by body adapters. */
function makeSignal(overrides) {
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
