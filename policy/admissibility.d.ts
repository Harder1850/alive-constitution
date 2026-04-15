import { Action } from "../contracts/action";
export interface AdmissibilityPolicy {
    isAdmissible(action: Action): boolean;
    reason(action: Action): string;
}
//# sourceMappingURL=admissibility.d.ts.map