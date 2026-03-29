"use strict";
/**
 * ACTION CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * An Action is a concrete, admissible instruction that alive-body can execute.
 * Actions are produced by alive-mind and authorized by alive-runtime before
 * execution. They are NEVER produced or modified by alive-body itself.
 *
 * Slice 1 admits exactly two action types:
 *   display_text  — render a string to the output surface (read-only side effect)
 *   write_file    — write a file inside the alive-web/ sandbox
 *
 * Constraints (enforced by alive-runtime admissibility check):
 *   - No network access
 *   - No process spawn
 *   - No file deletion or path traversal
 *   - No modification of constitution or runtime source files
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
