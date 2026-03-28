"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlag = createFlag;
/** Create a flag with defaults for optional fields. */
function createFlag(partial) {
    return {
        ...partial,
        flag_id: partial.flag_id ?? crypto.randomUUID(),
        created_at: partial.created_at ?? Date.now(),
    };
}
//# sourceMappingURL=flag.js.map