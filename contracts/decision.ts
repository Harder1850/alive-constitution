import type { Action } from './action';

export interface Decision {
  id: string;
  selected_action: Action;
  confidence: number;
  admissibility_status: 'pending' | 'passed' | 'blocked';
  reason: string;
  integrity_hash: string;
}

export function computeDecisionIntegrityHash(decision: Pick<Decision, 'id' | 'selected_action' | 'confidence' | 'admissibility_status' | 'reason'>): string {
  const payload = JSON.stringify({
    id: decision.id,
    selected_action: decision.selected_action,
    confidence: decision.confidence,
    admissibility_status: decision.admissibility_status,
    reason: decision.reason,
  });

  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
