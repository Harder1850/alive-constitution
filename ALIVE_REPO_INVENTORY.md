# ALIVE Repo Inventory

**Generated:** 2026-04-15  
**Part of:** ALIVE Audit and Stabilization Plan

---

## Quick Reference Table

| Repo | Role | Alignment | Build Priority | Recommendation |
|---|---|---|---|---|
| alive-constitution | Law / contracts | ✅ Aligned | HIGH — patch needed | KEEP + REFACTOR (SystemMode collision) |
| alive-runtime | Governance / routing | ⚠️ Partial | CRITICAL — archive drift | KEEP canonical, ARCHIVE main.ts |
| alive-body | Sensors / execution | ✅ Aligned | LOW — minor cleanup | KEEP + DELETE Python files |
| alive-interface | Display / input relay | ⚠️ Partial | MEDIUM — event system | REFACTOR RuntimeClient |
| alive-mind | Cognition / memory | ⚠️ Partial | HIGH — ULL + shells | KEEP spine, REBUILD background, EXTRACT ULL |

---

## alive-constitution

### Role
Single source of truth for governing law. Defines contracts, invariants, identity, and policy. All other repos import from here. This repo imports nothing.

### Structure

```
contracts/         ← shared TypeScript types
invariants/        ← bounds and safety limits
identity/          ← continuity and self-definition
policy/            ← admissibility, authorization, validation
amendments/        ← change log
docs/              ← architecture, boundary rules, hardening plan
```

### Contract Inventory

| Contract | File | Lock Status | Notes |
|---|---|---|---|
| Signal | `contracts/signal.ts` | 🔒 LOCKED (v16 §31.3) | Clean, correct |
| Episode / MemoryKey | `contracts/memory.ts` | 🔒 LOCKED (Slice 3) | LTG uses this correctly |
| RuntimeState | `contracts/state.ts` | 🔒 LOCKED (v16 §31.3) | SystemMode conflict here |
| Action | `contracts/action.ts` | 🔒 LOCKED | Clean |
| Decision | `contracts/decision.ts` | 🔒 LOCKED | Integrity hash |
| AuthorizedAction | `contracts/authorized-action.ts` | 🔒 LOCKED | Token model |
| Flag | `contracts/flag.ts` | 🔒 LOCKED | Used by runtime flag system |
| SystemMode (LOCKDOWN) | `contracts/system-mode.ts` | ⚠️ CONFLICT | Names clash with state.ts |
| Intent | `contracts/intent.ts` | ⚠️ UNSETTLED | Verify usage |
| IntentThread | `contracts/intent-thread.ts` | ⚠️ UNSETTLED | Newer, not fully settled |
| IncidentRecord | `contracts/incident-record.ts` | ⚠️ UNSETTLED | Newer, not fully settled |
| MemoryEntry | `contracts/memory-entry.ts` | ⚠️ REVIEW | Older contract |
| Story | `contracts/story.ts` | ⚠️ REVIEW | Older contract |
| Symbol | `contracts/symbol.ts` | ⚠️ REVIEW | Older contract |
| Perception | `contracts/perception.ts` | ⚠️ REVIEW | Older contract |
| Relationship | `contracts/relationship.ts` | ⚠️ REVIEW | Older contract |
| Transition | `contracts/transition.ts` | ⚠️ REVIEW | Older contract |

**Missing Contracts:**
- `contracts/memory-shells.ts` — Present, ShortTerm, Background, Durable
- `contracts/relay-envelope.ts` — Runtime event emission contract
- `contracts/crg.ts` — CRG state and resource budget types

### Critical Finding
**SystemMode Name Collision:**
- `contracts/state.ts` defines `SystemMode = 'idle' | 'active' | 'alert' | 'emergency'`
- `contracts/system-mode.ts` defines `SystemMode = 'NORMAL' | 'LOCKDOWN'`
- **Resolution:** Rename the lockdown type to `LockdownMode` or `OperationalMode`.

### Verdict: KEEP + targeted REFACTOR

---

## alive-runtime

### Role
Governance and orchestration. Enforces constitutional law, gates cognition via STG, routes signals and actions, manages lifecycle, scheduling, and mode transitions.

### Structure

