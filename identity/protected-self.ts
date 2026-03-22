/** Protected self attributes that no runtime event may modify. */
export interface ProtectedSelf {
  coreValues: string[];
  prohibitedActions: string[];
  identityHash: string;
}
