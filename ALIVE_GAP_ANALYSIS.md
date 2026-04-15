# ALIVE Gap Analysis

**Generated:** 2026-04-15  
**Part of:** ALIVE Audit and Stabilization Plan  
**Target State:** Canonical runtime front-end + canonical memory shells + ULL-backed Short-Term + ULL-backed Background

---

## How to Read This Document

Gaps are listed in strict priority order relative to the build target. Each gap has:
- **Severity** — CRITICAL / HIGH / MEDIUM / LOW
- **Repo** — where the work goes
- **Current state** — what exists (if anything)
- **What's needed** — what to build or fix

---

## PRIORITY 1 — Control Path Gaps

These are blocking. The canonical control path cannot be trusted until they are resolved.

---

### GAP-001: Dual STG Implementations

**Severity:** CRITICAL  
**Repo:** alive-runtime  
**Current state:** `src/main.ts` defines its own `evaluateSTG()` function inline (lines 82–132) with fundamentally different logic from the canonical `src/stg/stop-thinking-gate.ts`. The two cannot coexist without ambiguity about which rules govern cognition gating.  
**What's needed:** Archive `src/main.ts`. The canonical STG in `src/stg/stop-thinking-gate.ts` must be the only implementation.  
**Blocking:** Everything downstream of STG gate is unreliable until this is resolved.

---

### GAP-002: Three Competing Pipeline Entry Points

**Severity:** CRITICAL  
**Repo:** alive-runtime  
**Current state:** Three files all claim to define "how ALIVE runs":
1. `src/main.ts` — v12 autonomous command center with 1-second tick loop and WebSocket
2. `src/wiring/pipeline.ts` — canonical 8-stage pipeline
3. `src/wiring/slice1-cycle.ts` — proving harness with 10-exit-criteria trace

None of them are labeled as canonical vs experimental in the code.  
**What's needed:** Archive main.ts and slice*.ts proving artifacts. Add `CANONICAL ENTRY POINT` header to pipeline.ts. Create `src/wiring/README.md` to document this explicitly.

---

### GAP-003: No CRG (Cognitive Resource Governor)

**Severity:** CRITICAL  
**Repo:** alive-runtime  
**Current state:** No CRG module exists anywhere in any repo.  
**What's needed:** `src/crg/cognitive-resource-governor.ts` — manages cognitive resource budget and feeds real `STGContext` (triagePriority, batteryPct, cpuRisk) to the STG. Currently the STG context is populated ad hoc in different files with different default values.  
**Note:** The STG already accepts an `STGContext` parameter — it just isn't being systematically fed from a single authoritative source.

---

### GAP-004: No Explicit Relay Module

**Severity:** HIGH  
**Repo:** alive-runtime  
**Current state:** `pipeline.ts` implicitly serves as the relay but is not named or bounded as one. There is no dedicated relay module that other layers (especially interface) can subscribe to for structured events.  
**What's needed:** `src/wiring/relay.ts` — thin wrapper around pipeline that adds an EventEmitter-based event stream. Interface subscribes to relay events instead of parsing console.log.

---

### GAP-005: No Runtime Event Emission System

**Severity:** HIGH  
**Repo:** alive-runtime + alive-interface  
**Current state:** The only way the interface learns about pipeline events is by capturing and parsing `console.log` strings. Any change to a log message format silently breaks the UI.  
**What's needed:** The relay module (GAP-004) must emit typed `RuntimeEvent` objects through an EventEmitter or WebSocket. The alive-interface `packages/shared-types/` already has the correct `RuntimeEvent` type definitions — they just need a real emitter behind them.

---

### GAP-006: signal-router.ts Uses Stale STG API

**Severity:** HIGH  
**Repo:** alive-runtime  
**Current state:** `src/router/signal-router.ts` calls `evaluateSTG(screened)` without an `STGContext` and still calls `shouldThink(screened)` separately. The canonical STG was upgraded to v16 §31.8 with a context-aware signature. signal-router.ts was not updated.  
**What's needed:** Either update signal-router.ts to use `STGContext`, or archive it — all signal routing should go through `pipeline.ts` which already uses the correct API.

