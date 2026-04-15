"use strict";
/**
 * AUTHORIZED ACTION CONTRACT — alive-constitution
 * contracts/authorized-action.ts
 *
 * Two distinct authorization concepts live here:
 *
 *   1. ActionAuthorization — the runtime-issued execution token that body
 *      validates before running any action. Hardened: single-use, expiry,
 *      action-hash binding.
 *
 *   2. AuthorizedAction / ApprovalState — backbone-freeze result shapes
 *      that runtime builds after an intent cycle completes. Used by
 *      intent-handler.ts to communicate what happened.
 *
 * alive-constitution imports only Node built-ins (crypto). No ALIVE repo imports.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeActionHash = computeActionHash;
exports.hasValidAuthorization = hasValidAuthorization;
exports.createBlockedResult = createBlockedResult;
exports.createAuthorizedResult = createAuthorizedResult;
const node_crypto_1 = __importDefault(require("node:crypto"));
/**
 * SHA-256 hex digest of an action's canonical JSON representation.
 *
 * Replaces the prior FNV-1a implementation. FNV-1a produced a 32-bit (8-hex)
 * output with known collision feasibility. SHA-256 produces a 256-bit output,
 * making action-hash collision attacks computationally infeasible.
 *
 * Used to bind a token to the exact action payload at issuance:
 * any mutation of the action after token issuance will produce a different
 * hash and fail the gate check.
 *
 * @param action  Any action value — passed as unknown to avoid
 *                importing the Action type from action.ts here.
 */
function computeActionHash(action) {
    const str = typeof action === 'string' ? action : JSON.stringify(action);
    return node_crypto_1.default.createHash('sha256').update(str, 'utf8').digest('hex');
}
// ─── Authorization validation (shape check only — semantics enforced by runtime) ──
/**
 * Shape validation: all required fields must be present and well-formed.
 * Does NOT check expiry, hash match, or consumed state — those require
 * runtime state and are enforced by alive-runtime/enforcement/global-gate.ts.
 */
function hasValidAuthorization(authorization) {
    if (!authorization)
        return false;
    if (!authorization.authorization_id || typeof authorization.authorization_id !== 'string')
        return false;
    if (authorization.approved_by !== 'runtime')
        return false;
    if (!authorization.approved_at || typeof authorization.approved_at !== 'number')
        return false;
    if (!authorization.expires_at || typeof authorization.expires_at !== 'number')
        return false;
    if (!authorization.action_hash || typeof authorization.action_hash !== 'string')
        return false;
    if (!authorization.signal_id || typeof authorization.signal_id !== 'string')
        return false;
    return true;
}
function createBlockedResult(reason) {
    return { authorized: false, reason };
}
function createAuthorizedResult(authorization, reason) {
    return { authorized: true, reason, authorization };
}
