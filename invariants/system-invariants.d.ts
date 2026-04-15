/**
 * SYSTEM INVARIANTS — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * These are the architectural laws of ALIVE. They cannot be overridden at
 * runtime, amended silently, or bypassed under any condition — including
 * emergency mode (see INV_001).
 *
 * ID assignment:
 *   INV-001 through INV-006 are referenced by string ID in enforcement code
 *   (alive-runtime/src/enforcement/executive.ts). Do NOT renumber or remove
 *   existing entries. Append new invariants at the end only, via formal amendment.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
export declare const SystemInvariants: {
    /**
     * INV-001 — STG Gate
     *
     * No cognitive cycle may execute without explicit STG authorisation.
     * The Stop-Thinking Gate is the sole arbiter of when alive-mind runs.
     * Bypassing it — for any reason, including "urgent" signals — is a
     * constitutional violation.
     */
    readonly INV_001_NO_COGNITION_WITHOUT_STG: {
        readonly id: "INV-001";
        readonly name: "NO_COGNITION_WITHOUT_STG";
        readonly description: "No cognitive cycle may run without explicit alive-runtime STG authorisation.";
        readonly enforced_by: "alive-runtime";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
    /**
     * INV-002 — Mind Boundary
     *
     * alive-mind produces Decisions only. It may not call alive-body executors,
     * write files, open network connections, or cause any observable side effect
     * directly. All execution must go through alive-runtime → alive-body.
     */
    readonly INV_002_MIND_CANNOT_EXECUTE: {
        readonly id: "INV-002";
        readonly name: "MIND_CANNOT_EXECUTE";
        readonly description: "alive-mind may produce descriptive Decisions only and may not execute Actions.";
        readonly enforced_by: "alive-runtime";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
    /**
     * INV-003 — Body Boundary
     *
     * alive-body senses and acts. It may not evaluate Signal meaning, produce
     * Decisions, or determine intent. Routing logic lives in alive-runtime;
     * reasoning lives in alive-mind.
     */
    readonly INV_003_BODY_CANNOT_DECIDE: {
        readonly id: "INV-003";
        readonly name: "BODY_CANNOT_DECIDE";
        readonly description: "alive-body may sense and act but may not decide intent or meaning.";
        readonly enforced_by: "alive-runtime";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
    /**
     * INV-004 — Interface Boundary
     *
     * alive-interface may display state and relay commands only. It must never
     * invoke alive-mind or alive-body directly. Every command from the interface
     * must travel through alive-runtime, which applies all constitutional checks
     * before passing the command downstream.
     */
    readonly INV_004_INTERFACE_CANNOT_BYPASS_RUNTIME: {
        readonly id: "INV-004";
        readonly name: "INTERFACE_CANNOT_BYPASS_RUNTIME";
        readonly description: "alive-interface may not invoke alive-mind or alive-body directly. All commands must route through alive-runtime.";
        readonly enforced_by: "alive-runtime";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
    /**
     * INV-005 — Enforcement Integrity
     *
     * The enforcement chain (Executive → STG → Admissibility) must execute on
     * every cognitive cycle, without exception. The chain itself must not be
     * subject to runtime configuration, feature flags, or short-circuit logic.
     * Three or more simultaneous CRITICAL flags from independent sources triggers
     * automatic FLAGGED status (cascading-failure detection).
     */
    readonly INV_005_ENFORCEMENT_INTEGRITY: {
        readonly id: "INV-005";
        readonly name: "ENFORCEMENT_INTEGRITY";
        readonly description: "The constitutional enforcement path (Executive → STG → Admissibility) must execute on every cognitive cycle without exception.";
        readonly enforced_by: "alive-runtime";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
    /**
     * INV-006 — Firewall Gate
     *
     * Every Signal must pass alive-body's firewall inspection before reaching
     * alive-runtime or alive-mind. A Signal whose `firewall_status` is not
     * 'cleared' must never be processed by any downstream layer. This is the
     * outermost constitutional boundary.
     */
    readonly INV_006_FIREWALL_MUST_GATE_ALL_INPUT: {
        readonly id: "INV-006";
        readonly name: "FIREWALL_MUST_GATE_ALL_INPUT";
        readonly description: "Every Signal must pass alive-body firewall inspection. A Signal with firewall_status !== \"cleared\" must never be processed by alive-runtime or alive-mind.";
        readonly enforced_by: "alive-body";
        readonly violation_response: "blocked";
        readonly amendment_ref: "0001";
    };
};
/** String literal union of all assigned invariant IDs. */
export type InvariantId = 'INV-001' | 'INV-002' | 'INV-003' | 'INV-004' | 'INV-005' | 'INV-006';
/** Shape of a single invariant record. */
export type SystemInvariant = typeof SystemInvariants[keyof typeof SystemInvariants];
//# sourceMappingURL=system-invariants.d.ts.map