/**
 * INCIDENT RECORD CONTRACT — alive-constitution
 * LOCKDOWN MODE IMPLEMENTATION — Slice 1.5
 *
 * Defines the structure for preserving incident and lockdown event records.
 * Used for audit trails, post-incident analysis, and unlock verification.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */

// ─── Incident Types ───────────────────────────────────────────────────────────

/**
 * Severity levels for incidents.
 */
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Categories of incidents that can trigger lockdown.
 */
export type IncidentCategory =
  | 'security_incident'
  | 'enforcement_violation'
  | 'unauthorized_access'
  | 'boundary_breach'
  | 'audit_failure'
  | 'manual_trigger';

// ─── Incident Record ─────────────────────────────────────────────────────────-

/**
 * Record of a single incident or lockdown event.
 * Stored persistently for audit and post-incident analysis.
 */
export interface IncidentRecord {
  /** Unique identifier for this incident. */
  readonly id: string;

  /** Epoch ms when the incident was recorded. */
  readonly timestamp: number;

  /** Category of the incident. */
  readonly category: IncidentCategory;

  /** Severity level. */
  readonly severity: IncidentSeverity;

  /** Human-readable description of what happened. */
  readonly description: string;

  /** List of modules affected by or involved in this incident. */
  readonly affectedModules: readonly string[];

  /** Actions that were blocked as a result of this incident. */
  readonly blockedActions: readonly string[];

  /** Known violations discovered during this incident. */
  readonly knownViolations: readonly string[];

  /** Reference to the audit associated with this incident (if any). */
  readonly auditRef?: string;

  /** Whether the system was in LOCKDOWN when this incident occurred. */
  readonly wasInLockdown: boolean;
}

// ─── Lockdown Summary ─────────────────────────────────────────────────────────

/**
 * Summary of a lockdown period, recorded when exiting LOCKDOWN.
 * Provides a compressed record for audit review.
 */
export interface LockdownSummary {
  /** Unique identifier for this lockdown period. */
  readonly id: string;

  /** Epoch ms when LOCKDOWN was entered. */
  readonly enteredAt: number;

  /** Epoch ms when LOCKDOWN was exited (undefined if still active). */
  readonly exitedAt?: number;

  /** Reason provided when entering LOCKDOWN. */
  readonly entryReason: string;

  /** Trigger that caused the lockdown entry. */
  readonly trigger: string;

  /** Audit reference if one was provided at entry. */
  readonly auditRef?: string;

  /** Total number of actions blocked during this lockdown. */
  readonly blockedActionsCount: number;

  /** Number of unauthorized execution attempts. */
  readonly unauthorizedAttempts: number;

  /** List of unresolved items that require follow-up. */
  readonly unresolvedItems: readonly string[];

  /** Whether unlock was granted (only set when exiting). */
  readonly unlockGranted?: boolean;

  /** Audit reference for the unlock audit (only set when exiting). */
  readonly unlockAuditRef?: string;
}

// ─── Readiness Check ─────────────────────────────────────────────────────────

/**
 * Result of a pre-unlock readiness check.
 * Used to determine if the system can safely exit LOCKDOWN.
 */
export interface ReadinessCheck {
  /** True if all readiness criteria are met. */
  readonly ready: boolean;

  /** List of criteria that passed. */
  readonly passedChecks: readonly string[];

  /** List of criteria that failed. */
  readonly failedChecks: readonly string[];

  /** Recommendations for addressing failed checks. */
  readonly recommendations: readonly string[];
}

// ─── Audit Result ───────────────────────────────────────────────────────────

/**
 * Result of an audit operation.
 */
export interface AuditResult {
  /** Unique identifier for this audit. */
  readonly id: string;

  /** Epoch ms when the audit was performed. */
  readonly timestamp: number;

  /** Whether the audit passed. */
  readonly passed: boolean;

  /** Summary of findings. */
  readonly findings: readonly string[];

  /** Known issues identified during the audit. */
  readonly knownIssues: readonly string[];

  /** Recommendations for the operator. */
  readonly recommendations: readonly string[];
}
