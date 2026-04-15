/**
 * MEMORY SHELLS CONTRACT — alive-constitution
 * Memory container shape definitions
 *
 * Defines the structural shape of the four memory layers in alive-mind.
 * These are container descriptors — not processors, not pipelines.
 *
 * Types only — no logic, no implementations, no behavior contracts.
 *
 * alive-constitution imports only from sibling contracts.
 * All other repos import from here.
 */
import type { Episode } from './memory';
/**
 * Holds a reference to the currently active episode and working context
 * for the duration of a single cognitive cycle.
 * Null when no cycle is active.
 */
export interface PresentStateShell {
    /** ID of the episode active in the current cycle. Null if no cycle is active. */
    activeEpisodeId: string | null;
    /** Working context strings associated with the active episode. */
    activeContext: string[];
}
/**
 * Bounded collection of recent Episodes.
 * Capacity is defined by STM_MAX_ENTRIES in invariants/memory-bounds.ts.
 */
export interface ShortTermMemoryShell {
    /** The stored Episodes, ordered by insertion time (oldest first). */
    entries: Episode[];
    /** Maximum number of entries this shell can hold. */
    maxCapacity: number;
}
/**
 * Stored pattern references derived from background observation.
 * Declarative record of detected patterns — not a running process.
 */
export interface BackgroundMemoryShell {
    /** Currently stored background patterns. */
    patterns: BackgroundPattern[];
}
/**
 * A declarative pattern record derived from background observation.
 */
export interface BackgroundPattern {
    /** Structural key identifying the observation class (kind:source). */
    patternKey: string;
    /** Number of Episodes that contributed to this pattern. */
    occurrenceCount: number;
    /** Epoch ms when this pattern was last updated. */
    lastSeen: number;
}
/**
 * Persisted collection of Episodes promoted to long-term storage.
 * Bounded by LTM_MAX_ENTRIES in invariants/memory-bounds.ts.
 */
export interface DurableMemoryShell {
    /** The persisted Episodes, ordered by insertion time (oldest first). */
    entries: Episode[];
    /** Maximum number of entries this shell can hold. */
    maxCapacity: number;
}
//# sourceMappingURL=memory-shells.d.ts.map