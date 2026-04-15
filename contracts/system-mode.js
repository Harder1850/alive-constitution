"use strict";
/**
 * SYSTEM MODE CONTRACT — alive-constitution
 * LOCKDOWN MODE IMPLEMENTATION — Slice 1.5
 *
 * Defines the canonical system operating modes for ALIVE.
 *
 *   NORMAL    — standard operation, full cognitive cycle
 *   LOCKDOWN  — hardened state, strict enforcement, audit required for exit
 *
 * This contract establishes the single source of truth for system mode.
 * All modules MUST respect the system mode and behave accordingly.
 *
 * alive-constitution imports nothing. All other repos import from here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
