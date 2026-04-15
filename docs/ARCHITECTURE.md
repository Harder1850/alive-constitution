# Architecture

## Overview

This repository defines the governing law of ALIVE. It is the immutable foundation upon which all other system layers operate.

## System Role

- Single source of truth for invariants, contracts, identity, and policy
- Imported by all other repositories
- Does not import or depend on any other repository
- Changes only via formal amendment process

## Core Components

### invariants/
System-wide constants, bounds, and safety limits that cannot be violated under any circumstance.

### contracts/
Shared TypeScript interfaces defining the structure of signals, decisions, actions, and memory entries.

### identity/
Persistent self-definition and continuity rules that define what ALIVE is across time.

### policy/
Authorization, admissibility, validation, and escalation rules.

### amendments/
Change log containing all modifications to constitutional law with justification.

## Data Flow

```
Constitution → [imported by] → Runtime → Mind → Body → Interface
                    ↑
            All other repos
```

## Boundaries

- No execution logic
- No cognition
- No runtime state storage
- No external world interaction

## Interfaces

- Exported TypeScript contracts
- Policy rule definitions
- Invariant constants
- Amendment templates

## Constraints

- Immutable by default
- Human-authorized changes only
- All changes must include sunset_review_date
- No overrides permitted

## Failure Modes

- If executable logic is found → architectural violation
- If cognition is performed → boundary breach
- If imported by constitution → circular dependency

## Open Questions

None. Constitution is authoritative and complete.
