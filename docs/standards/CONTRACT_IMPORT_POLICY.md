# Contract Import Policy

## Purpose

Define the canonical way all ALIVE repositories import contracts from alive-constitution.

This is a **hard rule**, not a guideline.

---

## Canonical Import Rule

If a contract is exported from:

contracts/index.ts

It MUST be imported using the barrel:

```ts
import { Signal } from 'alive-constitution/contracts'
```

## Barrel-Eligible Contracts

These MUST use the barrel:

- signal
- admissibility
- state
- memory
- crg
- relay-envelope
- memory-shells

## Direct-Only Contracts

These MUST remain direct imports:

```ts
import { Action } from 'alive-constitution/contracts/action'
```

Direct-only list:

- action
- decision
- system-mode
- incident-record
- intent-thread

## Rules

1. Do NOT mix barrel and direct imports for the same contract
2. Do NOT bypass the barrel for barrel-eligible contracts
3. Do NOT add new exports to contracts/index.ts without review
4. Do NOT refactor import paths outside this policy

## Enforcement

All repositories must comply:

- alive-body
- alive-runtime
- alive-mind
- alive-interface

Violations must be corrected immediately.

## Status

Established during:
Contract Migration Phase 1 (canonicalization pass)

This document is the source of truth.
