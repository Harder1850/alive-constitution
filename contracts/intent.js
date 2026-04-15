"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
