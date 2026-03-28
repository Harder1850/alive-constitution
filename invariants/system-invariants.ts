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

export const SystemInvariants = {

  /**
   * INV-001 — STG Gate
   *
   * No cognitive cycle may execute without explicit STG authorisation.
   * The Stop-Thinking Gate is the sole arbiter of when alive-mind runs.
   * Bypassing it — for any reason, including "urgent" signals — is a
   * constitutional violation.
   */
  INV_001_NO_COGNITION_WITHOUT_STG: {
    id:                 'INV-001',
    name:               'NO_COGNITION_WITHOUT_STG',
    description:        'No cognitive cycle may run without explicit alive-runtime STG authorisation.',
    enforced_by:        'alive-runtime',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

  /**
   * INV-002 — Mind Boundary
   *
   * alive-mind produces Decisions only. It may not call alive-body executors,
   * write files, open network connections, or cause any observable side effect
   * directly. All execution must go through alive-runtime → alive-body.
   */
  INV_002_MIND_CANNOT_EXECUTE: {
    id:                 'INV-002',
    name:               'MIND_CANNOT_EXECUTE',
    description:        'alive-mind may produce descriptive Decisions only and may not execute Actions.',
    enforced_by:        'alive-runtime',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

  /**
   * INV-003 — Body Boundary
   *
   * alive-body senses and acts. It may not evaluate Signal meaning, produce
   * Decisions, or determine intent. Routing logic lives in alive-runtime;
   * reasoning lives in alive-mind.
   */
  INV_003_BODY_CANNOT_DECIDE: {
    id:                 'INV-003',
    name:               'BODY_CANNOT_DECIDE',
    description:        'alive-body may sense and act but may not decide intent or meaning.',
    enforced_by:        'alive-runtime',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

  /**
   * INV-004 — Interface Boundary
   *
   * alive-interface may display state and relay commands only. It must never
   * invoke alive-mind or alive-body directly. Every command from the interface
   * must travel through alive-runtime, which applies all constitutional checks
   * before passing the command downstream.
   */
  INV_004_INTERFACE_CANNOT_BYPASS_RUNTIME: {
    id:                 'INV-004',
    name:               'INTERFACE_CANNOT_BYPASS_RUNTIME',
    description:        'alive-interface may not invoke alive-mind or alive-body directly. All commands must route through alive-runtime.',
    enforced_by:        'alive-runtime',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

  /**
   * INV-005 — Enforcement Integrity
   *
   * The enforcement chain (Executive → STG → Admissibility) must execute on
   * every cognitive cycle, without exception. The chain itself must not be
   * subject to runtime configuration, feature flags, or short-circuit logic.
   * Three or more simultaneous CRITICAL flags from independent sources triggers
   * automatic FLAGGED status (cascading-failure detection).
   */
  INV_005_ENFORCEMENT_INTEGRITY: {
    id:                 'INV-005',
    name:               'ENFORCEMENT_INTEGRITY',
    description:        'The constitutional enforcement path (Executive → STG → Admissibility) must execute on every cognitive cycle without exception.',
    enforced_by:        'alive-runtime',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

  /**
   * INV-006 — Firewall Gate
   *
   * Every Signal must pass alive-body's firewall inspection before reaching
   * alive-runtime or alive-mind. A Signal whose `firewall_status` is not
   * 'cleared' must never be processed by any downstream layer. This is the
   * outermost constitutional boundary.
   */
  INV_006_FIREWALL_MUST_GATE_ALL_INPUT: {
    id:                 'INV-006',
    name:               'FIREWALL_MUST_GATE_ALL_INPUT',
    description:        'Every Signal must pass alive-body firewall inspection. A Signal with firewall_status !== "cleared" must never be processed by alive-runtime or alive-mind.',
    enforced_by:        'alive-body',
    violation_response: 'blocked' as const,
    amendment_ref:      '0001',
  },

} as const;

// ─── Convenience Types ────────────────────────────────────────────────────────

/** String literal union of all assigned invariant IDs. */
export type InvariantId =
  | 'INV-001'
  | 'INV-002'
  | 'INV-003'
  | 'INV-004'
  | 'INV-005'
  | 'INV-006';

/** Shape of a single invariant record. */
export type SystemInvariant = typeof SystemInvariants[keyof typeof SystemInvariants];
