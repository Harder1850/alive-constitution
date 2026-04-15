/**
 * RELAY ENVELOPE CONTRACT — alive-constitution
 * Cross-layer transfer envelope
 *
 * Defines the transport structure for passing payload references between
 * system layers. Mechanical routing only — no cognition, no decision semantics.
 *
 * Types only — no logic, no implementations.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
/**
 * The allowed cross-layer transfer paths in the ALIVE architecture.
 * Only actual system transitions are listed — no abstract or future routes.
 */
export type RelayRoute = 'body→runtime' | 'runtime→mind' | 'mind→runtime' | 'runtime→body' | 'runtime→interface' | 'interface→runtime';
/**
 * Transport envelope for a single cross-layer transfer.
 * Carries only routing identity and a reference to the payload.
 */
export interface RelayEnvelope {
    /** Unique identifier for this transfer. */
    id: string;
    /** Layer originating the transfer. */
    sourceLayer: 'body' | 'runtime' | 'mind' | 'interface';
    /** Layer receiving the transfer. */
    targetLayer: 'body' | 'runtime' | 'mind' | 'interface';
    /** The route this transfer follows. */
    route: RelayRoute;
    /** Reference ID of the payload being transferred. */
    payloadRef: string;
    /** Epoch ms when this envelope was created. */
    timestamp: number;
}
//# sourceMappingURL=relay-envelope.d.ts.map