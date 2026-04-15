/**
 * FLAG CONTRACT — alive-constitution
 * LOCKED — Slice 2  (v16 §25)
 *
 * A Flag is a structured observation raised by any layer when it detects
 * something significant. Flags accumulate, decay, and form quorums.
 * They are evidence — not commands.
 *
 * Slice 2 changes from Slice 1:
 *   flag_id        → id
 *   flag_type      → class  (narrowed to 3 concrete classes)
 *   source_layer   → source (any string — layer, sensor, or component)
 *   created_at     → emitted_at
 *   expires_at     → now mandatory (no flag lives forever)
 *   support_ref    → now mandatory
 *   priority       → number 1–5 (1 = lowest, 5 = critical)
 *   removed        : confidence, recommended_route, requires_decision
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
/**
 * The three flag classes admitted in Slice 2.
 *
 *   threat      — active danger to mission, vessel, operator, or constitutional integrity
 *   anomaly     — statistical deviation, unknown source, or unexpected pattern
 *   degradation — system health declining (cpu, disk, battery, repeated deferrals)
 */
export type FlagClass = 'threat' | 'anomaly' | 'degradation';
export interface Flag {
    /** Unique flag identifier (UUID). */
    id: string;
    /** Semantic class of the condition. */
    class: FlagClass;
    /**
     * Origin of this flag — free-form string identifying the emitting
     * layer, sensor, or component (e.g. 'body/firewall', 'runtime/cb', 'stg/system_api').
     */
    source: string;
    /** The signal that triggered this observation. */
    signal_id: string;
    /**
     * Urgency 1 (lowest, informational) to 5 (critical, override-level).
     * Slice 1 triage flags used 0–4; those numbers remain valid as `number`.
     */
    priority: number;
    /** Human-readable explanation of why this flag was raised. */
    reason: string;
    /**
     * Mandatory expiry — epoch ms after which this flag is stale and must be purged.
     * No flag lives forever. Minimum useful TTL is 5 000 ms.
     */
    expires_at: number;
    /**
     * Reference to the originating signal ID or episode ID.
     * Must not be empty.
     */
    support_ref: string;
    /** Epoch ms when this flag was emitted. */
    emitted_at: number;
}
/**
 * Create a Flag with auto-generated `id` and `emitted_at`.
 * All required fields must be supplied; `id` and `emitted_at` are optional (auto-filled).
 */
export declare function createFlag(partial: Omit<Flag, 'id' | 'emitted_at'> & {
    id?: string;
    emitted_at?: number;
}): Flag;
/** @deprecated — use FlagClass */
export type FlagType = 'threat' | 'anomaly' | 'opportunity' | 'recall' | 'contradiction' | 'deadline' | 'degradation' | 'completion' | 'suggestion';
/** @deprecated — priority is now plain number 1–5 */
export type FlagPriority = 0 | 1 | 2 | 3 | 4;
/** @deprecated — routing is no longer encoded in Flag; kept for TriageResult only */
export type FlagRoute = 'reflex' | 'brain' | 'defer' | 'log_only';
//# sourceMappingURL=flag.d.ts.map