---

### GAP-007: Deep Cross-Repo Imports in main.ts Violate Backbone Rules

**Severity:** HIGH  
**Repo:** alive-runtime  
**Current state:** `src/main.ts` imports directly from `../../alive-mind/src/decisions/reasoning-engine`, `../../alive-mind/src/spine/state-model`, `../../alive-body/src/sensors/environment`, `../../alive-body/src/tools/captains-log`. These bypass the public surfaces and violate the backbone import matrix.  
**What's needed:** Archive main.ts (resolves this automatically). Any future autonomous features must use bridge modules and public surfaces only.

---

## PRIORITY 2 — Memory Shell Gaps

---

### GAP-008: No Present Shell

**Severity:** HIGH  
**Repo:** alive-mind  
**Current state:** No Present memory shell exists anywhere in any repo. Not even a placeholder.  
**What's needed:** `src/memory/present/present-shell.ts` — immediate working context buffer. This should hold the currently active signal + working context for the active cognitive cycle. Simplest possible implementation first (a bounded buffer, not a full module).

---

### GAP-009: STM Uses Signal Not Episode

**Severity:** HIGH  
**Repo:** alive-mind  
**Current state:** `src/memory/stm/short-term-memory.ts` stores raw `Signal` objects in a ring buffer. The `alive-constitution/contracts/memory.ts` defines `Episode` as the canonical STM unit.  
**What's needed:** Refactor `short-term-memory.ts` to store `Episode` objects. The episode contract is already defined and the LTG already operates on Episodes. The STM just needs to use the right type.

---

### GAP-010: Memory Shell Contracts Not Defined

**Severity:** HIGH  
**Repo:** alive-constitution  
**Current state:** No `contracts/memory-shells.ts` exists. The Present, Short-Term, Background, and Durable shells are not formally defined as contracts.  
**What's needed:** `contracts/memory-shells.ts` — interfaces for all four shell types. This is the constitutional source of truth for what each shell is and what operations it must support.

---

### GAP-011: MemoryOrchestrator Not Yet Authoritative

**Severity:** MEDIUM  
**Repo:** alive-mind  
**Current state:** `src/memory/memory-orchestrator.ts` is well-designed but explicitly called out as "not yet the authoritative runtime memory path" in `docs/MEMORY_MODULE_REFACTOR.md`. Two memory paths coexist.  
**What's needed:** Complete the migration described in MEMORY_MODULE_REFACTOR.md. Make the orchestrator the single authoritative path. Archive or deprecate the old episode/procedure/derived paths.

---

### GAP-012: Durable Shell Has No Interface Contract

**Severity:** MEDIUM  
**Repo:** alive-constitution + alive-mind  
**Current state:** `ltm/long-term-memory.ts` is functional but has no formal shell interface. It's accessed directly without a defined contract surface.  
**What's needed:** Define the Durable shell interface in `contracts/memory-shells.ts`. The LTM implementation should satisfy that interface.

---

## PRIORITY 3 — ULL Integration Gaps

---

### GAP-013: ULL Embedded, Not Extracted as Primitive

**Severity:** HIGH  
**Repo:** alive-mind  
**Current state:** The Universal Learning Protocol is implemented as "Tier 3" reasoning inside `src/decisions/reasoning-engine.ts`. Steps: abstract signal → cross-domain search → emit low-risk reversible probe. It works, but it's embedded in a function that handles 4 different reasoning tiers. It cannot be independently wired into other memory layers without importing all of reasoning-engine.ts.  
**What's needed:** Extract into `src/learning/ull/universal-learning-protocol.ts` with a clean interface. reasoning-engine.ts calls it as a dependency. Other modules (Background processor, STM) can also call it independently.

---

### GAP-014: Background Processor Is a 7-Line Stub

