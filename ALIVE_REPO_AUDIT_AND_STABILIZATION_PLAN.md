# ALIVE Repository Audit and Stabilization Plan

**Generated:** 2026-04-15  
**Scope:** All five ALIVE I repositories  
**Auditor:** Cline (full code + doc inspection)  
**Purpose:** Clarity first. Stabilization second. Implementation third.

---

## HOW TO USE THIS DOCUMENT

This is the master audit report. It contains seven formal outputs plus a Final Answer section.

Supporting files (linked below):
- [`ALIVE_REPO_INVENTORY.md`](./ALIVE_REPO_INVENTORY.md) — per-repo detail tables
- [`ALIVE_GAP_ANALYSIS.md`](./ALIVE_GAP_ANALYSIS.md) — prioritized gap list
- [`ALIVE_EXECUTION_PLAN.md`](./ALIVE_EXECUTION_PLAN.md) — phased build plan
- [`ALIVE_FILE_ACTION_LIST.md`](./ALIVE_FILE_ACTION_LIST.md) — concrete per-file actions

---

## REPOSITORIES AUDITED

| Repo | Path | Status |
|---|---|---|
| alive-constitution | `ALIVE I Repos/alive-constitution` | ✅ Audited |
| alive-runtime | `ALIVE I Repos/alive-runtime` | ✅ Audited |
| alive-body | `ALIVE I Repos/alive-body` | ✅ Audited |
| alive-interface | `ALIVE I Repos/alive-interface` | ✅ Audited |
| alive-mind | `ALIVE I Repos/alive-mind` | ✅ Audited |
| alive-core | Not present in filesystem | ❌ Does not exist |
| alive-dev | Not present in filesystem | ❌ Does not exist |

**Note:** `alive-core` and `alive-dev` referenced in task instructions do not exist as separate repos. Their conceptual roles appear to be partially distributed across alive-constitution and alive-runtime.

---

## OUTPUT 1 — REPO INVENTORY

### 1. alive-constitution

**Intended Role:** Single source of truth for governing law — contracts, invariants, identity, policy, amendments. Imported by all other repos. Imports nothing.

**Current State:** Largely correct and clean. The foundational contract layer is well-defined.

**Alignment Status:** ✅ ALIGNED — mostly correct. One serious naming collision found.

**Major Files:**
- `contracts/signal.ts` — LOCKED (v16 §31.3). Well-defined, correct.
- `contracts/memory.ts` — LOCKED (Slice 3). Episode and MemoryKey contracts.
- `contracts/state.ts` — LOCKED (v16 §31.3). RuntimeState with SystemMode.
- `contracts/system-mode.ts` — LOCKDOWN MODE implementation. Defines `SystemMode` as `'NORMAL' | 'LOCKDOWN'`.
- `contracts/action.ts`, `decision.ts`, `flag.ts` — compiled outputs alongside source.
- `contracts/intent.ts`, `intent-thread.ts`, `incident-record.ts` — newer contracts, less settled.
- `policy/` — admissibility, authorization, validation, escalation.
- `invariants/` — action-bounds, emergency-bounds, memory-bounds, system-invariants.
- `identity/` — continuity, identity-spine, protected-self.
- `amendments/` — one amendment (0001-initial), plus template.
- `docs/HARDENING_PLAN.md` — comprehensive 10-test adversarial plan plus 10 boundary violation patterns. Authoritative.

**CRITICAL FINDING — Contract Name Collision:**
> `contracts/state.ts` exports `type SystemMode = 'idle' | 'active' | 'alert' | 'emergency'`
> `contracts/system-mode.ts` exports `type SystemMode = 'NORMAL' | 'LOCKDOWN'`
>
> Two different definitions of `SystemMode` exist in the same contracts layer. This is a drift hazard. Any module that imports `SystemMode` from the constitution can get either definition depending on which file they import from. This must be resolved.

**Other issues:**
- `.js` and `.js.map` compiled files present alongside `.ts` source files in `contracts/` — suggests the repo is being compiled locally and committing artifacts. Minor but creates confusion.
- No CRG contracts defined yet.
- No relay envelope contracts defined yet.
- No Present/Short-Term/Background/Durable shell contracts defined.
- `contracts/intent-thread.ts` and `incident-record.ts` are newer, unclear settlement status.

**Recommendation:** KEEP + targeted REFACTOR (resolve SystemMode collision, add missing contracts, clean compiled artifacts from source directories).

---

### 2. alive-runtime

**Intended Role:** Governance and orchestration layer. Enforces constitutional law, gates cognition via STG, routes signals and actions, manages lifecycle.

**Current State:** Substantially implemented but contains three competing execution entry points and significant structural drift.

**Alignment Status:** ⚠️ PARTIALLY ALIGNED — canonical pipeline exists and is good, but is competing with a separate autonomous "v12" main.ts that has diverged.

**Major Files/Modules:**

| Module | Path | State | Notes |
|---|---|---|---|
| **pipeline.ts** | `src/wiring/pipeline.ts` | ✅ CANONICAL | 8-stage, clean, correct |
| **stop-thinking-gate.ts** | `src/stg/stop-thinking-gate.ts` | ✅ CANONICAL | v16 §31.8, DeferQueue, context-aware |
| **main.ts** | `src/main.ts` | ⚠️ DRIFTED | "v12 Autonomous Command Center" — see below |
| **signal-router.ts** | `src/router/signal-router.ts` | ⚠️ LEGACY | Uses old STG pattern (`shouldThink`), stale |
| **executive.ts** | `src/enforcement/executive.ts` | ✅ GOOD | Loads CONSTITUTION.json + mission.json |
| **reflex-router.ts** | `enforcement/reflex-router.ts` | ✅ GOOD | Threat fast-path, lockdown-aware |
| **slice1-cycle.ts** | `src/wiring/slice1-cycle.ts` | ⚠️ TEST ARTIFACT | Proving harness with exit criteria — not production |
| **slice2-demo.ts** | `src/wiring/slice2-demo.ts` | ⚠️ DEMO ARTIFACT | Demo runner — not production |
| **slice3-demo.ts** | `src/wiring/slice3-demo.ts` | ⚠️ DEMO ARTIFACT | Demo runner — not production |
| **phase1-runtime.ts** | `src/phase1/phase1-runtime.ts` | ⚠️ PROVING ARTIFACT | Large proving/demo harness — not canonical |
| **mind-bridge.ts** | `src/wiring/mind-bridge.ts` | ✅ CLEAN | Thin wrapper, correct |
| **body-bridge.ts** | `src/wiring/body-bridge.ts` | ✅ CLEAN | Full gate enforcement |
| **triage-service.ts** | `src/triage/triage-service.ts` | ✅ PRESENT | Needs verification |
| **flag system** | `src/flags/` | ✅ PRESENT | flag-store, flag-emitter, quorum-accumulator |
| **lifecycle** | `src/lifecycle/` | ✅ PRESENT | startup, shutdown, idle, recovery |
| **modes** | `src/modes/` | ✅ PRESENT | ambient, task, alert, emergency, lockdown, recovery, exploration |
| **scheduler** | `src/scheduler/` | ✅ PRESENT | priority-queue, job-runner, exploration-scheduler |

