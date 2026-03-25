export interface Action {
  type: 'display_text';
  payload: string;
  /** True when the action can be safely undone or is a read-only probe. */
  is_reversible?: boolean;
}
