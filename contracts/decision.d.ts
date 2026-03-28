import type { Action } from './action';
export interface Decision {
    id: string;
    selected_action: Action;
    confidence: number;
    admissibility_status: 'pending' | 'passed' | 'blocked';
    reason: string;
    integrity_hash: string;
}
export declare function computeDecisionIntegrityHash(decision: Pick<Decision, 'id' | 'selected_action' | 'confidence' | 'admissibility_status' | 'reason'>): string;
//# sourceMappingURL=decision.d.ts.map