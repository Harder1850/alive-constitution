export const SystemInvariants = {
  NO_COGNITION_WITHOUT_STG: {
    description: 'No cognitive cycle may run without runtime STG authorization.',
    enforced_by: 'alive-runtime',
    violation_response: 'blocked',
    amendment_ref: '0001',
  },
  MIND_CANNOT_EXECUTE: {
    description: 'alive-mind may produce descriptive decisions only and may not execute actions.',
    enforced_by: 'alive-runtime',
    violation_response: 'blocked',
    amendment_ref: '0001',
  },
  BODY_CANNOT_DECIDE: {
    description: 'alive-body may sense and act but may not decide intent or meaning.',
    enforced_by: 'alive-runtime',
    violation_response: 'blocked',
    amendment_ref: '0001',
  },
} as const;
