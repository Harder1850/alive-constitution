"use strict";
/**
 * STATE CONTRACT — alive-constitution
 * LOCKED — Slice 1  (v16 §31.3)
 *
 * Defines the canonical runtime state snapshot that flows between layers.
 *
 * Ownership and update rules:
 *   - alive-mind (StateModel / ASMState) holds the authoritative copy.
 *   - alive-runtime reads `battery_status` and `mode` for STG resource decisions.
 *   - alive-interface may display state fields but must never modify them.
 *   - No layer other than alive-mind may call a state-update method.
 *
 * This file is a pure type definition — no implementation, no side effects.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
