import { Action } from "../contracts/action";
export interface AuthorizationPolicy {
  isAuthorized(action: Action, context: unknown): boolean;
}
