export interface ValidationPolicy {
  validate(input: unknown): { valid: boolean; errors: string[] };
}
