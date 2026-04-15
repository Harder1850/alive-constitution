/**
 * CRG CONTRACT — alive-constitution
 * Candidate Resolution / Selection contract
 *
 * Generic selection structure for evaluating and choosing among candidates.
 * Types only — no logic, no implementations, no runtime assumptions.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
/** Input presented to the CRG for candidate evaluation. */
export interface CRGInput {
    /** ID of the item being evaluated. */
    itemId: string;
    /** Available resource level. 0.0 = none, 1.0 = full. */
    resourceLevel: number;
    /** Number of pending items in queue. */
    queueDepth: number;
    /** Epoch ms when this input was created. */
    timestamp: number;
}
/** A candidate option presented to the CRG for scoring. */
export interface CRGCandidate {
    /** Unique identifier for this candidate. */
    candidateId: string;
    /** Human-readable label. */
    label: string;
    /** Estimated resource cost. 0.0–1.0. */
    estimatedCost: number;
    /** Relative priority. Higher = more preferred. */
    priority: number;
}
/** Score assigned to one candidate. */
export interface CRGScore {
    /** ID of the candidate being scored. */
    candidateId: string;
    /** Composite score. Higher = more suitable. */
    score: number;
    /** Whether this candidate is eligible at the current resource level. */
    eligible: boolean;
    /** Reason for eligibility determination. */
    reason: string;
}
/** Final selection output produced by the CRG. */
export interface CRGDecision {
    /** ID of the selected candidate. Null if none were eligible. */
    selectedCandidateId: string | null;
    /** Scores for all evaluated candidates. */
    scores: CRGScore[];
    /** Human-readable rationale for the selection. */
    rationale: string;
    /** Epoch ms when this decision was produced. */
    decidedAt: number;
}
//# sourceMappingURL=crg.d.ts.map