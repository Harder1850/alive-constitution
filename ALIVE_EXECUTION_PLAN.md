# ALIVE Execution Plan

**Generated:** 2026-04-15  
**Part of:** ALIVE Audit and Stabilization Plan  
**Target:** Canonical runtime front-end + canonical memory shells + ULL-backed Short-Term + ULL-backed Background

---

## Phase Overview

| Phase | Name | Duration | Goal |
|---|---|---|---|
| 1 | Lock and Freeze | Days 1–3 | Stop drift. Establish what is canonical. |
| 2 | Build First | Days 4–10 | Fill critical control path and memory shell gaps. |
| 3 | Parallel Tracks | Days 11–21 | ULL integration, observability, hardening. |
| 4 | Wait List | After Phase 3 | Extended systems — after spine is stable. |

---

## Phase 1: Lock and Freeze (Days 1–3)

**Goal:** No more ambiguity about what is canonical. Remove or relocate everything that competes with or confuses the canonical path.

**Rule for this phase:** Do not build new features. Move files. Write headers. Update gitignore. Resolve collisions.

---

### Phase 1 — Task 1.1: Resolve SystemMode Naming Collision

**Repo:** alive-constitution  
**File:** `contracts/system-mode.ts`  
**Action:** Rename the exported type `SystemMode` to `LockdownMode` (or `OperationalMode`). Update any imports in alive-runtime or alive-mind that reference this type.  
**Why:** Two types named `SystemMode` in the same contracts layer is a silent drift hazard.  
**Effort:** 1–2 hours  
**Deliverable:** Zero TypeScript files defining `SystemMode` as `'NORMAL' | 'LOCKDOWN'`. Single canonical definition remains in `contracts/state.ts`.  
**Gap closed:** GAP-021

---

### Phase 1 — Task 1.2: Archive alive-runtime Drift Artifacts

**Repo:** alive-runtime  
**Files:**
- `src/main.ts` → `proving/main-v12-autonomous-command-center.ts`
- `src/wiring/slice1-cycle.ts` → `proving/slice1-cycle.ts`
- `src/wiring/slice2-demo.ts` → `proving/slice2-demo.ts`
- `src/wiring/slice3-demo.ts` → `proving/slice3-demo.ts`
- `src/phase1/` (entire folder) → `proving/phase1/`

**Action:** Create `proving/` folder. Move files. Update `package.json` scripts to remove any references to the moved files as primary entry points. Add `ARCHIVED — NOT PRODUCTION` header to each moved file.  
**Why:** main.ts has an inline STG that conflicts with the canonical one. The slice*-cycle files look like production runners but are test harnesses.  
**Effort:** 2–3 hours  
**Deliverable:** `src/wiring/pipeline.ts` is the unambiguous sole entry point for signal processing. No competing entry point files remain in active source directories.  
**Gaps closed:** GAP-001, GAP-002, GAP-007

---

### Phase 1 — Task 1.3: Freeze Canonical Files

**Repos:** alive-runtime, alive-body, alive-constitution  
**Files:**
- `alive-runtime/src/wiring/pipeline.ts` — add `CANONICAL ENTRY POINT — FROZEN` header
- `alive-runtime/src/stg/stop-thinking-gate.ts` — add `CANONICAL STG — FROZEN` header
- `alive-body/src/actuators/executor.ts` — add `CANONICAL EXECUTOR — FROZEN` header
- `alive-constitution/contracts/signal.ts` — already marked LOCKED, verify header
- `alive-constitution/contracts/memory.ts` — already marked LOCKED, verify header
- `alive-constitution/contracts/decision.ts` — add FROZEN confirmation

**Action:** Add clear header comments. Create `alive-runtime/src/wiring/README.md` stating pipeline.ts is the canonical entry point.  
**Effort:** 1 hour  
**Deliverable:** Any developer opening these files immediately sees they are frozen canonical modules.

---

### Phase 1 — Task 1.4: Clean Build Artifacts from Constitution