**Severity:** HIGH  
**Repo:** alive-mind  
**Current state:** `src/memory/uc/background-processor.ts` — 7 lines of code with a `// TODO: filtering, pattern detection` comment. Completely unimplemented.  
**What's needed:** Real implementation with: pattern detection over recent Episodes, low-priority ULL-style probing, pre-attentive signal screening before STM admission. ULL primitive (GAP-013) must exist first.

---

### GAP-015: STM Has No ULL Integration Hooks

**Severity:** HIGH  
**Repo:** alive-mind  
**Current state:** After STM is refactored to Episode-based (GAP-009), it still needs ULL integration hooks — events that fire when a new Episode is pushed, allowing the ULL to begin pattern matching.  
**What's needed:** After GAP-009 and GAP-013, add `onPush` hooks to STM that the ULL primitive can subscribe to.

---

### GAP-016: Learning System Spec Is Empty

**Severity:** MEDIUM  
**Repo:** alive-mind  
**Current state:** `docs/specs/learning-system.md` contains: "scaffold only / no doctrine finalized here". This makes it impossible for anyone to know what the learning system is supposed to do.  
**What's needed:** Write actual doctrine covering: what ULL is, when it fires, what it produces, how it relates to LTG, what the STM→Background→LTM promotion path looks like.

---

## PRIORITY 4 — Observability and Test Gaps

---

### GAP-017: Interface Event System Is Log-Scraping

**Severity:** HIGH  
**Repo:** alive-interface  
**Current state:** RuntimeClient parses console.log output with regex to determine what the pipeline did. This will silently break on any log format change.  
**What's needed:** Replace `routeThroughPipeline()` with a proper subscription to the relay EventEmitter (GAP-004). Requires relay.ts to exist first.

---

### GAP-018: Hardening Tests Not Automated

**Severity:** HIGH  
**Repo:** alive-runtime + alive-body  
**Current state:** `alive-constitution/docs/HARDENING_PLAN.md` defines 10 adversarial tests (TEST-001 through TEST-010) plus meta-tests. These appear to be design documents, not automated tests. The existing test files in `alive-runtime/tests/` exist but their coverage of the hardening plan is unknown.  
**What's needed:** Implement all 10 tests as automated Jest/test suite entries. They are well-specified enough to implement directly.

---

### GAP-019: Flag System Not Wired Into Canonical Pipeline

**Severity:** MEDIUM  
**Repo:** alive-runtime  
**Current state:** The flag system (flag-store, flag-emitter, quorum-accumulator) is wired into slice1-cycle.ts and slice2-demo.ts but not into the canonical `pipeline.ts`.  
**What's needed:** Add flag emission points to pipeline.ts: at firewall block, CB anomaly, STG defer, executive veto. This is a small wiring change.

---

### GAP-020: Backbone Freeze Check Not in CI

**Severity:** MEDIUM  
**Repo:** alive-interface  
**Current state:** `scripts/backbone-freeze-check.mjs` exists and works as a manual check. Not wired into any automated gate.  
**What's needed:** Add `npm run check:backbone` to PR/CI pipeline. This prevents backbone violations from being silently introduced.

---

## PRIORITY 5 — Clean-Up Gaps

---

### GAP-021: SystemMode Naming Collision in Constitution

**Severity:** HIGH  
**Repo:** alive-constitution  
**Current state:** Two different types named `SystemMode`:
- `contracts/state.ts`: `'idle' | 'active' | 'alert' | 'emergency'`
- `contracts/system-mode.ts`: `'NORMAL' | 'LOCKDOWN'`  
**What's needed:** Rename one. Suggested: rename `system-mode.ts` type to `LockdownMode`. Update all imports.  
**Effort:** ~1 hour. High value / low cost.

---

### GAP-022: Compiled Build Artifacts in Constitution Source

**Severity:** MEDIUM  
**Repo:** alive-constitution  
**Current state:** `.js`, `.js.map`, `.d.ts`, `.d.ts.map` files committed alongside TypeScript source in `contracts/`, `identity/`, `invariants/`, `policy/`.  
**What's needed:** Add these extensions to `.gitignore`. Clean them from tracking.

