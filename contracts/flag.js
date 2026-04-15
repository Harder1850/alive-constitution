"use strict";
/**
 * FLAG CONTRACT — alive-constitution
 * LOCKED — Slice 2  (v16 §25)
 *
 * A Flag is a structured observation raised by any layer when it detects
 * something significant. Flags accumulate, decay, and form quorums.
 * They are evidence — not commands.
 *
 * Slice 2 changes from Slice 1:
 *   flag_id        → id
 *   flag_type      → class  (narrowed to 3 concrete classes)
 *   source_layer   → source (any string — layer, sensor, or component)
 *   created_at     → emitted_at
 *   expires_at     → now mandatory (no flag lives forever)
 *   support_ref    → now mandatory
 *   priority       → number 1–5 (1 = lowest, 5 = critical)
 *   removed        : confidence, recommended_route, requires_decision
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlag = createFlag;
// ─── Factory ──────────────────────────────────────────────────────────────────
/**
 * Create a Flag with auto-generated `id` and `emitted_at`.
 * All required fields must be supplied; `id` and `emitted_at` are optional (auto-filled).
 */
function createFlag(partial) {
    return {
        ...partial,
        id: partial.id ?? crypto.randomUUID(),
        emitted_at: partial.emitted_at ?? Date.now(),
    };
}