```
src/
  wiring/          ← pipeline (canonical), bridges, slice demos
  stg/             ← Stop-Thinking Gate
  enforcement/     ← executive, global-gate, lockdown, admissibility
  router/          ← signal, action, memory routers
  triage/          ← signal classification
  flags/           ← flag-store, emitter, quorum
  lifecycle/       ← startup, shutdown, idle, recovery
  modes/           ← ambient, task, alert, emergency, lockdown, recovery, exploration
  scheduler/       ← priority queue, job runner, exploration scheduler
  comparison-baseline/ ← CB service (novelty detection)
  calibration/     ← calibration (verify wiring)
  phase1/          ← PROVING ARTIFACT CLUSTER
enforcement/       ← reflex-router (different from src/enforcement!)
docs/              ← architecture, STG spec, execution flow, hardening
```

### Module Status

| Module | File | Status | Keep? |
|---|---|---|---|
| Canonical pipeline | `src/wiring/pipeline.ts` | ✅ CANONICAL | **YES — FREEZE** |
| STG | `src/stg/stop-thinking-gate.ts` | ✅ CANONICAL | **YES — FREEZE** |
| Executive | `src/enforcement/executive.ts` | ✅ GOOD | YES |
| Global gate | `src/enforcement/global-gate.ts` | ✅ GOOD | YES |
| Lockdown triggers | `src/enforcement/lockdown-triggers.ts` | ✅ GOOD | YES |
| Admissibility check | `src/enforcement/admissibility-check.ts` | ✅ GOOD | YES (name as CAG) |
| Mind bridge | `src/wiring/mind-bridge.ts` | ✅ CLEAN | YES |
| Body bridge | `src/wiring/body-bridge.ts` | ✅ CLEAN | YES |
| Constitution loader | `src/wiring/constitution-loader.ts` | ✅ CLEAN | YES |
| Reflex router | `enforcement/reflex-router.ts` | ✅ GOOD | YES |
| Triage service | `src/triage/triage-service.ts` | ✅ PRESENT | YES |
| Flag system | `src/flags/` | ✅ PRESENT | YES (wire into pipeline) |
| Lifecycle | `src/lifecycle/` | ✅ PRESENT | YES |
| Modes | `src/modes/` | ✅ PRESENT | YES (verify wiring) |
| Scheduler | `src/scheduler/` | ✅ PRESENT | YES |
| CB service | `src/comparison-baseline/` | ✅ PRESENT | YES |
| Memory router | `src/router/memory-router.ts` | ✅ PRESENT | YES |
| Action router | `src/router/action-router.ts` | ✅ PRESENT | YES |
| **main.ts** | `src/main.ts` | ❌ DRIFTED | **NO — ARCHIVE** |
| **signal-router.ts** | `src/router/signal-router.ts` | ⚠️ LEGACY | REFACTOR or ARCHIVE |
| **slice1-cycle.ts** | `src/wiring/slice1-cycle.ts` | ⚠️ PROVING | ARCHIVE → proving/ |
| **slice2-demo.ts** | `src/wiring/slice2-demo.ts` | ⚠️ PROVING | ARCHIVE → proving/ |
| **slice3-demo.ts** | `src/wiring/slice3-demo.ts` | ⚠️ PROVING | ARCHIVE → proving/ |
| **phase1/** | `src/phase1/` | ⚠️ PROVING | ARCHIVE → proving/ |
| cycle.ts | `src/cycle.ts` | ❓ UNKNOWN | INSPECT |
| start-bridge.ts | `src/wiring/start-bridge.ts` | ❓ UNKNOWN | INSPECT |
| stg-policy.ts | `src/stg/stg-policy.ts` | ❓ POSSIBLY REDUNDANT | INSPECT |

**Missing:**
- `src/crg/cognitive-resource-governor.ts` — CRG (CRITICAL GAP)
- `src/wiring/relay.ts` — explicit relay module
- Proper event emission system (currently console.log only)

### Critical Findings Summary
1. `src/main.ts` has own inline `evaluateSTG()` — different from canonical
2. Three competing entry points (main.ts, pipeline.ts, slice1-cycle.ts)
3. Deep cross-repo imports in main.ts violate backbone rules
4. signal-router.ts uses stale STG API

### Verdict: KEEP canonical modules, ARCHIVE drift artifacts, CREATE missing CRG + relay

---

## alive-body

### Role
Sensor input and actuator output. Firewall protection, signal ingestion/filtering, action execution with token verification, execution logging. No cognition, no interpretation.

### Structure

```
src/
  sensors/         ← ingestion, filtering, environment, normalization, adapters
  nervous-system/  ← firewall, emergency-stop, safe-mode, interrupt-manager, event-bus
  actuators/       ← executor (TS), executor.py (DELETE), proving-executor
  autonomic/       ← anomaly detection, health, resources, autonomic_layer.py (DELETE)
  adapters/        ← CPU, disk, filesystem adapters
  logging/         ← execution-log, experience-stream (CLARIFY), feedback, incidents
  tools/           ← captains-log, file-manager, notifier
```

### Module Status

| Module | File | Status | Keep? |
|---|---|---|---|
| Executor | `src/actuators/executor.ts` | ✅ STRONG | **YES — FREEZE** |
| Firewall | `src/nervous-system/firewall.ts` | ✅ CRITICAL | YES |
| Ingestion | `src/sensors/ingestion.ts` | ✅ PRESENT | YES |
| Filtering | `src/sensors/filtering.ts` | ✅ PRESENT | YES |
| Execution log | `src/logging/execution-log.ts` | ✅ PRESENT | YES |
| Nervous system | `src/nervous-system/` | ✅ PRESENT | YES |
| Adapters | `src/adapters/` | ✅ PRESENT | YES |
| Autonomic | `src/autonomic/*.ts` | ✅ PRESENT | YES |
| Tools | `src/tools/` | ✅ PRESENT | YES |
| Experience stream | `src/logging/experience-stream.ts` | ⚠️ OVERLAPS | CLARIFY ownership |
| executor.py | `src/actuators/executor.py` | ❌ DEAD | **DELETE** |
| autonomic_layer.py | `src/autonomic/autonomic_layer.py` | ❌ DEAD | **DELETE** |

### Verdict: KEEP (clean), DELETE Python artifacts, CLARIFY experience-stream ownership

---

## alive-interface

### Role
Display and input relay layer. Shows system state, accepts user input, forwards commands to runtime through controlled channels. No cognition, no execution, no runtime bypass.

### Structure

```
packages/
  shared-types/    ← RuntimeEvent, InterfaceCommand types
  runtime-client/  ← RuntimeClient (FRAGILE — log-scraping)
plugins/
  alive-launcher/  ← Start/stop, profile, status
  alive-trace/     ← Pipeline trace viewer
  alive-signals/   ← Signal injection
  alive-state/     ← Runtime state display
  alive-logs/      ← Log viewer
theia-app/         ← Bootstrap, HTML entry, dev server
studio/            ← DUPLICATE? Mirrors root structure
src/               ← Unknown purpose vs packages/plugins
docs/
  backbone-freeze-audit.md ← Import matrix + acknowledged violations
scripts/
  backbone-freeze-check.mjs ← Static import checker (wire into CI)
```

### Module Status

| Module | File | Status | Keep? |
|---|---|---|---|
| Shared types | `packages/shared-types/` | ✅ GOOD | YES |
| Launcher plugin | `plugins/alive-launcher/` | ✅ PRESENT | YES |
| Trace plugin | `plugins/alive-trace/` | ✅ PRESENT | YES |
| Signals plugin | `plugins/alive-signals/` | ✅ PRESENT | YES |
| State plugin | `plugins/alive-state/` | ✅ PRESENT | YES |
| Logs plugin | `plugins/alive-logs/` | ✅ PRESENT | YES |
| Theia app | `theia-app/` | ✅ PRESENT | YES |
| RuntimeClient | `packages/runtime-client/src/index.ts` | ❌ FRAGILE | REFACTOR |
| studio/ | `studio/` | ❓ UNCLEAR | INSPECT — may duplicate root |
| src/ (root) | `src/` | ❓ UNCLEAR | INSPECT — purpose vs packages/ |
| Backbone freeze check | `scripts/backbone-freeze-check.mjs` | ✅ EXISTS | WIRE INTO CI |

### Critical Finding: Log Scraping
The RuntimeClient connects to the pipeline by:
1. Monkey-patching `console.log`
2. Running the pipeline
3. Parsing captured log strings with regex
4. Emitting structured events based on regex matches

This is fragile. Any pipeline log format change silently breaks the UI. Must be replaced with a proper EventEmitter/WebSocket subscription to a relay module.

### Verdict: KEEP plugins, REFACTOR RuntimeClient, INSPECT studio/ structure, WIRE CI check

---

## alive-mind

### Role
Cognitive operations — signal interpretation, reasoning, simulation, decision formation, memory management. All under runtime governance. Returns decisions only; never executes.

### Structure

```
src/
  spine/           ← mind-loop (canonical), state-model (ASM), phase1-cognition-loop (ARCHIVE)
  decisions/       ← reasoning-engine (ULL embedded), synthesize, llm-teacher, rule-store
  memory/
    stm/           ← short-term-memory (NEEDS REFACTOR — Signal not Episode)
    ltm/           ← long-term-memory (WORKING)
    uc/            ← background-processor (STUB), unconscious-processor
    (many more)    ← episode-store, semantic-graph, memory-orchestrator, experience-stream
  learning/
    ltg/           ← learning-transfer-gate (WORKING)
    compression/   ← compression-engine
    reinforcement-decay/ ← reinforcement-engine
    ull/           ← MISSING — needs to be created
  cognition/       ← are, cce, sve, deliberation, inference, intent, reasoning, self-model
  public/          ← generate-story, inspect-state, interpret-intent, process-cognition
  lockdown/        ← memory-write-guard
  (others)         ← attention, calibration, candidates, consolidation, ingestion, interpretation, etc.
docs/
  specs/           ← SCAFFOLDS ONLY (learning-system.md, asm.md = empty)
  MEMORY_MODULE_REFACTOR.md ← mid-flight refactor status
knowledge/         ← seeded knowledge, manifests
memory/            ← ltm.json, experience-stream.jsonl, stories.json, symbols.json
```

### Memory Layer Status

| Layer | Implementation | Contract Alignment | ULL Ready |
|---|---|---|---|
| Present | ❌ MISSING | — | — |
| Short-Term | ⚠️ Ring buffer of Signals | ❌ Should be Episodes | ❌ No ULL hooks |
| Background (UC) | ❌ 7-line stub | — | ❌ No implementation |
| Long-Term (Durable) | ✅ JSON-backed, MVI | Partial | N/A |
| MemoryOrchestrator | ✅ Well-designed | Not yet authoritative | — |
| Episode Store | ✅ PRESENT | ✅ Uses Episode contract | N/A |
| Semantic Graph | ✅ PRESENT | Partial | N/A |

### Key Module Status

| Module | File | Status | Action |
|---|---|---|---|
| Mind loop | `src/spine/mind-loop.ts` | ✅ CLEAN | KEEP + FREEZE |
| State model (ASM) | `src/spine/state-model.ts` | ✅ CLEAN | KEEP + FREEZE |
| Reasoning engine | `src/decisions/reasoning-engine.ts` | ✅ GOOD | KEEP + REFACTOR (extract ULL) |
| LLM Teacher | `src/decisions/llm-teacher.ts` | ✅ PRESENT | KEEP |
| LTG | `src/learning/ltg/learning-transfer-gate.ts` | ✅ WORKING | KEEP |
| LTM | `src/memory/ltm/long-term-memory.ts` | ✅ WORKING | KEEP |
| Memory Orchestrator | `src/memory/memory-orchestrator.ts` | ✅ SUBSTANTIAL | EXPAND → make authoritative |
| STM | `src/memory/stm/short-term-memory.ts` | ⚠️ MINIMAL | REFACTOR |
| Background processor | `src/memory/uc/background-processor.ts` | ❌ STUB | REBUILD |
| Experience stream | `src/memory/experience-stream.ts` | ⚠️ OVERLAPS | CLARIFY OWNERSHIP |
| Phase1 cognition loop | `src/spine/phase1-cognition-loop.ts` | ⚠️ PROVING | ARCHIVE |
| ULL primitive | `src/learning/ull/` | ❌ MISSING | CREATE |
| Present shell | `src/memory/present/` | ❌ MISSING | CREATE |

### Verdict: KEEP spine/decisions/LTM/LTG, REBUILD background, REFACTOR STM, EXTRACT ULL, ARCHIVE phase1-cognition-loop

---

## Supplementary ALIVE Folders (Non-Repo)

The following folders exist in `c:\ALIVE\` but are not repos:

| Folder | Contents | Status |
|---|---|---|
| `ALIVE/` | Subdirectory of ALIVE I Repos | Repos live here |
| `Sandbox/` | Empty | Not active |
| `Staging/` | Empty | Not active |
| `Cog/` | Unknown | Not inspected |
| `Projects/` | Unknown | Not inspected |
| `Templates/` | Unknown | Not inspected |
| `Vault/` | Unknown | Not inspected |
| `updates/` | Unknown | Not inspected |
| Root `.docx` files | Architecture/design documents | Historical reference |

The root `.docx` files (`ALIVE Cognitive Processing Archit v17.txt`, `ALIVE_Architecture_Expanded.docx`, etc.) appear to be design documents from earlier phases. They were not audited in detail but may contain historical context useful for understanding architectural intent.