**Repo:** alive-constitution  
**Files:** All `.js`, `.js.map`, `.d.ts`, `.d.ts.map` in `contracts/`, `identity/`, `invariants/`, `policy/`  
**Action:** Add patterns to `.gitignore`. Run `git rm --cached` to stop tracking them. Do not delete them physically (TypeScript compilation will recreate as needed).  
**Effort:** 30 minutes  
**Deliverable:** Source directories contain only `.ts` files.  
**Gap closed:** GAP-022

---

### Phase 1 — Task 1.5: Delete Python Artifacts from alive-body

**Repo:** alive-body  
**Files:** `src/actuators/executor.py`, `src/autonomic/autonomic_layer.py`  
**Action:** Move to `archive/python-prototypes/` or delete entirely (they are not used).  
**Effort:** 15 minutes  
**Gap closed:** GAP-023

---

### Phase 1 — Deliverables Checklist

- [ ] Single `SystemMode` type in alive-constitution
- [ ] `src/main.ts` no longer in active source
- [ ] `src/wiring/pipeline.ts` has CANONICAL header
- [ ] `src/stg/stop-thinking-gate.ts` has FROZEN header
- [ ] `proving/` folder created with moved artifacts
- [ ] alive-constitution `.gitignore` excludes build artifacts
- [ ] Python files removed from alive-body
- [ ] `src/wiring/README.md` created

**Phase 1 dependency note:** Phase 2 can begin as soon as Task 1.1 (SystemMode) and Task 1.2 (archive main.ts) are done. The other Phase 1 tasks can be done in parallel.

---

## Phase 2: Build First (Days 4–10)

**Goal:** Create the missing control path components and establish canonical memory shell contracts.

**Rule for this phase:** Minimal viable implementations only. Get the boundary right first. Flesh out later.

---

### Phase 2 — Task 2.1: Create CRG Module

**Repo:** alive-runtime  
**Files to create:**
- `src/crg/crg-types.ts` — `CRGState`, `CRGBudget`, `ResourceSnapshot` types
- `src/crg/cognitive-resource-governor.ts` — main CRG implementation
- `src/crg/index.ts` — public export

**What the CRG does:**
- Reads current resource state (CPU load, battery, memory pressure, queue depth)
- Computes a `STGContext` object with `triagePriority`, `batteryPct`, `cpuRisk`
- Provides `getContext()` method consumed by `pipeline.ts` before each STG call
- Optionally maintains a rolling budget window

**Dependencies:** Phase 1 complete (main.ts archived, no competing CRG-like logic)  
**Integration point:** `pipeline.ts` calls `crg.getContext()` to build the `STGContext` passed to `evaluateSTG()`  
**Effort:** 2–3 days  
**Gap closed:** GAP-003

---

### Phase 2 — Task 2.2: Create Relay Module

**Repo:** alive-runtime  
**File to create:** `src/wiring/relay.ts`

**What the relay does:**
- Wraps `runPipeline()` from pipeline.ts
- Exposes an `EventEmitter` (or equivalent) on which typed `RuntimeEvent` objects are emitted at each stage
- Consumers (alive-interface, tests, observers) subscribe to the emitter
- Does NOT add any logic — purely a structural boundary with observable outputs

**Event types to emit:**
```
signal.received → after ingestion
firewall.checked → after firewall (cleared or blocked)
stg.evaluated → after STG (OPEN/DEFER/DENY)
mind.started → before cognition
mind.completed → after cognition
admissibility.checked → after admissibility
execution.completed → after body execution
pipeline.terminated → whenever cycle ends without full completion
```

**Dependencies:** CRG (Task 2.1), Phase 1 complete  
**Integration point:** alive-interface RuntimeClient subscribes to relay emitter (Phase 3 Track B)  
**Effort:** 1 day  
**Gap closed:** GAP-004, GAP-005

---

### Phase 2 — Task 2.3: Add Memory Shell Contracts to Constitution

**Repo:** alive-constitution  
**File to create:** `contracts/memory-shells.ts`

