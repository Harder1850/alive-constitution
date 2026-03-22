# ALIVE Constitution

## Commitment

🔒 ALIVE v7.1 — Repo Commitments

This repository defines the governing law of ALIVE.

It is the single source of truth for:
- invariants
- contracts
- identity
- policy
- amendment rules

This layer is immutable-by-default and may only change through formal amendment.

It does not:
- execute
- reason
- store runtime state
- interact with the external world

All other repos depend on this layer.
This layer depends on nothing.

## Architecture Spine

Constitution defines → Runtime governs → Mind thinks → Body acts → Interface displays

## Purpose
Defines the governing law of ALIVE: invariants, contracts, identity, and policy.
Immutable-by-default. Sits above all other layers.

## Authority
- Imported by all other repos
- Imports nothing
- Only modified via formal amendment

## Structure
- `invariants/` — system-wide constants and bounds
- `contracts/` — shared type interfaces
- `identity/` — persistent self definition
- `policy/` — admissibility, authorization, validation
- `amendments/` — change log with justification

## Amendment Rules
- Human-authorized
- Logged and auditable
- Must include justification and impact
- Must include `sunset_review_date` (or `none`)

## Constitutional Non-Override
No emergency, survival, or runtime condition may override constitutional law.

## Non-Scope
- No cognition
- No execution
- No runtime logic
- No memory storage
- No external interaction

## Drift Warning
⚠️ Any executable logic or cognition found here is an architectural violation.