---

### GAP-023: Python Files in alive-body

**Severity:** LOW  
**Repo:** alive-body  
**Current state:** `src/actuators/executor.py` and `src/autonomic/autonomic_layer.py` — dead artifacts from an earlier prototype phase.  
**What's needed:** Delete or move to `archive/python-prototypes/`.

---

### GAP-024: Duplicate Experience Stream Concept

**Severity:** MEDIUM  
**Repo:** alive-body + alive-mind  
**Current state:** Two experience-stream files:
- `alive-body/src/logging/experience-stream.ts` — appends raw signal events
- `alive-mind/src/memory/experience-stream.ts` — appends cognitive/action events  
**What's needed:** Make the distinction explicit. Body's version tracks what signals entered the system. Mind's version tracks what cognition produced. Rename to remove the collision: consider `signal-event-log.ts` (body) vs `cognitive-experience-stream.ts` (mind).

---

### GAP-025: studio/ Structure Unclear in alive-interface

**Severity:** MEDIUM  
**Repo:** alive-interface  
**Current state:** Root-level `packages/`, `plugins/`, `theia-app/` AND a `studio/` subfolder with its own `packages/`, `plugins/`, `theia-app/`. Unclear which is canonical.  
**What's needed:** Determine which structure is being actively built. Archive the other.

---

### GAP-026: Placeholder Spec Files Look Authoritative

**Severity:** LOW  
**Repo:** alive-mind  
**Current state:** `docs/specs/learning-system.md` and `docs/specs/asm.md` are "scaffold only" with no content but live in the same directory as real docs.  
**What's needed:** Either fill them (addresses GAP-016) or rename with `_PLACEHOLDER` suffix to signal they are not yet doctrine.

---

## Gap Summary by Repo

| Repo | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| alive-constitution | 0 | 1 (GAP-021) | 2 (GAP-010, GAP-022) | 0 | 3 |
| alive-runtime | 2 (GAP-001, GAP-002, GAP-003) | 3 (GAP-004, GAP-005, GAP-006, GAP-007) | 1 (GAP-019) | 0 | 7+ |
| alive-body | 0 | 0 | 1 (GAP-024) | 1 (GAP-023) | 2 |
| alive-interface | 0 | 1 (GAP-017) | 2 (GAP-020, GAP-025) | 0 | 3 |
| alive-mind | 0 | 4 (GAP-008, GAP-009, GAP-013, GAP-014, GAP-015) | 2 (GAP-011, GAP-016) | 1 (GAP-026) | 7+ |
| alive-runtime (tests) | 0 | 1 (GAP-018) | 0 | 0 | 1 |
| **Totals** | **5** | **10+** | **8+** | **2** | **26** |

---

## Build Order (Dependency Chain)

Some gaps must be resolved before others can be started:

```
GAP-021 (SystemMode)     → no dependency, do first
GAP-001 (dual STG)       → no dependency, do first (archive main.ts)
GAP-002 (competing entry)→ no dependency, do first (archive artifacts)
GAP-023 (Python files)   → no dependency, do first

GAP-010 (memory shell contracts) → needed before GAP-008, GAP-009
GAP-009 (STM→Episode)    → needs GAP-010
GAP-008 (Present shell)  → needs GAP-010
GAP-003 (CRG)            → needs STG frozen (GAP-001 resolved)
GAP-004 (relay)          → needs CRG (GAP-003)
GAP-005 (event system)   → needs relay (GAP-004)
GAP-017 (interface events)→ needs relay (GAP-004, GAP-005)
GAP-013 (ULL primitive)  → needs STM refactored (GAP-009)
GAP-014 (Background)     → needs ULL primitive (GAP-013)
GAP-015 (STM ULL hooks)  → needs both GAP-009 and GAP-013
GAP-019 (flags in pipeline) → can do anytime after GAP-001
GAP-018 (hardening tests)→ can start after GAP-001/002
GAP-020 (CI gate)        → can do anytime
```