**What to define:**
```typescript
interface PresentShell {
  setActive(signal: Signal, context: string[]): void;
  getActive(): { signal: Signal; context: string[] } | null;
  clear(): void;
}

interface ShortTermShell {
  push(episode: Episode): void;
  recent(n: number): Episode[];
  search(pattern: string): Episode[];
  size(): number;
  clear(): void;
}

interface BackgroundShell {
  ingest(episode: Episode): void;
  getPatterns(): Pattern[];
  isIdle(): boolean;
}

interface DurableShell {
  write(entry: LTMEntry): void;
  read(id: string): LTMEntry | undefined;
  search(query: string, limit?: number): LTMEntry[];
  topByMVI(n?: number): LTMEntry[];
}
```

**Dependencies:** None (pure types)  
**Effort:** Half day  
**Gap closed:** GAP-010, GAP-012

---

### Phase 2 — Task 2.4: Create Present Shell

**Repo:** alive-mind  
**File to create:** `src/memory/present/present-shell.ts`

**What it does:**
- Holds the currently active signal and its working context string array
- Cleared at the start of each cognitive cycle, set when STG opens a cycle
- Satisfies the `PresentShell` interface from contracts/memory-shells.ts
- Implementation: single mutable slot, no history

**Dependencies:** Task 2.3 (contracts)  
**Effort:** Half day  
**Gap closed:** GAP-008

---

### Phase 2 — Task 2.5: Refactor STM to Episode-Based

**Repo:** alive-mind  
**File to modify:** `src/memory/stm/short-term-memory.ts`

**What changes:**
- Change `entries: Signal[]` to `entries: Episode[]`
- Update `push(signal: Signal)` to `push(episode: Episode)`
- Update `getAll()`, `recent()`, `search()` return types
- Add `onPush` hook stubs (empty callbacks that ULL will wire in Phase 3)
- Satisfy the `ShortTermShell` interface from contracts/memory-shells.ts

**Compatibility:** The old Signal-based API had external callers. Check and update those callers (likely episode-store.ts or slice cycles). After archiving the slice cycles in Phase 1, the main caller should be pipeline.ts via mind-bridge.ts.  
**Dependencies:** Task 2.3 (contracts)  
**Effort:** 1 day  
**Gap closed:** GAP-009

---

### Phase 2 — Task 2.6: Wire Flag System into pipeline.ts

**Repo:** alive-runtime  
**File to modify:** `src/wiring/pipeline.ts`

**What to add:**
- Import `flagEmitter` and `flagStore` from `src/flags/`
- At firewall block → `flagEmitter.onFirewallBlock(signal)`
- At CB anomaly (zScore > threshold) → `flagEmitter.onCBAnomaly(signal, zScore)`
- At STG DEFER (3rd consecutive) → `flagEmitter.onRepeatedDeferral(signal, count)`
- At executive VETO → `flagEmitter.onConstitutionalViolation(signal, reason)`
- At end of cycle → `flagStore.tick()`

**Why now:** This is low-risk, doesn't require new modules, and makes the canonical pipeline behaviorally equivalent to what was tested in the slice demos.  
**Dependencies:** Phase 1 complete  
**Effort:** Half day  
**Gap closed:** GAP-019

---

### Phase 2 — Deliverables Checklist

- [ ] `src/crg/cognitive-resource-governor.ts` implemented and wired into pipeline
- [ ] `src/wiring/relay.ts` implemented and emitting typed events
- [ ] `alive-constitution/contracts/memory-shells.ts` created
- [ ] `alive-mind/src/memory/present/present-shell.ts` created
- [ ] `alive-mind/src/memory/stm/short-term-memory.ts` uses Episode contract
- [ ] Flag system wired into pipeline.ts

---

## Phase 3: Parallel Tracks (Days 11–21)

**Goal:** ULL integration, interface event system reliability, and hardening test automation.

Three tracks that can proceed simultaneously after Phase 2 completes.

---

### Track A — ULL Integration (alive-mind) — Days 11–18

**Owner:** alive-mind  
**Dependency:** Phase 2 complete

**Track A Step 1 — Extract ULL Primitive (Days 11–13)**

**File to create:** `src/learning/ull/universal-learning-protocol.ts`

Extract from `src/decisions/reasoning-engine.ts`:
- `abstractToStructural(content: string): string`
- `crossDomainSearch(abstractedContent: string): string`
- `universalProbe(description: string, tag: string): DisplayTextAction`

