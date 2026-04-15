# ALIVE Contract Import Policy

Status: ACTIVE

## Purpose
Prevent contract drift after canonicalization and migration.

## Canonical Import Surface

All shared contracts must be imported from:

alive-constitution/contracts

Barrel exports include:
- signal
- admissibility
- authorized-action
- memory
- state
- flag
- intent
- system-invariants
- crg
- relay-envelope
- memory-shells

Example:

import { Signal, Episode } from 'alive-constitution/contracts'

## Direct-Only Exceptions

These must remain direct imports:

- contracts/action
- contracts/decision
- contracts/system-mode

Also direct-only unless added to barrel:
- incident-record
- intent-thread
- memory-entry
- symbol
- story
- transition
- perception
- relationship

Example:

import type { Action } from 'alive-constitution/contracts/action'

## Rules

1. If exported by the barrel → use the barrel
2. Do not import barrel contracts from file paths
3. Mixed imports:
   - barrel for shared
   - direct for exceptions
4. Consolidate barrel imports where possible
5. Do not edit generated files

## Change Control

Any change to contracts/index.ts requires explicit review.

## Baseline

- alive-constitution: 9a48d71
- alive-body: 4a6e083
- alive-runtime: 914fb3d
- alive-mind: 5aa7e22

## Rule of Thumb

If it's in contracts/index.ts → use the barrel  
If it's not → use direct import (if allowed)
