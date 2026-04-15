/**
 * STATE CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * Defines the canonical runtime state snapshot that flows between layers.
 *
 * Ownership and update rules:
 *   - alive-mind (StateModel / ASMState) holds the authoritative copy.
 *   - alive-runtime reads `battery_status` and `mode` for STG resource decisions.
 *   - alive-interface may display state fields but must never modify them.
 *   - No layer other than alive-mind may call a state-update method.
 *
 * This file is a pure type definition — no implementation, no side effects.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
/**
 * Operational mode of the ALIVE system.
 *
 *   idle      — no active cognitive cycle; awaiting input
 *   active    — processing signals normally
 *   alert     — elevated attention; resource gates loosened
 *   emergency — survival mode; constitution restrictions remain in force
 */
export type SystemMode = 'idle' | 'active' | 'alert' | 'emergency';
/**
 * Snapshot of the system's current operational state.
 *
 * alive-mind's `StateModel` is the authoritative implementation of this interface.
 * Field names are intentionally kept identical to `ASMState` in alive-mind so that
 * `StateModel.get()` satisfies this interface without adaptation.
 */
export interface RuntimeState {
    /** Human-readable description of the current operating environment. */
    current_environment: string;
    /**
     * Active high-level objectives, ordered by priority (index 0 = highest).
     * Empty array is valid and means no active goals.
     */
    active_goals: string[];
    /**
     * Battery charge level.
     * 0.0 = empty, 1.0 = full.
     * Used by alive-runtime STG for resource-based routing decisions.
     */
    battery_status: number;
    /** Current operational mode. */
    mode: SystemMode;
    /**
     * Number of completed cognitive cycles since the last process restart.
     * Incremented once per successful STG-authorised cycle.
     */
    cycleCount: number;
    /** Epoch ms when this state snapshot was last written. */
    lastUpdated: number;
}
//# sourceMappingURL=state.d.ts.map