Expose as:
```typescript
export interface ULLResult {
  type: 'probe' | 'cross_domain' | 'analogy';
  action: DisplayTextAction;
  insight: string;
  tag: string;
}

export function runULP(input: string, tag: string): ULLResult
```

`reasoning-engine.ts` imports from this module for its Tier 3 path. No behavior change — pure extraction.  
**Gap closed:** GAP-013

**Track A Step 2 — Wire ULL into STM (Days 13–14)**

Modify `src/memory/stm/short-term-memory.ts`:
- Activate the `onPush` hooks added in Phase 2
- Wire to `runULP()` from the ULL primitive
- On every push: if episode confidence < threshold, asynchronously run ULP in background
- Store ULP result as annotation on the episode (or log to background channel)

**Gap closed:** GAP-015

**Track A Step 3 — Rebuild Background Processor (Days 14–18)**

**File to rebuild:** `src/memory/uc/background-processor.ts`

New implementation:
```typescript
export class BackgroundProcessor {
  ingest(episode: Episode): void   // called when STM receives new episode
  runCycle(): PatternResult[]       // called periodically (or when STM is idle)
  getPatterns(): PatternResult[]    // current detected patterns
  isIdle(): boolean                  // whether a cycle is running
}
```

Implementation:
- Maintains a short sliding window of recent Episodes
- Runs `runULP()` on patterns within the window
- Compares new episodes against existing patterns for recurrence detection
- Low-priority: yields to STG-gated cycles

**Gap closed:** GAP-014

**Track A Step 4 — Write Learning System Doctrine (Days 18)**

Fill `docs/specs/learning-system.md` with:
- What ULL is and what it is not
- When ULP fires (Tier 3 reasoning, STM push hook, background cycle)
- What ULL produces (probe actions, cross-domain insights)
- How ULL relates to LTG (ULL generates candidates; LTG decides promotion)
- The STM→Background→LTM promotion path

**Gap closed:** GAP-016

---

### Track B — Interface Event System (alive-interface) — Days 11–16

**Owner:** alive-interface  
**Dependency:** Phase 2 relay.ts must exist and emit events

**Track B Step 1 — Replace Log-Scraping in RuntimeClient (Days 11–13)**

**File to rewrite:** `packages/runtime-client/src/index.ts`

Replace `routeThroughPipeline()` which patches console.log with:
```typescript
private subscribeToRelay(): void {
  // Import relay module from alive-runtime
  const { relay } = require('../../../../alive-runtime/src/wiring/relay');
  
  relay.on('pipeline.event', (event: RuntimeEvent) => {
    this.emitPipelineEvent(event);
  });
}
```

The relay emits properly typed `RuntimeEvent` objects. No log parsing required.  
**Gap closed:** GAP-017

**Track B Step 2 — Update Plugin Subscriptions (Days 14–15)**

Review each plugin's event subscription to ensure they handle the full set of events emitted by relay.ts (not just the subset matched by regex). Add handlers for any new event types.

**Track B Step 3 — Wire CI Gate (Day 16)**

Add `backbone-freeze-check.mjs` to GitHub Actions or pre-commit hook. Document in repo README.  
**Gap closed:** GAP-020

---

### Track C — Hardening Tests (alive-runtime + alive-body) — Days 11–21

**Owner:** alive-runtime + alive-body (test directories)  
**Dependency:** Phase 1 complete (canonical pipeline frozen and testable)

Implement each test from `alive-constitution/docs/HARDENING_PLAN.md`:

