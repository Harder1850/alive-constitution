"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
