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
export interface DisplayTextAction {
    /** Discriminant. */
    type: 'display_text';
    /** The text string to render. Must be a plain string — no executable content. */
    payload: string;
    /** True when the action produces no persistent side effect (read-only probe). */
    is_reversible?: boolean;
}
export interface WriteFileAction {
    /** Discriminant. */
    type: 'write_file';
    /**
     * Filename to write, relative to the alive-web/ directory.
     * Path traversal (../) is forbidden and will cause admissibility rejection.
     */
    filename: string;
    /** Full file content to write. Overwrites existing content. */
    content: string;
    /** True when the previous version of the file is backed up and restorable. */
    is_reversible?: boolean;
}
/**
 * Slice 1 action type union.
 * To add a new action type in a later slice, append a new variant here via
 * the formal amendment process — do not widen this union ad-hoc.
 */
export type Action = DisplayTextAction | WriteFileAction;
//# sourceMappingURL=action.d.ts.map