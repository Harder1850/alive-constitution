/**
 * INTENT THREAD CONTRACT — alive-constitution
 *
 * IntentThread tracks the continuity of a user intent conversation.
 *
 * This is a business-level continuity record — not the same as
 * alive-mind's internal ThreadRecord (a memory-encoding construct for
 * cognitive recall). alive-mind's ThreadRecord concerns how observations
 * are encoded and recalled. IntentThread concerns the human-level
 * conversation thread (origin request → signals → outcomes → next step).
 *
 * alive-runtime creates and updates IntentThreads.
 * alive-interface reads them for "Why did you do that?" explanations.
 * alive-mind does not read or write IntentThreads directly.
 *
 * constitution imports nothing. All other repos import from here.
 */

import type { IntentCategory } from "./intent";

// ── IntentThreadStatus ─────────────────────────────────────────────────────────

/** Lifecycle state of an intent thread. */
export type IntentThreadStatus =
  | 'active'            // Currently being processed
  | 'resolved'          // Completed — outcome recorded
  | 'pending_approval'  // Waiting for human to approve a held action
  | 'abandoned';        // Timed out or explicitly closed without resolution

// ── IntentThread ───────────────────────────────────────────────────────────────

/**
 * Tracks continuity across a sequence of related intent requests.
 * Created when the first IntentRequest arrives.
 * Updated each time a new signal, outcome, or decision is recorded for the thread.
 */
export interface IntentThread {
  /** Unique thread identifier. Format: "thread-{request_id}". */
  thread_id: string;

  /** The intent category that started this thread. */
  intent_category: IntentCategory;

  /** When this thread was created. Epoch ms. */
  started_at: number;

  /** When this thread was last updated. Epoch ms. */
  updated_at: number;

  /**
   * Signal IDs that have flowed through this thread, in order of arrival.
   * Used for "Why did you do that?" trace reconstruction.
   */
  signal_ids: string[];

  /**
   * OutcomeRecord IDs recorded for this thread, in order.
   * Used to show the history of results for this conversation.
   */
  outcome_ids: string[];

  /** Current thread lifecycle state. */
  status: IntentThreadStatus;

  /**
   * The 'decided' sentence from the most recent StoryModeSummary for this thread.
   * Grounded in real runtime state — used by "Why did you do that?" path.
   */
  last_decided?: string;

  /**
   * What should happen next.
   * From DemoExplanation.next_step of the most recent loop cycle.
   */
  next_step?: string;

  /** The original plain-language request that started this thread. */
  origin_text: string;
}
