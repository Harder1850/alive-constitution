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
/**
 * The authority that can approve an action for execution.
 * In LOCKDOWN, only 'runtime' approval is accepted.
 */
export type ApproverAuthority = 'runtime' | 'manual';
/**
 * Authorization token issued by alive-runtime and validated by alive-body
 * before executing any action.
 *
 * Hardening rules (enforced by alive-runtime/enforcement/global-gate.ts):
 *   1. approved_by must be 'runtime'
 *   2. action_hash must match computeActionHash(action) at consumption time
 *   3. Date.now() must be <= expires_at (not expired)
 *   4. Single-use: authorization_id must not be in the consumed set
 *   5. In LOCKDOWN: additional lockdown_authorized check applies
 */
export interface ActionAuthorization {
    /** Unique identifier for this authorization. Audit trail anchor. */
    readonly authorization_id: string;
    /** The authority that approved this action. Must be 'runtime'. */
    readonly approved_by: ApproverAuthority;
    /** Epoch ms when this authorization was granted. */
    readonly approved_at: number;
    /**
     * Epoch ms after which this token is invalid.
     * Short TTL (e.g. 30 seconds) — tokens are single-cycle, not reusable.
     */
    readonly expires_at: number;
    /**
     * SHA-256 hex digest of the exact action payload this token authorizes.
     * Computed with computeActionHash(action) at issuance.
     * Verified at consumption — prevents token reuse on a different action.
     * SHA-256 replaces prior FNV-1a (32-bit) to eliminate collision attacks.
     */
    readonly action_hash: string;
    /**
     * The signal ID that triggered this authorization cycle.
     * Ties the token to a specific signal for audit traceability.
     */
    readonly signal_id: string;
    /** Optional reference to the audit or decision that led to this authorization. */
    readonly audit_ref?: string;
    /** Scope of the authorization (optional, reserved for future use). */
    readonly scope?: readonly string[];
}
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
export declare function computeActionHash(action: unknown): string;
/**
 * Shape validation: all required fields must be present and well-formed.
 * Does NOT check expiry, hash match, or consumed state — those require
 * runtime state and are enforced by alive-runtime/enforcement/global-gate.ts.
 */
export declare function hasValidAuthorization(authorization: ActionAuthorization | undefined): authorization is ActionAuthorization;
export interface AuthorizationResult {
    readonly authorized: boolean;
    readonly reason: string;
    readonly authorization?: ActionAuthorization;
}
export declare function createBlockedResult(reason: string): AuthorizationResult;
export declare function createAuthorizedResult(authorization: ActionAuthorization, reason: string): AuthorizationResult;
/**
 * Record that an action was authorized and auto-executed by runtime.
 * Produced by intent-handler when whitelist verdict is auto_execute.
 */
export interface AuthorizedAction {
    authorization_id: string;
    candidate_id: string;
    action_type: string;
    authorized_at: number;
    auto_execute: true;
    executor_hint: string;
    authorization_reason: string;
    signal_id: string;
}
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
/**
 * Record that an action requires human review before execution.
 * Produced by intent-handler when whitelist verdict is recommend-only.
 */
export interface ApprovalState {
    approval_id: string;
    candidate_id: string;
    thread_id: string;
    action_summary: string;
    approval_reason: string;
    requested_at: number;
    status: ApprovalStatus;
    ttl_ms: number;
}
//# sourceMappingURL=authorized-action.d.ts.map