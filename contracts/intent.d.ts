/**
 * INTENT CONTRACTS — alive-constitution
 *
 * Types for the user intent path:
 *   IntentCategory — bounded Tier 1 classification of what the user wants
 *   IntentRequest  — incoming plain-language user request
 *   IntentResult   — deterministic interpretation produced by alive-mind
 *
 * alive-mind produces IntentResult. alive-runtime receives and routes it.
 * alive-body and alive-interface must not read these directly.
 *
 * constitution imports nothing. All other repos import from here.
 */
import type { SignalKind } from "./signal";
/**
 * Bounded Tier 1 classification of user intent.
 * Deterministic — no ambiguous categories.
 */
export type IntentCategory = 'observe' | 'inspect' | 'safe_action' | 'guided_action' | 'unsupported';
/** Incoming plain-language user request. Produced by alive-interface, received by alive-runtime. */
export interface IntentRequest {
    /** Unique identifier for this request. UUID. */
    request_id: string;
    /** The unmodified plain-language text from the user. Max 1000 characters. */
    raw_text: string;
    /** When this request was submitted. Epoch ms. */
    submitted_at: number;
    /** Which layer submitted this request. */
    source: 'interface' | 'api' | 'test';
    /** Optional: attach this request to an existing conversation thread. */
    thread_id?: string;
    /** Additional context strings (e.g., current file path, active goal). */
    context?: string[];
}
/**
 * Deterministic interpretation of an IntentRequest.
 * Produced by alive-mind intent interpreter. Received by alive-runtime for routing.
 */
export interface IntentResult {
    /** Echoes request_id from IntentRequest for end-to-end traceability. */
    request_id: string;
    /** What class of intent this maps to. */
    category: IntentCategory;
    /** Canonical short form of the intent (e.g., "check repo status"). */
    normalized_intent: string;
    /**
     * How confident the interpreter is in this classification (0.0–1.0).
     * High = clear match (>= 0.7). Medium = partial match. Low = fallback.
     */
    confidence: number;
    /**
     * Which SignalKind to synthesize for the cognition path.
     * alive-runtime uses this to build a Signal that routes correctly.
     * 'unknown' is used only when rejected === true.
     */
    signal_kind: SignalKind;
    /**
     * Parameters extracted from the raw text.
     * E.g., { path: "./src" } for folder inspection requests.
     * Always a flat string-to-string map for simplicity.
     */
    parameters: Record<string, string>;
    /** true = this intent was not understood or is out of scope for Tier 1. */
    rejected: boolean;
    /** Human-readable explanation when rejected === true. Always set if rejected. */
    rejection_reason?: string;
    /** Epoch ms when interpretation completed. */
    interpreted_at: number;
}
//# sourceMappingURL=intent.d.ts.map