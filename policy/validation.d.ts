export interface ValidationPolicy {
    validate(input: unknown): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=validation.d.ts.map