| Test | File | What to implement |
|---|---|---|
| TEST-001 | `tests/stg-deny.test.ts` | STG DENY blocks alive-mind invocation |
| TEST-002 | `tests/firewall-block.test.ts` | Malformed signal blocked before STG |
| TEST-003 | `tests/body-no-mind-import.test.ts` | Static analysis: no alive-body → alive-mind import |
| TEST-004 | `tests/interface-no-bypass.test.ts` | Static analysis: no alive-interface → alive-mind/body |
| TEST-005 | `tests/experience-log-append-only.test.ts` | Log only grows, never shrinks |
| TEST-006 | `tests/stg-deny-no-state-leak.test.ts` | Denial is stateless across cycles |
| TEST-007 | `tests/execution-requires-runtime.test.ts` | No direct Decision → executor path |
| TEST-008 | `tests/empty-input-graceful.test.ts` | Empty/whitespace input handled |
| TEST-009 | `tests/oversized-input-rejected.test.ts` | 1MB input blocked or truncated |
| TEST-010 | `tests/rapid-input-log-integrity.test.ts` | 10 rapid inputs all logged correctly |

**Effort:** 2–3 days for core tests  
**Gap closed:** GAP-018

---

### Phase 3 — Deliverables Checklist

- [ ] `src/learning/ull/universal-learning-protocol.ts` extracted and clean
- [ ] STM `onPush` hooks wired to ULL primitive
- [ ] Background processor implemented (pattern detection + ULL)
- [ ] Learning system doctrine written
- [ ] RuntimeClient no longer uses log-scraping
- [ ] All 5 interface plugins subscribe to real relay events
- [ ] backbone-freeze-check in CI
- [ ] TEST-001 through TEST-010 implemented and passing

---

## Phase 4: What Should Wait

Do not start these until Phase 1–3 are complete and the spine is verified stable.

| Item | Reason to wait | When to revisit |
|---|---|---|
| WebSocket bridge for distributed runtime | Premature until relay.ts is solid | After Phase 3 |
| Trace database persistence | Not needed for core functionality | After Phase 3 |
| Full Theia IDE integration | Complex, not blocking | After Phase 3 |
| Performance profiler plugin | Extended observability | After Phase 3 |
| Memory inspector plugin | Needs stable memory shells first | After Phase 3 |
| Decision explainability plugin | Requires stable cognition loop first | After Phase 3 |
| Contradiction accumulation in LTG | Slice 4 work — explicitly deferred in code | After Phase 3 |
| Peer node knowledge validation | Distributed future | Long-term |
| Prediction / self-observer | Extended cognition systems | Long-term |
| Idle processor | Requires stable scheduler first | After Phase 3 |
| Captain's Log / terrain heartbeat | Interesting, but must be proper observers not baked into main loop | After Phase 3, as proper plugin |
| Multi-user collaboration | Far future | Long-term |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| signal-router.ts callers break when archived | Medium | Medium | Check all imports of signal-router before archiving; route through pipeline.ts |
| STM refactor breaks existing callers | Medium | High | Map all call sites before refactoring; update atomically |
| Relay module creates circular imports | Low | High | Keep relay as a thin wrapper; never import from interface layer |
| ULL extraction breaks reasoning-engine Tier 3 | Low | Medium | Extract by copy-then-replace; verify reasoning-engine tests pass after |
| Background processor performance impact | Medium | Medium | Start with async/deferred execution; benchmark before integrating with STM hooks |
| Interface relay subscription requires runtime to be in-process | Medium | Medium | Design relay to support both in-process EventEmitter and future WebSocket |

---

## Success Criteria

**Phase 1 complete when:**
- `npm run build` succeeds in alive-runtime with main.ts absent from src/
- No TypeScript errors from SystemMode collision
- `src/wiring/README.md` exists

**Phase 2 complete when:**
- `alive-runtime/src/crg/cognitive-resource-governor.ts` exports `getContext(): STGContext`
- `alive-runtime/src/wiring/relay.ts` emits at least 6 typed RuntimeEvents per cycle
- `alive-constitution/contracts/memory-shells.ts` exports 4 shell interfaces
- `alive-mind/src/memory/stm/short-term-memory.ts` stores Episode not Signal
- `alive-mind/src/memory/present/present-shell.ts` exports `PresentShell`

**Phase 3 complete when:**
- `alive-mind/src/learning/ull/universal-learning-protocol.ts` exports `runULP()`
- `alive-mind/src/memory/uc/background-processor.ts` is more than 7 lines
- `alive-interface` RuntimeClient does not contain `console.log = ` anywhere
- All 10 hardening tests pass
- `npm run check:backbone` runs in CI
