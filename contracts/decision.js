"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeDecisionIntegrityHash = computeDecisionIntegrityHash;
function computeDecisionIntegrityHash(decision) {
    const payload = JSON.stringify({
        id: decision.id,
        selected_action: decision.selected_action,
        confidence: decision.confidence,
        admissibility_status: decision.admissibility_status,
        reason: decision.reason,
    });
    let hash = 2166136261;
    for (let i = 0; i < payload.length; i += 1) {
        hash ^= payload.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
//# sourceMappingURL=decision.js.map