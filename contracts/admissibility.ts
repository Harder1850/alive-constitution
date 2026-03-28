/**
 * ADMISSIBILITY CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * Defines the admissibility lifecycle of a Decision.
 *
 * Every Decision produced by alive-mind begins as 'pending'. The alive-runtime
 * admissibility-check layer transitions it to 'passed' or 'blocked' by
 * verifying the integrity hash and confirming the selected action is legal.
 *
 * Immutable rule: a Decision with status 'blocked' must NEVER reach alive-body.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */

// ─── Status ───────────────────────────────────────────────────────────────────

/**
 * Lifecycle status of a Decision's admissibility check.
 *
 *   pending  — decision has not yet been evaluated
 *   passed   — all checks cleared; safe to execute
 *   blocked  — integrity or content check failed; must not execute
 */
export type AdmissibilityStatus = 'pending' | 'passed' | 'blocked';

// ─── Result ───────────────────────────────────────────────────────────────────

/**
 * The outcome record produced by alive-runtime's admissibility-check layer.
 * Attached to a Decision after evaluation.
 */
export interface AdmissibilityResult {
  /** Final admissibility verdict. */
  status: AdmissibilityStatus;

  /** Human-readable explanation (always populated; empty string is not allowed). */
  reason: string;

  /** Epoch ms when the check completed. */
  checked_at: number;
}
