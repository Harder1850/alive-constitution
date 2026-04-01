/**
 * AUTHORIZED ACTION & APPROVAL CONTRACTS — alive-constitution
 *
 * AuthorizedAction — what alive-runtime has approved for body execution
 * ApprovalState    — tracking record for actions requiring human approval
 *
 * alive-runtime is the only layer that creates these.
 * alive-body receives AuthorizedAction to guide execution.
 * alive-interface reads ApprovalState to surface pending approvals.
 *
 * constitution imports nothing. All other repos import from here.
 */

// ── AuthorizedAction ───────────────────────────────────────────────────────────

/**
 * What alive-runtime has authorized after whitelist enforcement.
 * Created only when a candidate passes the whitelist and is eligible for execution.
 */
export interface AuthorizedAction {
  /** Unique authorization identifier. */
  authorization_id: string;

  /** The candidate_id from the ActionCandidate that was authorized. */
  candidate_id: string;

  /**
   * The action type authorized for execution.
   * Matches ActionCandidateType values — kept as string to avoid cross-repo type coupling.
   */
  action_type: string;

  /** When this authorization was issued. Epoch ms. */
  authorized_at: number;

  /** Whether the body should execute immediately (true) or just record recommendation (false). */
  auto_execute: boolean;

  /**
   * Minimal guidance for alive-body executor.
   * Contains only safe primitive information — no cross-repo type references.
   * alive-body may use this for logging and output labeling only.
   */
  executor_hint: string;

  /** Human-readable reason this action was authorized. From WhitelistVerdict.reason. */
  authorization_reason: string;

  /** The signal_id that triggered this authorization path. For traceability. */
  signal_id: string;
}

// ── ApprovalState ──────────────────────────────────────────────────────────────

/** Lifecycle of an action waiting for human review. */
export type ApprovalStatus =
  | 'pending'    // Awaiting human review — action is held
  | 'approved'   // Human approved — alive-runtime may now execute
  | 'rejected'   // Human rejected — action is discarded
  | 'expired';   // TTL exceeded — action is no longer relevant

/**
 * Tracks an action that requires human approval before execution.
 * alive-runtime creates these when whitelist verdict is RECOMMEND_ONLY.
 * alive-interface reads and renders these for human review.
 */
export interface ApprovalState {
  /** Unique approval identifier. */
  approval_id: string;

  /** The candidate_id from the ActionCandidate pending approval. */
  candidate_id: string;

  /** Thread this approval belongs to, if any. */
  thread_id?: string;

  /** Human-readable description of what this action would do. */
  action_summary: string;

  /** Why human approval is required (from whitelist verdict reason). */
  approval_reason: string;

  /** When this approval was requested. Epoch ms. */
  requested_at: number;

  /** Current approval status. */
  status: ApprovalStatus;

  /** When this approval was resolved. Epoch ms. Only set if status !== 'pending'. */
  resolved_at?: number;

  /** Human-provided note at resolution time. Optional. */
  resolution_note?: string;

  /**
   * Time-to-live in ms from requested_at.
   * After this duration the approval transitions to 'expired'.
   * Default: 300_000 (5 minutes).
   */
  ttl_ms?: number;
}
