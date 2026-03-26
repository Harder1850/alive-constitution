export interface DisplayTextAction {
  type: 'display_text';
  payload: string;
  /** True when the action can be safely undone or is a read-only probe. */
  is_reversible?: boolean;
}

export interface WriteFileAction {
  type: 'write_file';
  /** Filename to write inside alive-web/ (e.g. "index.html"). No path traversal allowed. */
  filename: string;
  /** Full file content to write. */
  content: string;
  is_reversible?: boolean;
}

export type Action = DisplayTextAction | WriteFileAction;
