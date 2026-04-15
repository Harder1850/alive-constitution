export interface EscalationPolicy {
    shouldEscalate(event: unknown): boolean;
    escalationTarget(event: unknown): string;
}
//# sourceMappingURL=escalation.d.ts.map