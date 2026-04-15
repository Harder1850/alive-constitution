/**
 * SYSTEM MODE CONTRACT — alive-constitution
 * LOCKDOWN MODE IMPLEMENTATION — Slice 1.5
 *
 * Defines the canonical system operating modes for ALIVE.
 *
 *   NORMAL    — standard operation, full cognitive cycle
 *   LOCKDOWN  — hardened state, strict enforcement, audit required for exit
 *
 * This contract establishes the single source of truth for system mode.
 * All modules MUST respect the system mode and behave accordingly.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
/**
 * The two valid system operating modes.
 *
 *   NORMAL    — Runtime governs actions normally; Mind is active; Body executes freely
 *   LOCKDOWN  — Runtime is strict control surface; Mind is passive; Body requires auth
 */
export type LockdownMode = 'NORMAL' | 'LOCKDOWN';
/**
 * Result of attempting to exit LOCKDOWN mode.
 */
export interface UnlockResult {
    /** True if unlock was permitted based on audit results. */
    readonly unlocked: boolean;
    /** Human-readable reason for the unlock decision. */
    readonly reason: string;
    /** Audit reference if unlock was granted. */
    readonly auditRef?: string;
    /** List of unresolved items that blocked unlock. */
    readonly unresolvedItems?: readonly string[];
}
/**
 * Singleton state for the system mode.
 * Maintained by alive-runtime and queryable by all modules.
 */
export interface RuntimeModeState {
    /** Current system mode. */
    readonly mode: LockdownMode;
    /** Epoch ms when current mode was entered. */
    readonly enteredAt: number;
    /** Reason for entering current mode (for audit trail). */
    readonly entryReason?: string;
    /** If in LOCKDOWN, the audit reference required for unlock. */
    readonly auditRef?: string;
    /** If in LOCKDOWN, list of blocked actions since entry. */
    readonly blockedActionsCount: number;
}
/**
 * Events that can trigger a mode transition.
 */
export type ModeTransitionTrigger = 'manual_command' | 'audit_failure' | 'security_incident' | 'enforcement_violation';
/**
 * Parameters for entering a mode.
 */
export interface EnterModeParams {
    /** Target mode to enter. */
    readonly targetMode: LockdownMode;
    /** Reason for the mode change. */
    readonly reason: string;
    /** What triggered the transition. */
    readonly trigger: ModeTransitionTrigger;
    /** Optional audit reference (required for LOCKDOWN entry in some contexts). */
    readonly auditRef?: string;
}
//# sourceMappingURL=system-mode.d.ts.map