**CRITICAL FINDING — Dual STG Implementations:**
> `src/main.ts` (line 82) defines its own `evaluateSTG()` function inline with different logic.
> `src/stg/stop-thinking-gate.ts` defines the canonical `evaluateSTG()` with v16 §31.8 three-condition policy.
> Both export the same function name. `main.ts` does NOT import the canonical one.
> This means the autonomous command center is using fundamentally different gating logic from the rest of the pipeline.

**CRITICAL FINDING — Three Competing Entry Points:**
> 1. `src/main.ts` — v12 Autonomous Command Center, WebSocket on port 7070, 1-second tick loop, terrain/log heartbeats. Has its own incomplete pipeline.
> 2. `src/wiring/pipeline.ts` — Canonical 8-stage pipeline. Clean. Correct.
> 3. `src/wiring/slice1-cycle.ts` — Proving harness with 10-exit-criteria trace.
> 
> There is no clear answer to "what is the ALIVE runtime?" when three competing main loops exist.

**CRITICAL FINDING — Deep Cross-Repo Imports in main.ts:**
> `main.ts` directly imports:
> - `../../alive-mind/src/decisions/reasoning-engine`
> - `../../alive-mind/src/spine/state-model`
> - `../../alive-body/src/sensors/environment`
> - `../../alive-body/src/tools/captains-log`
>
> These bypass the public surfaces (`alive-mind/src/index.ts` and `alive-body/src/index.ts`) and violate the backbone freeze rules documented in `alive-interface/docs/backbone-freeze-audit.md`.

**FINDING — signal-router.ts Uses Legacy STG Pattern:**
> `signal-router.ts` calls `evaluateSTG(screened)` without an `STGContext` and still calls `shouldThink(screened)`.
> The canonical STG was upgraded to accept `STGContext` (with triagePriority, batteryPct, cpuRisk).
> `signal-router.ts` was not updated to match.

**Missing:**
- CRG (no module exists)
- Explicit relay module (pipeline.ts serves implicitly)
- CAG (content-admissibility gate — checked inside pipeline but not a named module)

**Recommendation:** KEEP pipeline.ts, stop-thinking-gate.ts, executive.ts, body-bridge.ts, mind-bridge.ts, reflex-router.ts, lifecycle/, modes/, scheduler/, flags/. ARCHIVE main.ts. ARCHIVE or CONSOLIDATE signal-router.ts. ARCHIVE slice1-cycle.ts, slice2-demo.ts, slice3-demo.ts, phase1-runtime.ts (move to `/proving/` or `/archive/`).

---

### 3. alive-body

**Intended Role:** Sensor input and actuator output. Firewall, ingestion, filtering, execution, logging. No cognition, no interpretation.

**Current State:** Well-structured and substantially implemented. Boundary is clean.

**Alignment Status:** ✅ ALIGNED — good boundary discipline. Minor anomalies found.

**Major Files/Modules:**

