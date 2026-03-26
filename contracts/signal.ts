// alive-constitution/contracts/signal.ts

/**
 * SIGNAL CONTRACT
 * Represents a raw perception from the physical or digital environment.
 * Handled first by alive-body, then routed by alive-runtime.
 */

export type SignalSource = 'camera' | 'microphone' | 'telemetry' | 'system_api' | 'peer_bot';
export type FirewallStatus = 'pending' | 'cleared' | 'blocked';

export interface Signal {
  /** Unique identifier for traceability */
  id: string;

  /** Where the signal came from */
  source: SignalSource;

  /** The unparsed data (e.g., JSON string, base64 image, text transcript) */
  raw_content: any;

  /** Millisecond epoch timestamp of perception */
  timestamp: number;

  /** THE LAZY REFLEX TRIGGER
   * If true, alive-runtime bypasses the mind and executes an emergency protocol.
   */
  threat_flag: boolean;

  /** Ensures alive-body has sanitized the input before the brain sees it */
  firewall_status: FirewallStatus;

  /** Set to true by the STG after granting this signal access to the brain */
  stg_verified?: boolean;

  /** Epoch ms when this signal was first perceived by alive-body */
  perceived_at?: number;
}

/** Helper: get a consistent signal ID regardless of field name style. */
export function getSignalId(signal: Signal): string {
  return signal.id;
}
