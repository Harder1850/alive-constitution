/**
 * MEMORY CONTRACT — alive-constitution
 * LOCKED — Slice 3  (v16 §25)
 *
 * Defines the Episode (STM unit) and MemoryKey structural types used by
 * alive-mind's memory subsystem (episode-store, semantic-graph, LTG).
 *
 * Rules:
 *   • alive-constitution imports nothing.
 *   • All other repos import from here.
 *   • Episodes are created and mutated ONLY by alive-mind's memory layer.
 *   • alive-runtime records/queries; it never mutates Episode fields directly.
 *
 * MemoryKey = kind:source  (structural composite of the two most stable
 * signal attributes — collapses repeated observations of the same condition
 * into a single episode rather than storing per-signal copies).
 *
 * MVI semantics (Slice 3):
 *   mvi starts at 1.0 on first record.
 *   +0.1 on each recall (usage reinforcement).
 *   −0.01 × (elapsed_s) on each decay tick.
 *   < 0.20 → cooling  (low-value, but retained)
 *   < 0.05 → pruned   (scheduled for removal)
 *
 * Do not add STM ring-buffer semantics, Symbol, Relationship, or Story
 * memory here — those are separate contracts in future slices.
 */

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export type LifecycleState = 'active' | 'cooling' | 'compressed' | 'pruned';

// ─── MemoryKey ────────────────────────────────────────────────────────────────

/**
 * Composite structural key: `kind:source`.
 * e.g. `'cpu_utilization:telemetry'`, `'user_input:system_api'`.
 * Uniquely identifies a recurring observation class, not a single event.
 */
export type MemoryKey = `${string}:${string}`;

// ─── Episode ──────────────────────────────────────────────────────────────────

/**
 * An Episode is a condensed record of a repeated observation + outcome pair.
 * Stored in the EpisodeStore (STM); promoted to SemanticGraph (LTM) by the LTG
 * when trust, evidence, and stability thresholds are met.
 */
export interface Episode {
  /** Unique episode identifier (UUID). */
  id: string;

  /**
   * Structural key component — the signal kind (e.g. 'cpu_utilization').
   * Combined with `source` to form the MemoryKey.
   */
  kind: string;

  /**
   * Structural key component — the signal source (e.g. 'telemetry').
   * Combined with `kind` to form the MemoryKey.
   */
  source: string;

  /** The most recent signal that updated this episode. */
  signal_id: string;

  /** Summary of what happened: execution result, rule matched, etc. */
  outcome: string;

  /**
   * Prediction confidence (0.0–1.0).
   * Reflects how certain the system was about the action taken.
   * Used by LTG Condition 1: significantDelta = confidence > 0.6.
   */
  confidence: number;

  /**
   * Memory Value Index — starts at 1.0 on first record.
   * Rises with recall usage; decays passively over time.
   * Used by LTG Condition 2: sufficientEvidence = mvi > 0.5.
   */
  mvi: number;

  /** Epoch ms when this episode was first created. */
  created_at: number;

  /** Epoch ms of the most recent recall or update. */
  last_accessed: number;

  /** Current lifecycle state — drives pruning and compression. */
  lifecycle: LifecycleState;

  /**
   * Trust score (0.0–1.0).
   * Derived from execution success rate and confirmation history.
   * Used by LTG Condition 3: confidenceMet = trust_score > 0.5.
   */
  trust_score: number;
}