| Module | Path | State | Notes |
|---|---|---|---|
| **executor.ts** | `src/actuators/executor.ts` | ✅ STRONG | Defense-in-depth: shape + hash verification |
| **firewall.ts** | `src/nervous-system/firewall.ts` | ✅ PRESENT | Critical boundary gate |
| **ingestion.ts** | `src/sensors/ingestion.ts` | ✅ PRESENT | Signal creation entry point |
| **filtering.ts** | `src/sensors/filtering.ts` | ✅ PRESENT | Pre-firewall filter |
| **execution-log.ts** | `src/logging/execution-log.ts` | ✅ PRESENT | Append-only log |
| **experience-stream.ts** | `src/logging/experience-stream.ts` | ⚠️ OVERLAP | Duplicates alive-mind's experience-stream |
| **environment.ts** | `src/sensors/environment.ts` | ✅ PRESENT | Weather/battery/CPU/disk sensors |
| **executor.py** | `src/actuators/executor.py` | ⚠️ ANOMALY | Python file in TS project |
| **autonomic_layer.py** | `src/autonomic/autonomic_layer.py` | ⚠️ ANOMALY | Python file in TS project |
| **nervous-system/** | `src/nervous-system/` | ✅ PRESENT | emergency-stop, event-bus, interrupt-manager, safe-mode, etc. |
| **adapters/** | `src/adapters/` | ✅ PRESENT | CPU, disk, filesystem adapters |

**FINDING — Duplicate Experience Stream:**
> `alive-body/src/logging/experience-stream.ts` and `alive-mind/src/memory/experience-stream.ts` both exist.
> `alive-runtime/main.ts` imports from the alive-mind version.
> `alive-runtime/slice1-cycle.ts` imports `appendSignalToStream` from alive-body's version.
> These are different functions with different purposes but the same concept name. This is a confusion hazard.

**FINDING — Python Files in TypeScript Project:**
> `src/actuators/executor.py` and `src/autonomic/autonomic_layer.py` exist in a TypeScript-only repo.
> They appear to be old prototype artifacts. They are not imported by anything in the TypeScript codebase.
> These should be archived or deleted.

**Recommendation:** KEEP core modules. ARCHIVE/DELETE Python files. CLARIFY ownership of experience-stream between alive-body and alive-mind.

---

### 4. alive-interface

**Intended Role:** Display and control layer. Shows system state, accepts user input, forwards to runtime. No cognition, no execution, no runtime bypass.

**Current State:** Large, substantially built but with structural fragility and acknowledged backbone violations.

**Alignment Status:** ⚠️ PARTIALLY ALIGNED — architecture intent is correct, but implementation has documented weak spots.

**Major Files/Modules:**

| Module | Path | State | Notes |
|---|---|---|---|
| **RuntimeClient** | `packages/runtime-client/src/index.ts` | ⚠️ FRAGILE | Parses console.log output to extract events |
| **shared-types** | `packages/shared-types/src/` | ✅ GOOD | RuntimeEvent, InterfaceCommand types |
| **alive-launcher** | `plugins/alive-launcher/` | ✅ PRESENT | Start/stop, profile, status |
| **alive-trace** | `plugins/alive-trace/` | ✅ PRESENT | Signal trace viewer |
| **alive-signals** | `plugins/alive-signals/` | ✅ PRESENT | Signal injection |
| **alive-state** | `plugins/alive-state/` | ✅ PRESENT | State display |
| **alive-logs** | `plugins/alive-logs/` | ✅ PRESENT | Log viewer |
| **theia-app** | `theia-app/` | ✅ PRESENT | Bootstrap + layout |
| **studio/** | `studio/` | ⚠️ DUPLICATE STRUCTURE | Mirrors root structure — unclear separation |
| **backbone-freeze-audit** | `docs/backbone-freeze-audit.md` | ✅ DOCUMENTED | Acknowledges remaining weak spots |

**CRITICAL FINDING — Log Scraping as Event System:**
> `RuntimeClient.routeThroughPipeline()` works by capturing `console.log` output and parsing it with regex patterns to extract pipeline events.
> Example: `if (log.includes('[PIPELINE]') && log.includes('STG'))` → emit stg.evaluated event.
> This is brittle in the extreme. Any change to a console.log format in pipeline.ts will silently break the interface's understanding of what happened.
> The 00_START_HERE.md claims "9.5/10 Production Ready" but this mechanism is not production quality.

**FINDING — Duplicate Structure:**
> Root-level `packages/`, `plugins/`, `theia-app/` appear to be the actual build target.
> `studio/` subfolder also contains `packages/`, `plugins/`, and `theia-app/` subdirectories.
> It's unclear which is canonical. The `00_START_HERE.md` references root-level paths as file locations.

**FINDING — Backbone Violations Acknowledged:**
> The `backbone-freeze-audit.md` explicitly states:
> "alive-runtime still has existing deep imports into alive-mind/src/* and alive-body/src/* in multiple files."
> "Full remediation requires phased runtime import migration to public surfaces."

**Recommendation:** REFACTOR RuntimeClient to use a real event/WebSocket mechanism. CLARIFY studio/ vs root structure. KEEP plugins as-is pending event system refactor.

---

### 5. alive-mind

**Intended Role:** Cognitive operations — signal interpretation, reasoning, simulation, decision formation, memory management. All cognition under runtime governance.

**Current State:** Very large, substantially implemented but with multiple memory systems in various states of completion, a background processor stub, and ULL embedded rather than extracted.

**Alignment Status:** ⚠️ PARTIALLY ALIGNED — good structural intent, but memory layer is a work-in-progress with competing implementations and key stubs.

**Major Files/Modules:**

| Module | Path | State | Notes |
|---|---|---|---|
| **mind-loop.ts** | `src/spine/mind-loop.ts` | ✅ CLEAN | Thin wrapper over synthesize |
| **state-model.ts** | `src/spine/state-model.ts` | ✅ CLEAN | ASM, canonical state |
| **reasoning-engine.ts** | `src/decisions/reasoning-engine.ts` | ✅ INTERESTING | 4-tier reasoning with ULP embedded as Tier 3 |
| **short-term-memory.ts** | `src/memory/stm/short-term-memory.ts` | ⚠️ MINIMAL | Ring buffer of Signals, no Episode contract, no ULL |
| **long-term-memory.ts** | `src/memory/ltm/long-term-memory.ts` | ✅ WORKING | JSON-backed LTM with MVI tracking |
| **background-processor.ts** | `src/memory/uc/background-processor.ts` | ❌ STUB | 7 lines, TODO comment only |
| **unconscious-processor.ts** | `src/memory/uc/unconscious-processor.ts` | ❌ UNKNOWN | Not read — likely also minimal |
| **memory-orchestrator.ts** | `src/memory/memory-orchestrator.ts` | ✅ SUBSTANTIAL | Encoding + recall, guard-wrapped, not yet authoritative |
| **learning-transfer-gate.ts** | `src/learning/ltg/learning-transfer-gate.ts` | ✅ WORKING | 4-condition LTG, Slice 3 |
| **episode-store.ts** | `src/memory/episode-store.ts` | ✅ PRESENT | STM episodes |
| **semantic-graph.ts** | `src/memory/semantic-graph.ts` | ✅ PRESENT | LTM semantic nodes |
| **experience-stream.ts** | `src/memory/experience-stream.ts` | ⚠️ OVERLAPS | Conflicts with alive-body's version |
| **phase1-cognition-loop.ts** | `src/spine/phase1-cognition-loop.ts` | ⚠️ PROVING ARTIFACT | Demo/proving loop — likely not production spine |
| **llm-teacher.ts** | `src/decisions/llm-teacher.ts` | ✅ PRESENT | Tier 4 fallback |
| **public/** | `src/public/` | ✅ PRESENT | generate-story, inspect-state, interpret-intent, interpret-outcome, process-baseline-cycle, process-cognition |
| **docs/specs/** | `docs/specs/` | ❌ SCAFFOLDS | learning-system.md, asm.md = "scaffold only, no doctrine finalized" |

**CRITICAL FINDING — Background Processor is a Complete Stub:**
> `src/memory/uc/background-processor.ts` is 7 lines of code containing only a TODO comment.
> The Background (UC) layer is identified in current direction as a prime ULL integration target.
> Nothing exists here to integrate with.

**CRITICAL FINDING — ULL is Embedded, Not a Primitive:**
> The Universal Learning Protocol (ULL equivalent) is implemented as "Tier 3" reasoning inside `decisions/reasoning-engine.ts`.
> It is described as a "Universal Learning Protocol" with steps: abstract → cross-domain search → emit probe.
> This is not extracted as a reusable primitive.
> It cannot be independently wired into Short-Term or Background without refactoring.

**FINDING — STM Is Not Episode-Based:**
> `src/memory/stm/short-term-memory.ts` stores raw `Signal` objects in a ring buffer.
> The `contracts/memory.ts` defines `Episode` as the STM unit.
> The actual STM implementation does not use the Episode contract.
> The MemoryOrchestrator's episode handling is separate and uses a different path.

**FINDING — Memory Refactor Is Mid-Flight:**
> `docs/MEMORY_MODULE_REFACTOR.md` explicitly states:
> "New orchestrator is not yet the authoritative runtime memory path."
> "Retrieval policy budgets are defined but not yet enforced by runtime callers."
> Two memory paths (old episode/procedure/derived and new orchestrator) coexist.

**FINDING — Learning System Spec Is Empty:**
> `docs/specs/learning-system.md`: "scaffold only / no doctrine finalized here"
> `docs/specs/asm.md`: "scaffold only / no doctrine finalized here"
> Several specs are placeholder files that look authoritative but contain no content.

**Recommendation:** KEEP spine, decisions, LTM, LTG, MemoryOrchestrator. EXPAND Background processor. REFACTOR STM to use Episode contract. EXTRACT ULL primitive. ARCHIVE phase1-cognition-loop. CLEAN placeholder specs.

---

## OUTPUT 2 — ARCHITECTURE ALIGNMENT REPORT

### What Is Already in Good Shape

1. **alive-constitution contracts** — Signal, Memory (Episode), State, Action, Decision, Flag, AuthorizedAction are solid, locked contracts. The contract layer is largely correct and usable.

2. **alive-runtime canonical pipeline** (`src/wiring/pipeline.ts`) — The 8-stage pipeline (Ingest → Filter → Firewall → STG → Mind → Executive → Gate → Execute → Log) is well-structured, clean, correct, and uses proper bridge wiring.

3. **alive-runtime STG** (`src/stg/stop-thinking-gate.ts`) — v16 §31.8 three-condition policy with STGContext, DeferQueue, starvation prevention, and lock mechanism is the strongest single component in the system.

4. **alive-body executor** — defense-in-depth with shape validation + action-hash re-verification is exactly the right approach.

5. **alive-body boundary discipline** — Body does not import mind. Firewall is clean entry gate. Ingestion, filtering, and execution paths are separate.

6. **alive-runtime enforcement** — executive.ts, global-gate.ts, lockdown-triggers.ts, reflex-router.ts form a coherent enforcement cluster.

7. **alive-mind LTG** — Four-condition Learning Transfer Gate is a solid primitive. 

8. **alive-mind LTM** — JSON-backed long-term memory with MVI is functional.

9. **alive-constitution HARDENING_PLAN.md** — 10 adversarial tests + 10 boundary violation patterns is a strong, actionable document. Should be used as a regression suite target.

10. **Backbone freeze awareness** — The backbone-freeze-audit.md in alive-interface documents the correct import matrix and identifies remaining violations. Static check script exists.

### What Is Partially Useful

1. **alive-mind MemoryOrchestrator** — Well-designed but not yet the authoritative path. Mid-migration.

2. **alive-interface plugins** — Structurally correct architecture (display-only, no direct body/mind calls) but brittle event integration.

3. **alive-runtime flag system** — flag-store, flag-emitter, quorum-accumulator are present and wired in slice1/slice2 cycles. Not wired into canonical pipeline.

4. **alive-mind reasoning-engine** — 4-tier lazy reasoning is conceptually correct and has the ULL seed embedded. Needs extraction rather than replacement.

5. **alive-runtime modes/** — ambient, task, alert, emergency, lockdown, recovery, exploration files exist. Need to verify they're actually wired in.

6. **alive-body adapters/** — CPU, disk, filesystem adapters present. Wired into slice cycles.

### What Is Drifting

1. **alive-runtime main.ts** — The "v12 Autonomous Command Center" is a major drift artifact. It has an inline STG that conflicts with the canonical one, deep imports that violate backbone rules, WebSocket server, terrain heartbeats, and a 1-second tick loop. It reads like an experimental autonomous agent prototype running on top of what should be a pure governance layer. **This file should be archived.**

2. **alive-runtime signal-router.ts** — Uses the old pre-context STG API (no STGContext) and still calls the removed `shouldThink()` separately. It was not updated when the STG was upgraded to v16 §31.8.

3. **alive-runtime phase1-runtime.ts** — A 388-line proving/demo artifact that manages loop status, story mode summaries, and demo explanations. This is not production runtime logic.

4. **alive-mind phase1-cognition-loop.ts** — Similarly a proving artifact that should be in a sandbox/proving directory, not the production spine.

5. **alive-interface RuntimeClient** — Log scraping approach has drifted from the architecture intent. The docs say "real pipeline integration" but the mechanism is console.log regex parsing.

### What Is Obsolete

1. **Python files in alive-body** — `executor.py` and `autonomic_layer.py` are dead artifacts from an earlier Python prototype phase. Not imported anywhere.

2. **Compiled JS artifacts in contracts/** — `.js`, `.js.map`, `.d.ts`, `.d.ts.map` files checked into alive-constitution source directories indicate build artifacts committed to source. Adds noise.

3. **`alive-runtime/src/stg/stg-policy.ts`** — Not read in detail but the existence of a separate `stg-policy.ts` alongside `stop-thinking-gate.ts` may be redundant.

4. **`alive-runtime/src/wiring/start-bridge.ts`** — Unknown purpose (not read), may be stale.

5. **`alive-runtime/src/cycle.ts`** — Unknown purpose (not read), separate from the canonical pipeline.

### What Is Missing (Relative to Current Direction)

1. **CRG** — Completely absent from all repos. Not even a placeholder file exists.

2. **Explicit Relay module** — No dedicated relay. pipeline.ts implicitly serves this role but is not named or bounded as a relay.

3. **Present shell** — No "Present" memory shell exists anywhere.

4. **ULL primitive** — Embedded in reasoning-engine.ts. Not extracted.

5. **ULL-backed Short-Term** — STM is a raw Signal ring buffer. No ULL integration.

6. **ULL-backed Background** — Background processor is a 7-line stub.

7. **Durable shell placeholder** — Not defined.

8. **Canonical memory shell contracts** — Present, Short-Term, Background, Durable are not defined as contracts in alive-constitution.

9. **CAG as named module** — Content admissibility is checked but there's no discrete CAG module that can be independently tested/swapped.

10. **Observable contract for event system** — No defined event bus or relay envelope contract that the interface could subscribe to properly.

---

## OUTPUT 3 — KEEP / EXPAND / REFACTOR / ARCHIVE MATRIX

### alive-constitution

| Item | Classification | Reason |
|---|---|---|
| `contracts/signal.ts` | **KEEP** | Locked, correct, well-used |
| `contracts/memory.ts` | **KEEP** | Locked, Episode contract solid |
| `contracts/state.ts` | **KEEP + PATCH** | Good but needs SystemMode collision resolved |
| `contracts/action.ts` | **KEEP** | Clean |
| `contracts/decision.ts` | **KEEP** | Integrity hash mechanism is good |
| `contracts/authorized-action.ts` | **KEEP** | Token model is correct |
| `contracts/flag.ts` | **KEEP** | Used by runtime flags |
| `contracts/system-mode.ts` | **REFACTOR** | Naming collision with state.ts — must resolve SystemMode disambiguation |
| `contracts/intent.ts` | **KEEP** | Present but verify usage |
| `contracts/intent-thread.ts` | **REFACTOR** | Newer, not fully settled |
| `contracts/incident-record.ts` | **REFACTOR** | Newer, not fully settled |
| `contracts/*.js / *.js.map / *.d.ts` | **DELETE** | Build artifacts — do not commit |
| `invariants/` | **KEEP** | Well-defined bounds |
| `identity/` | **KEEP** | Core identity rules |
| `policy/` | **KEEP** | Admissibility, authorization, validation solid |
| `amendments/` | **KEEP** | Governance log |
| `docs/HARDENING_PLAN.md` | **KEEP + EXPAND** | Should drive test suite |
| `docs/ARCHITECTURE.md` | **KEEP** | Clean, correct |
| **MISSING: CRG contracts** | **CREATE** | Needed for next build phase |
| **MISSING: relay envelope contract** | **CREATE** | Needed for proper relay |
| **MISSING: memory shell contracts** | **CREATE** | Present, Short-Term, Background, Durable |

---

### alive-runtime

| Item | Classification | Reason |
|---|---|---|
| `src/wiring/pipeline.ts` | **KEEP + EXPAND** | Canonical entry point — freeze this as THE spine |
| `src/stg/stop-thinking-gate.ts` | **KEEP** | v16 §31.8, solid, freeze |
| `src/enforcement/executive.ts` | **KEEP** | Constitution+mission loader, good |
| `src/enforcement/global-gate.ts` | **KEEP** | Token gate, critical path |
| `src/enforcement/lockdown-triggers.ts` | **KEEP** | Auto-lockdown, necessary |
| `enforcement/reflex-router.ts` | **KEEP** | Threat fast-path, correct |
| `src/wiring/mind-bridge.ts` | **KEEP** | Clean, thin |
| `src/wiring/body-bridge.ts` | **KEEP** | Gate-enforced, correct |
| `src/wiring/constitution-loader.ts` | **KEEP** | Read-only load |
| `src/lifecycle/` | **KEEP** | startup/shutdown/idle/recovery |
| `src/modes/` | **KEEP** | Mode definitions — verify wiring |
| `src/scheduler/` | **KEEP** | Priority queue, job runner |
| `src/flags/` | **KEEP** | Flag system — wire into pipeline |
| `src/triage/triage-service.ts` | **KEEP** | Triage needed for priority |
| `src/router/memory-router.ts` | **KEEP** | Memory routing |
| `src/router/action-router.ts` | **KEEP** | Action routing |
| `src/main.ts` | **ARCHIVE** | v12 Autonomous Command Center — dual STG, backbone violations, competing loop |
| `src/router/signal-router.ts` | **REFACTOR** or **ARCHIVE** | Legacy STG pattern — either update to v16 or replace with pipeline |
| `src/wiring/slice1-cycle.ts` | **ARCHIVE** | Proving harness — move to `proving/` folder |
| `src/wiring/slice2-demo.ts` | **ARCHIVE** | Demo — move to `proving/` or `scripts/demo/` |
| `src/wiring/slice3-demo.ts` | **ARCHIVE** | Demo |
| `src/phase1/` | **ARCHIVE** | Proving artifact cluster |
| `src/wiring/start-bridge.ts` | **INSPECT + ARCHIVE if stale** | Unknown purpose |
| `src/cycle.ts` | **INSPECT + ARCHIVE if stale** | Unknown purpose |
| `src/comparison-baseline/` | **KEEP** | CB service used in pipeline |
| `src/calibration/` | **INSPECT** | Calibration needed for STG |
| **MISSING: CRG module** | **CREATE** | Priority next build |
| **MISSING: relay module (explicit)** | **CREATE** | Explicit relay boundary |

---

### alive-body

| Item | Classification | Reason |
|---|---|---|
| `src/actuators/executor.ts` | **KEEP** | Excellent defense-in-depth |
| `src/nervous-system/firewall.ts` | **KEEP** | Critical entry gate |
| `src/sensors/ingestion.ts` | **KEEP** | Signal entry point |
| `src/sensors/filtering.ts` | **KEEP** | Pre-firewall filter |
| `src/logging/execution-log.ts` | **KEEP** | Append-only log |
| `src/nervous-system/` | **KEEP** | Safety systems |
| `src/adapters/` | **KEEP** | CPU, disk adapters |
| `src/sensors/environment.ts` | **KEEP** | Used by v12 main only? Verify |
| `src/logging/experience-stream.ts` | **REFACTOR/CLARIFY** | Overlaps with alive-mind version — needs ownership decision |
| `src/autonomic/` | **KEEP** | Health monitoring |
| `src/tools/` | **KEEP** | captains-log, file-manager, notifier |
| `src/actuators/executor.py` | **DELETE** | Dead Python artifact |
| `src/autonomic/autonomic_layer.py` | **DELETE** | Dead Python artifact |

---

### alive-interface

| Item | Classification | Reason |
|---|---|---|
| `packages/shared-types/` | **KEEP** | RuntimeEvent types correct |
| `packages/runtime-client/src/index.ts` | **REFACTOR** | Log-scraping approach must be replaced with real event/WS bridge |
| `plugins/alive-launcher/` | **KEEP** | Correct scope, functional |
| `plugins/alive-trace/` | **KEEP** | Correct scope, functional |
| `plugins/alive-signals/` | **KEEP** | Correct scope, functional |
| `plugins/alive-state/` | **KEEP** | Correct scope, functional |
| `plugins/alive-logs/` | **KEEP** | Correct scope, functional |
| `theia-app/` | **KEEP** | Bootstrap, layout |
| `studio/` | **INSPECT/CLARIFY** | Appears to duplicate root structure — determine canonical path |
| `src/` | **INSPECT/CLARIFY** | Root src/ at interface level — purpose unclear |
| `docs/backbone-freeze-audit.md` | **KEEP + ACT ON** | Good audit — act on remaining violations |
| `scripts/backbone-freeze-check.mjs` | **KEEP + WIRE INTO CI** | Static import checker — should run on every PR |

---

### alive-mind

| Item | Classification | Reason |
|---|---|---|
| `src/spine/mind-loop.ts` | **KEEP** | Clean, thin, correct |
| `src/spine/state-model.ts` | **KEEP** | ASM, canonical |
| `src/decisions/reasoning-engine.ts` | **KEEP + REFACTOR** | Good 4-tier reasoning, ULL needs extraction |
| `src/decisions/llm-teacher.ts` | **KEEP** | Tier 4, necessary |
| `src/decisions/synthesize.ts` | **KEEP** | Core synthesis |
| `src/memory/ltm/long-term-memory.ts` | **KEEP** | Working, MVI-tracked |
| `src/learning/ltg/learning-transfer-gate.ts` | **KEEP** | 4-condition, correct |
| `src/memory/memory-orchestrator.ts` | **KEEP + EXPAND** | Not yet authoritative — needs to become the path |
| `src/memory/episode-store.ts` | **KEEP** | STM episodes |
| `src/memory/semantic-graph.ts` | **KEEP** | LTM nodes |
| `src/memory/stm/short-term-memory.ts` | **REFACTOR** | Ring buffer of Signals — needs to use Episode contract, needs ULL hooks |
| `src/memory/uc/background-processor.ts` | **REBUILD** | 7-line stub — rebuild as ULL integration target |
| `src/memory/uc/unconscious-processor.ts` | **INSPECT** | Likely similar state to background-processor |
| `src/memory/experience-stream.ts` | **CLARIFY OWNERSHIP** | Overlaps with alive-body version |
| `src/spine/phase1-cognition-loop.ts` | **ARCHIVE** | Proving artifact |
| `src/public/` | **KEEP** | Public surface modules |
| `docs/specs/learning-system.md` | **EXPAND** | Scaffold only — needs doctrine |
| `docs/specs/asm.md` | **EXPAND** | Scaffold only — needs doctrine |
| `knowledge/` | **KEEP** | Seeded knowledge |
| **MISSING: ULL primitive module** | **CREATE** | Extract from reasoning-engine |
| **MISSING: Present shell** | **CREATE** | New memory shell |

---

## OUTPUT 4 — CANONICAL BUILD SPINE RECOMMENDATION

The canonical spine going forward should be:

```
alive-constitution/contracts/     ← law (frozen)
       ↓ imported by all
alive-runtime/src/wiring/pipeline.ts   ← THE single entry point
       ↓ calls through bridges
alive-runtime/src/stg/stop-thinking-gate.ts   ← cognitive gate (frozen)
       ↓ if OPEN
alive-mind/src/spine/mind-loop.ts   ← cognition entry
       ↓ decision
alive-runtime/src/enforcement/executive.ts + global-gate.ts   ← enforcement
       ↓ authorized action
alive-body/src/actuators/executor.ts   ← execution (token-verified)
```

### Where Each Component Should Live

| Component | Canonical Home | Current State |
|---|---|---|
| **Shared contracts** | `alive-constitution/contracts/` | PRESENT — mostly complete |
| **Runtime filter / pipeline entry** | `alive-runtime/src/wiring/pipeline.ts` | PRESENT — freeze this |
| **CAG (Content Admissibility Gate)** | `alive-runtime/src/enforcement/admissibility-check.ts` | PRESENT — needs naming as named module |
| **Relay** | `alive-runtime/src/wiring/relay.ts` | MISSING — create as thin routing wrapper |
| **CRG (Cognitive Resource Governor)** | `alive-runtime/src/crg/cognitive-resource-governor.ts` | MISSING — create |
| **Present shell** | `alive-mind/src/memory/present/present-shell.ts` | MISSING — create |
| **Short-Term shell** | `alive-mind/src/memory/stm/short-term-memory.ts` | EXISTS — refactor to Episode contract + ULL hooks |
| **Background shell** | `alive-mind/src/memory/uc/background-processor.ts` | EXISTS as stub — rebuild |
| **Durable shell placeholder** | `alive-mind/src/memory/ltm/long-term-memory.ts` | EXISTS — promote to shell interface |
| **ULL primitive** | `alive-mind/src/learning/ull/universal-learning-protocol.ts` | MISSING — extract from reasoning-engine |
| **Observability / events** | `alive-runtime/src/relay/runtime-events.ts` | MISSING — define proper event emission |
| **Tests** | `alive-runtime/tests/`, `alive-mind/tests/`, `alive-body/tests/` | PARTIAL — hardening tests need full implementation |

### The Canonical Runtime Front-End (Single Entry Point)

The `pipeline.ts` is the canonical runtime front-end. **Freeze it.** All other entry points (main.ts, signal-router.ts, slice*-cycle.ts) should be archived or subordinate to it.

The pipeline should emit a `RuntimeEvent` stream through a proper event bus — not through console.log parsing. This is the #1 structural fix needed.

### Memory Shell Architecture

```
Present        ← immediate working context (new)
Short-Term     ← recent signal episodes, ULL-managed (refactor existing)
Background     ← pattern detection, low-priority processing (rebuild stub)
Durable        ← LTM, LTG-gated (existing, promote interface)
```

All four shells should be defined as contracts in `alive-constitution/contracts/memory-shells.ts`.

---

## OUTPUT 5 — GAP ANALYSIS

*In priority order relative to the target: Canonical runtime front-end + canonical memory shells + ULL-backed Short-Term + ULL-backed Background.*

### Priority 1 — Control Path Gaps

| Gap | Severity | Location | What's Needed |
|---|---|---|---|
| **No CRG exists** | CRITICAL | alive-runtime | Create `src/crg/cognitive-resource-governor.ts` — manages cognitive resource budget, feeds STG context |
| **Dual STG implementations** | CRITICAL | alive-runtime | Archive main.ts inline STG; ensure canonical stop-thinking-gate.ts is the only STG |
| **Three competing entry points** | HIGH | alive-runtime | Archive main.ts, archive slice*.ts proving artifacts; freeze pipeline.ts as canonical |
| **No explicit relay module** | HIGH | alive-runtime | Create `src/wiring/relay.ts` as a named relay boundary |
| **signal-router.ts uses stale STG API** | HIGH | alive-runtime | Update to STGContext or archive |
| **Backbone violations in main.ts** | HIGH | alive-runtime | Archive main.ts (primary violation source) |
| **No event emission system** | HIGH | alive-runtime | Runtime must emit structured RuntimeEvents through a defined bus, not console.log |

### Priority 2 — Memory Shell Gaps

| Gap | Severity | Location | What's Needed |
|---|---|---|---|
| **No Present shell** | HIGH | alive-mind | Create `src/memory/present/present-shell.ts` |
| **STM uses Signal not Episode** | HIGH | alive-mind | Refactor `stm/short-term-memory.ts` to use Episode contract |
| **Memory shells not in contracts** | HIGH | alive-constitution | Define `contracts/memory-shells.ts` |
| **MemoryOrchestrator not yet authoritative** | MEDIUM | alive-mind | Complete migration so orchestrator is the runtime memory path |
| **Durable shell has no interface contract** | MEDIUM | alive-constitution | Promote LTM to shell interface |

### Priority 3 — ULL Integration Gaps

| Gap | Severity | Location | What's Needed |
|---|---|---|---|
| **ULL embedded in reasoning-engine** | HIGH | alive-mind | Extract `src/learning/ull/universal-learning-protocol.ts` as standalone primitive |
| **Background processor is stub** | HIGH | alive-mind | Rebuild `src/memory/uc/background-processor.ts` with real pattern detection + ULL hooks |
| **STM has no ULL integration hooks** | HIGH | alive-mind | Add ULL event hooks to Short-Term shell after contract update |
| **Learning system spec is empty** | MEDIUM | alive-mind | Write actual doctrine in `docs/specs/learning-system.md` |

### Priority 4 — Observability and Test Gaps

| Gap | Severity | Location | What's Needed |
|---|---|---|---|
| **Interface event system is log-scraping** | HIGH | alive-interface | Replace RuntimeClient.routeThroughPipeline() with proper event relay |
| **Hardening tests not implemented** | HIGH | alive-runtime | `docs/HARDENING_PLAN.md` has 10 tests — none appear fully automated |
| **Flag system not wired into canonical pipeline** | MEDIUM | alive-runtime | Wire flag-store/flag-emitter into pipeline.ts |
| **Backbone freeze check not in CI** | MEDIUM | alive-interface | `scripts/backbone-freeze-check.mjs` exists but no automated gate |

### Priority 5 — Clean-up Gaps

| Gap | Severity | Location | What's Needed |
|---|---|---|---|
| **SystemMode naming collision** | HIGH | alive-constitution | Resolve two conflicting `SystemMode` type exports |
| **Compiled JS in source** | MEDIUM | alive-constitution | Add to .gitignore or clean from tracked files |
| **Python files in alive-body** | LOW | alive-body | Archive executor.py and autonomic_layer.py |
| **Duplicate experience-stream** | MEDIUM | alive-body + alive-mind | Decide single owner, deprecate the other |
| **studio/ structure unclear** | MEDIUM | alive-interface | Determine canonical path, archive or remove duplicate |
| **Placeholder spec files** | LOW | alive-mind | Fill or delete `docs/specs/learning-system.md`, `docs/specs/asm.md` |

---

## OUTPUT 6 — EXECUTION PLAN

### Phase 1: Lock and Freeze (Days 1–3)
*Goal: Establish what is canonical and prevent further drift.*

**alive-constitution:**
- Resolve the `SystemMode` naming collision between `state.ts` and `system-mode.ts`. One definition must win.
- Add `.gitignore` rule to exclude compiled artifacts (`.js`, `.js.map`, `.d.ts`, `.d.ts.map`) from source directories.
- Tag `contracts/signal.ts`, `contracts/memory.ts`, `contracts/state.ts`, `contracts/action.ts`, `contracts/decision.ts`, `contracts/authorized-action.ts` as FROZEN in their headers.

**alive-runtime:**
- Move `src/main.ts` → `archive/main-v12-autonomous.ts.archive` (or a `/proving/` folder). Do not delete — preserve for reference.
- Move `src/wiring/slice1-cycle.ts`, `slice2-demo.ts`, `slice3-demo.ts` → `proving/` folder.
- Move `src/phase1/` → `proving/phase1/`.
- Create a `src/wiring/README.md` stating `pipeline.ts` is the single canonical entry point.
- Declare `src/wiring/pipeline.ts` and `src/stg/stop-thinking-gate.ts` as FROZEN files.

**alive-body:**
- Archive `executor.py` and `autonomic_layer.py` → `archive/python-prototypes/`.

**Deliverable:** Clear canonical status of every major module. No more ambiguity about which pipeline to use.

---

### Phase 2: Build First (Days 4–10)
*Goal: Fill the most critical gaps in the control path and memory shell layer.*

**Repo:** alive-constitution
- Create `contracts/memory-shells.ts` — define Present, ShortTerm, Background, Durable shell interfaces.
- Create `contracts/relay-envelope.ts` — define the event emission contract for the relay.
- Start `contracts/crg.ts` — define CRG state interface.

**Repo:** alive-runtime
- Create `src/crg/cognitive-resource-governor.ts` — minimal first implementation. Manages cognitive resource budget. Feeds STGContext.
- Create `src/wiring/relay.ts` — explicit relay module. Wraps pipeline, adds structured RuntimeEvent emission to an EventEmitter (not console.log).
- Wire flag system into `pipeline.ts` — add flag emission points at firewall block, CB anomaly, STG defer.
- Update `src/router/signal-router.ts` to use STGContext, or remove it and route everything through `pipeline.ts`.

**Repo:** alive-mind
- Create `src/memory/present/present-shell.ts` — immediate working context buffer. Simplest possible implementation first.
- Refactor `src/memory/stm/short-term-memory.ts` — change from Signal ring buffer to Episode-based, add ULL hook stubs.

**Dependencies:** Phase 1 complete (canon frozen).

**Deliverable:** CRG exists, relay exists, Present shell exists, STM uses correct contract, pipeline emits real events.

---

### Phase 3: Parallel Tracks (Days 11–21)
*Goal: ULL integration and observability. Can proceed in parallel.*

**Track A — ULL primitive + Background (alive-mind):**
- Extract ULL logic from `src/decisions/reasoning-engine.ts` into `src/learning/ull/universal-learning-protocol.ts`.
- Write doctrine for `docs/specs/learning-system.md` — minimum viable spec.
- Rebuild `src/memory/uc/background-processor.ts` with actual pattern detection using ULL hooks.
- Wire ULL into STM (Short-Term shell).

**Track B — Interface event system (alive-interface):**
- Replace `RuntimeClient.routeThroughPipeline()` log-scraping with a proper WebSocket or EventEmitter subscription to `alive-runtime/src/wiring/relay.ts`.
- Define RuntimeEvent subscription contract.
- Update plugins to subscribe to the real event bus.

**Track C — Hardening tests (alive-runtime + alive-body):**
- Implement the 10 adversarial tests from `HARDENING_PLAN.md` as actual automated tests.
- Wire `backbone-freeze-check.mjs` into CI/PR gate.

**Dependencies:** Phase 2 complete (relay + CRG exist for Track B; ULL extract for Track A).

**Deliverable:** ULL primitive extracted, Background processor functional, interface event system non-fragile, 10 hardening tests automated.

---

### Phase 4: What Should Wait
*Goal: Extended systems and polish — after the spine is stable.*

The following should NOT be started until Phase 1-3 are complete:

1. **Multi-user collaboration** (interface)
2. **Trace database persistence** (interface)
3. **Full Theia IDE integration** (interface)
4. **Advanced plugins** — profiler, memory inspector, decision explainability
5. **Contradiction accumulation in LTG** (Slice 4 work)
6. **Peer node knowledge validation** (distributed future)
7. **Prediction / self-observer / idle processor** (Extended systems)
8. **Captain's Log / terrain heartbeat** from main.ts — these were interesting experiments, but should only be re-introduced after the canonical pipeline is stable and they're built as proper observers, not baked into the main loop.

---

## OUTPUT 7 — FILE-LEVEL ACTION LIST

*(See `ALIVE_FILE_ACTION_LIST.md` for full detail. Summary here.)*

### alive-constitution

| File/Folder | Action |
|---|---|
| `contracts/*.js`, `*.js.map`, `*.d.ts`, `*.d.ts.map` | **DELETE/gitignore** — build artifacts in source |
| `contracts/system-mode.ts` | **PATCH** — rename its `SystemMode` to `LockdownMode` or `OperationalMode` to resolve collision with state.ts |
| `contracts/state.ts` | **KEEP** — canonical SystemMode stays here as `'idle'|'active'|'alert'|'emergency'` |
| `contracts/memory-shells.ts` | **CREATE** — Present/ShortTerm/Background/Durable shell interfaces |
| `contracts/relay-envelope.ts` | **CREATE** — relay event contract |
| `contracts/crg.ts` | **CREATE** — CRG state interface |

### alive-runtime

| File/Folder | Action |
|---|---|
| `src/main.ts` | **ARCHIVE** → `proving/main-v12-autonomous-command-center.ts` |
| `src/wiring/slice1-cycle.ts` | **ARCHIVE** → `proving/slice1-cycle.ts` |
| `src/wiring/slice2-demo.ts` | **ARCHIVE** → `proving/slice2-demo.ts` |
| `src/wiring/slice3-demo.ts` | **ARCHIVE** → `proving/slice3-demo.ts` |
| `src/phase1/` (entire folder) | **ARCHIVE** → `proving/phase1/` |
| `src/router/signal-router.ts` | **REFACTOR** — update STGContext, remove shouldThink; or ARCHIVE |
| `src/wiring/pipeline.ts` | **KEEP + FREEZE** — add CANONICAL ENTRY POINT header |
| `src/stg/stop-thinking-gate.ts` | **KEEP + FREEZE** — add FROZEN header |
| `src/wiring/relay.ts` | **CREATE** — explicit relay with EventEmitter |
| `src/crg/cognitive-resource-governor.ts` | **CREATE** — CRG module |
| `src/crg/crg-types.ts` | **CREATE** — CRG types |
| `src/cycle.ts` | **INSPECT** — determine if needed, archive if stale |
| `src/wiring/start-bridge.ts` | **INSPECT** — determine if needed, archive if stale |

### alive-body

| File/Folder | Action |
|---|---|
| `src/actuators/executor.py` | **ARCHIVE/DELETE** → `archive/python-prototypes/` |
| `src/autonomic/autonomic_layer.py` | **ARCHIVE/DELETE** → `archive/python-prototypes/` |
| `src/logging/experience-stream.ts` | **CLARIFY** — decide: body logs raw signal events, mind logs cognitive events. Rename to `signal-event-log.ts` to differentiate? |

### alive-interface

| File/Folder | Action |
|---|---|
| `packages/runtime-client/src/index.ts` | **REFACTOR** — replace log-scraping with proper event subscription |
| `studio/` | **INSPECT** — determine if this is canonical or duplicate; archive one |
| `src/` (root level) | **INSPECT** — determine purpose vs packages/ and plugins/ |
| `scripts/backbone-freeze-check.mjs` | **KEEP + WIRE INTO CI** |

### alive-mind

| File/Folder | Action |
|---|---|
| `src/memory/stm/short-term-memory.ts` | **REFACTOR** — change to Episode-based, add ULL hooks |
| `src/memory/uc/background-processor.ts` | **REBUILD** — actual implementation |
| `src/memory/uc/unconscious-processor.ts` | **INSPECT** — determine state, likely stub |
| `src/spine/phase1-cognition-loop.ts` | **ARCHIVE** → `proving/phase1-cognition-loop.ts` |
| `src/memory/experience-stream.ts` | **CLARIFY OWNERSHIP** — coordinate with alive-body version |
| `src/learning/ull/universal-learning-protocol.ts` | **CREATE** — extract from reasoning-engine |
| `src/memory/present/present-shell.ts` | **CREATE** — Present memory shell |
| `docs/specs/learning-system.md` | **EXPAND** — write actual doctrine |
| `docs/specs/asm.md` | **EXPAND** — write actual doctrine |
| `knowledge/` | **KEEP** — seeded knowledge, useful |

---

## FINAL ANSWERS

### 1. Where are we actually at across the repos right now?

**The core architecture is correctly designed and partially implemented.** The contract layer (alive-constitution), the canonical pipeline (pipeline.ts), the STG (stop-thinking-gate.ts), the executor (with token gate), the LTG, and the LTM are all working and well-bounded.

**However, there is significant accumulated drift:** a competing "v12 autonomous" main.ts that has its own inline STG, three entry points where there should be one, an interface event system that works by parsing console.log, a background processor that is a 7-line stub, and a ULL that is embedded rather than extracted. The "proving/demo" cycle artifacts from Slice 1–3 development are living alongside production code.

**The short answer:** The spine exists and is good. The drift layer is real but removable. The missing pieces are well-defined and buildable.

---

### 2. What is the one canonical implementation path going forward?

```
[Signal IN]
    ↓
alive-body/src/sensors/ingestion.ts       (ingest)
    ↓
alive-body/src/sensors/filtering.ts       (filter)
    ↓
alive-body/src/nervous-system/firewall.ts (firewall)
    ↓
alive-runtime/src/stg/stop-thinking-gate.ts  (STG gate, fed by CRG)
    ↓ if OPEN
alive-mind/src/spine/mind-loop.ts         (cognition)
    ↓
alive-runtime/src/enforcement/executive.ts  (constitutional check)
    ↓
alive-runtime/src/enforcement/global-gate.ts (token issuance)
    ↓
alive-body/src/actuators/executor.ts      (execution, token-verified)
    ↓
alive-body/src/logging/execution-log.ts   (log)
```

This pipeline is **already implemented in `alive-runtime/src/wiring/pipeline.ts`**. Freeze it. Archive everything that competes with it.

---

### 3. What should be frozen now?

1. `alive-constitution/contracts/signal.ts`
2. `alive-constitution/contracts/memory.ts` (Episode)
3. `alive-constitution/contracts/state.ts`
4. `alive-constitution/contracts/action.ts`
5. `alive-constitution/contracts/decision.ts`
6. `alive-constitution/contracts/authorized-action.ts`
7. `alive-runtime/src/wiring/pipeline.ts` — canonical entry point
8. `alive-runtime/src/stg/stop-thinking-gate.ts` — canonical STG
9. `alive-body/src/actuators/executor.ts` — canonical executor
10. `alive-runtime/src/enforcement/executive.ts`
11. `alive-runtime/src/enforcement/global-gate.ts`
12. `alive-runtime/src/wiring/mind-bridge.ts`
13. `alive-runtime/src/wiring/body-bridge.ts`

**These files must not be changed without a formal amendment or explicit architectural review.**

---

### 4. What should be built next?

In this order:

1. **Resolve SystemMode collision** in alive-constitution (1 hour, prevents future confusion)
2. **Archive main.ts and proving artifacts** in alive-runtime (1 hour, eliminates dual-STG drift)
3. **Create relay.ts** in alive-runtime (1 day, gives interface a proper event subscription target)
4. **Create CRG module** in alive-runtime (2 days, feeds real context into STG)
5. **Add memory shell contracts** to alive-constitution (1 day)
6. **Create Present shell** in alive-mind (1 day)
7. **Refactor STM to Episode-based** in alive-mind (1 day)
8. **Extract ULL primitive** from reasoning-engine.ts (2 days)
9. **Replace log-scraping** in RuntimeClient (2 days, needs relay.ts first)
10. **Rebuild Background processor** with ULL hooks (3 days)

---

### 5. What should be archived or ignored so it stops causing confusion?

| Item | Why it causes confusion |
|---|---|
| `alive-runtime/src/main.ts` | Has its own STG, looks like THE entry point, is not |
| `alive-runtime/src/wiring/slice1-cycle.ts` | Looks like a production cycle runner, is a test harness |
| `alive-runtime/src/wiring/slice2-demo.ts` | Same |
| `alive-runtime/src/wiring/slice3-demo.ts` | Same |
| `alive-runtime/src/phase1/` | Proving artifact — looks like production logic |
| `alive-mind/src/spine/phase1-cognition-loop.ts` | Proving artifact in production spine |
| `alive-body/src/actuators/executor.py` | Old Python prototype — looks like there's a Python execution path |
| `alive-mind/docs/specs/learning-system.md` | Looks like a spec — is empty |
| `alive-mind/docs/specs/asm.md` | Looks like a spec — is empty |
| `alive-constitution/contracts/*.js` | Look like contracts — are build artifacts |

---

### 6. What can be done in parallel safely?

After Phase 1 (freeze/archive) is complete:

- **Track A:** ULL extraction + Background processor rebuild (alive-mind)
- **Track B:** Interface RuntimeClient event system refactor (alive-interface), *after relay.ts exists*
- **Track C:** Hardening test automation (alive-runtime/tests/, alive-body/tests/)
- **Track D:** Backbone freeze CI gate (alive-interface/scripts/)

These are independent once the canonical spine is frozen.

---

### 7. What is the cleanest plan for the next 2 weeks?

**Week 1 — Stabilization:**

| Day | Task | Repo | Output |
|---|---|---|---|
| 1 | Resolve SystemMode collision | alive-constitution | Clean contracts |
| 1 | Archive main.ts + proving artifacts | alive-runtime | Single entry point |
| 1 | Delete Python files from alive-body | alive-body | Clean source |
| 2 | Create relay.ts with EventEmitter | alive-runtime | Real event emission |
| 2-3 | Create CRG module (minimal) | alive-runtime | CRG feeds STGContext |
| 3 | Create memory shell contracts | alive-constitution | Shell interfaces |
| 4 | Create Present shell | alive-mind | Present shell implemented |
| 4-5 | Refactor STM to Episode-based | alive-mind | STM correct |

**Week 2 — ULL Integration + Observability:**

| Day | Task | Repo | Output |
|---|---|---|---|
| 6-7 | Extract ULL primitive | alive-mind | Reusable ULL module |
| 7-8 | Rebuild Background processor | alive-mind | Background functional |
| 8-9 | Wire ULL into STM | alive-mind | ULL-backed Short-Term |
| 9-10 | Replace log-scraping in RuntimeClient | alive-interface | Real event subscription |
| 10 | Wire backbone-freeze-check.mjs into CI | alive-interface | Automated gate |

**End of 2 weeks:** Canonical runtime front-end frozen. Canonical memory shells defined and partially implemented. ULL-backed Short-Term complete. ULL-backed Background functional. Interface event system reliable.

---

*End of main audit report. See supporting files for expanded detail.*
