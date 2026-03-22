export interface EscalationPolicy {
  shouldEscalate(event: unknown): boolean;
  escalationTarget(event: unknown): string;
}
