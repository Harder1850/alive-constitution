# ALIVE File-Level Action List

**Generated:** 2026-04-15  
**Part of:** ALIVE Audit and Stabilization Plan  
**Purpose:** Concrete per-file/folder actions across all five repos

---

## How to Read This Document

Actions are listed per repo. For each item:
- **Action:** KEEP / FREEZE / ARCHIVE / DELETE / REFACTOR / CREATE / INSPECT / CLARIFY
- **Priority:** P1 (do now), P2 (this week), P3 (next week), P4 (after Phase 3)
- **Reason:** Brief justification

**ARCHIVE** = move to `proving/` or `archive/` subfolder within the repo. Do not delete — preserve as reference.  
**DELETE** = safe to remove (confirmed dead artifacts).  
**FREEZE** = add canonical/frozen header comment; require formal review for any future changes.  
**CREATE** = new file that needs to be built.

---

## alive-constitution

### Keep

| File/Folder | Priority | Notes |
|---|---|---|
| `contracts/signal.ts` | P1 | FREEZE — already LOCKED v16 §31.3 |
| `contracts/memory.ts` | P1 | FREEZE — already LOCKED Slice 3 |
| `contracts/state.ts` | P1 | FREEZE — canonical SystemMode lives here |
| `contracts/action.ts` | P1 | FREEZE — clean, locked |
| `contracts/decision.ts` | P1 | FREEZE — integrity hash mechanism |
| `contracts/authorized-action.ts` | P1 | FREEZE — token model |
| `contracts/flag.ts` | P1 | FREEZE — used by runtime flag system |
| `contracts/admissibility.ts` | P2 | KEEP — policy contract |
| `contracts/intent.ts` | P2 | KEEP — verify usage, settle status |
| `contracts/memory-entry.ts` | P3 | KEEP — older, verify still used |
| `contracts/perception.ts` | P3 | KEEP — verify still used |
| `contracts/relationship.ts` | P3 | KEEP — verify still used |
| `contracts/story.ts` | P3 | KEEP — verify still used |
| `contracts/symbol.ts` | P3 | KEEP — verify still used |
| `contracts/transition.ts` | P3 | KEEP — verify still used |
| `invariants/action-bounds.ts` | P1 | KEEP — constitutional bounds |
| `invariants/emergency-bounds.ts` | P1 | KEEP — emergency invariants |
| `invariants/memory-bounds.ts` | P1 | KEEP — memory invariants |
| `invariants/system-invariants.ts` | P1 | KEEP — core invariants |
| `identity/continuity.ts` | P1 | KEEP — identity continuity |
| `identity/identity-spine.ts` | P1 | KEEP — identity spine |
| `identity/protected-self.ts` | P1 | KEEP — protected self rules |
| `policy/admissibility.ts` | P1 | KEEP — admissibility policy |
| `policy/authorization.ts` | P1 | KEEP — authorization policy |
| `policy/validation.ts` | P1 | KEEP — validation policy |
| `policy/escalation.ts` | P2 | KEEP — escalation rules |
| `amendments/0001-initial.md` | P1 | KEEP — amendment log |
| `amendments/AMENDMENT-TEMPLATE.md` | P1 | KEEP — amendment process |
| `docs/ARCHITECTURE.md` | P1 | KEEP — clean, correct |
| `docs/HARDENING_PLAN.md` | P1 | KEEP + use as test target |
| `docs/BOUNDARY_RULES.md` | P1 | KEEP — boundary authority |
| `docs/AUTHORITY.md` | P1 | KEEP |
| `docs/AMENDMENT_POLICY.md` | P1 | KEEP |

### Patch/Refactor

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `contracts/system-mode.ts` | P1 | **RENAME TYPE** | Rename `SystemMode` → `LockdownMode`. Fixes naming collision with state.ts. Also update all imports across all repos. |
| `contracts/intent-thread.ts` | P2 | **REVIEW + SETTLE** | Newer contract, not fully settled. Either lock it or mark as experimental. |
| `contracts/incident-record.ts` | P2 | **REVIEW + SETTLE** | Same as above. |

### Delete (Build Artifacts)

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `contracts/*.js` | P1 | **DELETE + GITIGNORE** | Build artifacts committed to source |
| `contracts/*.js.map` | P1 | **DELETE + GITIGNORE** | Build artifacts |
| `contracts/*.d.ts` | P1 | **DELETE + GITIGNORE** | Build artifacts |
| `contracts/*.d.ts.map` | P1 | **DELETE + GITIGNORE** | Build artifacts |
| `identity/*.js`, `*.js.map` | P1 | **DELETE + GITIGNORE** | Same issue in identity/ |
| `invariants/*.js`, `*.js.map` | P1 | **DELETE + GITIGNORE** | Same issue in invariants/ |

### Create

| File/Folder | Priority | Notes |
|---|---|---|
| `contracts/memory-shells.ts` | P2 | Present, ShortTerm, Background, Durable shell interfaces |
| `contracts/relay-envelope.ts` | P2 | RuntimeEvent types for relay subscription |
| `contracts/crg.ts` | P2 | CRGState, CRGBudget, ResourceSnapshot types |

---

## alive-runtime

### Keep + Freeze

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/wiring/pipeline.ts` | P1 | **FREEZE** | Add `CANONICAL ENTRY POINT — FROZEN` header |
| `src/stg/stop-thinking-gate.ts` | P1 | **FREEZE** | Add `CANONICAL STG — FROZEN` header |
| `src/enforcement/executive.ts` | P1 | **KEEP** | Constitution+mission loader |
| `src/enforcement/global-gate.ts` | P1 | **KEEP** | Token issuance gate |
| `src/enforcement/lockdown-triggers.ts` | P1 | **KEEP** | Auto-lockdown triggers |
| `src/enforcement/admissibility-check.ts` | P1 | **KEEP** | CAG — name it explicitly as CAG |
| `src/wiring/mind-bridge.ts` | P1 | **KEEP** | Clean public surface bridge |
| `src/wiring/body-bridge.ts` | P1 | **KEEP** | Gate-enforced body bridge |
| `src/wiring/constitution-loader.ts` | P1 | **KEEP** | Read-only constitution load |
| `enforcement/reflex-router.ts` | P1 | **KEEP** | Threat fast-path |
| `src/triage/triage-service.ts` | P1 | **KEEP** | Signal triage |
| `src/flags/flag-store.ts` | P1 | **KEEP** | Flag persistence |
| `src/flags/flag-emitter.ts` | P1 | **KEEP** | Flag emission |
| `src/flags/quorum-accumulator.ts` | P1 | **KEEP** | Quorum logic |
| `src/lifecycle/` | P1 | **KEEP** | startup, shutdown, idle, recovery |
| `src/modes/` | P2 | **KEEP + VERIFY WIRING** | Mode definitions — confirm wired into pipeline |
| `src/scheduler/` | P2 | **KEEP** | Priority queue, job runner, exploration |
| `src/comparison-baseline/` | P1 | **KEEP** | CB service used in pipeline |
| `src/router/memory-router.ts` | P2 | **KEEP** | Memory routing |
| `src/router/action-router.ts` | P2 | **KEEP** | Action routing |
| `src/calibration/` | P2 | **KEEP + VERIFY WIRING** | Calibration — confirm it's connected |

### Archive (Drift and Proving Artifacts)

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/main.ts` | P1 | **ARCHIVE** → `proving/main-v12-autonomous-command-center.ts` | Inline STG, backbone violations, competing loop |
| `src/wiring/slice1-cycle.ts` | P1 | **ARCHIVE** → `proving/slice1-cycle.ts` | Proving harness — 10-exit-criteria trace |
| `src/wiring/slice2-demo.ts` | P1 | **ARCHIVE** → `proving/slice2-demo.ts` | Demo runner |
| `src/wiring/slice3-demo.ts` | P1 | **ARCHIVE** → `proving/slice3-demo.ts` | Demo runner |
| `src/phase1/` (entire folder) | P1 | **ARCHIVE** → `proving/phase1/` | Proving artifact cluster |

### Inspect + Decide

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/router/signal-router.ts` | P1 | **INSPECT THEN DECIDE** | Uses stale STG API (no context). Either update to STGContext or archive. Determine if any callers use this vs pipeline.ts. |
| `src/cycle.ts` | P2 | **INSPECT** | Unknown purpose. If superseded by pipeline.ts, archive. |
| `src/wiring/start-bridge.ts` | P2 | **INSPECT** | Unknown purpose. Determine if needed or stale. |
| `src/stg/stg-policy.ts` | P2 | **INSPECT** | May be redundant with stop-thinking-gate.ts. Determine if it adds anything canonical. |

### Patch

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/wiring/pipeline.ts` | P2 | **PATCH** | Wire in flag emission points (flagEmitter calls at firewall block, CB anomaly, STG defer, executive veto) |
| `package.json` | P1 | **UPDATE** | Remove any scripts pointing to main.ts, slice*-cycle.ts as primary entry points |

### Create

| File/Folder | Priority | Notes |
|---|---|---|
| `src/crg/crg-types.ts` | P2 | CRGState, CRGBudget, ResourceSnapshot types |
| `src/crg/cognitive-resource-governor.ts` | P2 | CRG implementation — reads resources, produces STGContext |
| `src/crg/index.ts` | P2 | Public export surface |
| `src/wiring/relay.ts` | P2 | Explicit relay — wraps pipeline, emits typed RuntimeEvents via EventEmitter |
| `src/wiring/README.md` | P1 | Documents pipeline.ts as canonical entry point |
| `tests/stg-deny.test.ts` | P3 | Hardening TEST-001 |
| `tests/firewall-block.test.ts` | P3 | Hardening TEST-002 |
| `tests/body-no-mind-import.test.ts` | P3 | Hardening TEST-003 (static analysis) |
| `tests/stg-deny-no-state-leak.test.ts` | P3 | Hardening TEST-006 |
| `tests/execution-requires-runtime.test.ts` | P3 | Hardening TEST-007 |
| `tests/empty-input-graceful.test.ts` | P3 | Hardening TEST-008 |
| `tests/oversized-input-rejected.test.ts` | P3 | Hardening TEST-009 |
| `tests/rapid-input-log-integrity.test.ts` | P3 | Hardening TEST-010 |

---

## alive-body

### Keep + Freeze

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/actuators/executor.ts` | P1 | **FREEZE** | Add `CANONICAL EXECUTOR — FROZEN` header |
| `src/nervous-system/firewall.ts` | P1 | **KEEP** | Critical entry gate |
| `src/sensors/ingestion.ts` | P1 | **KEEP** | Signal ingestion entry |
| `src/sensors/filtering.ts` | P1 | **KEEP** | Pre-firewall filter |
| `src/logging/execution-log.ts` | P1 | **KEEP** | Append-only execution log |
| `src/nervous-system/` | P1 | **KEEP** | Safety systems: emergency-stop, safe-mode, interrupt-manager, event-bus |
| `src/adapters/` | P1 | **KEEP** | CPU, disk, filesystem adapters |
| `src/autonomic/*.ts` | P2 | **KEEP** | Health monitoring (TypeScript files only) |
| `src/tools/` | P2 | **KEEP** | captains-log, file-manager, notifier |
| `src/sensors/environment.ts` | P2 | **KEEP** | Weather/battery/CPU/disk sensors |

### Delete

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/actuators/executor.py` | P1 | **DELETE** | Dead Python prototype. Not imported anywhere. |
| `src/autonomic/autonomic_layer.py` | P1 | **DELETE** | Dead Python prototype. Not imported anywhere. |

### Clarify

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/logging/experience-stream.ts` | P2 | **RENAME + CLARIFY** | Rename to `signal-event-log.ts` to distinguish from alive-mind's cognitive experience stream. Purpose: logs raw signal entry/exit events, not cognitive outcomes. |

---

## alive-interface

### Keep

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `packages/shared-types/src/events.ts` | P1 | **KEEP** | RuntimeEvent types are correct |
| `packages/shared-types/src/index.ts` | P1 | **KEEP** | Public types export |
| `plugins/alive-launcher/` | P2 | **KEEP** | Start/stop plugin — correct scope |
| `plugins/alive-trace/` | P2 | **KEEP** | Trace viewer — correct scope |
| `plugins/alive-signals/` | P2 | **KEEP** | Signal injection — correct scope |
| `plugins/alive-state/` | P2 | **KEEP** | State display — correct scope |
| `plugins/alive-logs/` | P2 | **KEEP** | Log viewer — correct scope |
| `theia-app/src/main.ts` | P2 | **KEEP** | Bootstrap and layout |
| `theia-app/index.html` | P2 | **KEEP** | HTML entry |
| `theia-app/server.js` | P2 | **KEEP** | Dev server |
| `docs/backbone-freeze-audit.md` | P1 | **KEEP** | Authoritative import matrix |
| `scripts/backbone-freeze-check.mjs` | P1 | **KEEP + WIRE INTO CI** | Static import checker — must run on every PR |

### Refactor

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `packages/runtime-client/src/index.ts` | P3 | **REWRITE** | Replace log-scraping (`console.log = ` monkey-patch + regex parsing) with real EventEmitter subscription to `alive-runtime/src/wiring/relay.ts`. Requires relay.ts to exist first. |

### Inspect + Clarify

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `studio/` | P2 | **INSPECT** | Appears to duplicate root `packages/`, `plugins/`, `theia-app/`. Determine which is canonical. Archive the other. |
| `src/` (root level) | P2 | **INSPECT** | Purpose unclear vs packages/plugins structure. Determine if this is an older CLI/entry point. |

### Wire into CI

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `scripts/backbone-freeze-check.mjs` | P1 | **ADD TO CI** | Add to GitHub Actions or pre-commit hook. Should run on every PR. |

---

## alive-mind

### Keep + Freeze

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/spine/mind-loop.ts` | P1 | **FREEZE** | Canonical cognition entry — thin, correct |
| `src/spine/state-model.ts` | P1 | **FREEZE** | ASM — canonical cognitive state |
| `src/decisions/synthesize.ts` | P1 | **KEEP** | Core synthesis |
| `src/decisions/llm-teacher.ts` | P2 | **KEEP** | Tier 4 fallback reasoning |
| `src/decisions/rule-store.ts` | P2 | **KEEP** | Rule-based matching |
| `src/decisions/action-generator.ts` | P2 | **KEEP** | Action generation |
| `src/learning/ltg/learning-transfer-gate.ts` | P1 | **KEEP** | 4-condition LTG — working, correct |
| `src/memory/ltm/long-term-memory.ts` | P1 | **KEEP** | JSON-backed LTM with MVI |
| `src/memory/episode-store.ts` | P1 | **KEEP** | STM episode store |
| `src/memory/semantic-graph.ts` | P2 | **KEEP** | LTM semantic graph |
| `src/memory/memory-orchestrator.ts` | P2 | **KEEP + EXPAND** | Not yet authoritative — needs migration completion |
| `src/memory/working-memory.ts` | P2 | **KEEP** | Working memory used by orchestrator |
| `src/memory/reference-store.ts` | P2 | **KEEP** | Reference store |
| `src/memory/thread-store.ts` | P2 | **KEEP** | Thread store |
| `src/memory/outcome-buffer.ts` | P2 | **KEEP** | Outcome buffer |
| `src/memory/recall-engine.ts` | P2 | **KEEP** | Recall engine |
| `src/memory/encoding-engine.ts` | P2 | **KEEP** | Encoding engine |
| `src/memory/derived-memory.ts` | P2 | **KEEP** | Derived memory (verify still primary) |
| `src/public/` | P1 | **KEEP** | Public surface — generate-story, inspect-state, interpret-intent, etc. |
| `src/lockdown/memory-write-guard.ts` | P1 | **KEEP** | Memory write guard — critical |
| `src/cognition/` | P2 | **KEEP** | ARE, CCE, SVE, deliberation, inference, etc. |
| `knowledge/` | P2 | **KEEP** | Seeded knowledge |
| `memory/stories.json` | P2 | **KEEP** | Story knowledge |
| `memory/symbols.json` | P2 | **KEEP** | Symbol knowledge |

### Refactor

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/decisions/reasoning-engine.ts` | P3 | **REFACTOR (extract ULL)** | The Universal Learning Protocol (Tier 3) should be extracted into `src/learning/ull/universal-learning-protocol.ts`. reasoning-engine.ts then imports it. No behavior change. |
| `src/memory/stm/short-term-memory.ts` | P2 | **REFACTOR** | Change from Signal-based to Episode-based. Add `onPush` hook stubs. Satisfy `ShortTermShell` interface. |

### Rebuild

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/memory/uc/background-processor.ts` | P3 | **REBUILD** | 7-line stub. Needs real pattern detection + ULL integration. Requires ULL primitive first. |

### Inspect

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/memory/uc/unconscious-processor.ts` | P2 | **INSPECT** | Not read. Likely similar state to background-processor (stub or minimal). |
| `src/decisions/contradiction-engine.ts` | P3 | **INSPECT** | Slice 4 work. Verify it's not actively wired and causing unexpected behavior. |
| `src/decisions/transition-predictor.ts` | P3 | **INSPECT** | Verify role and wiring status. |
| `src/decisions/value-model.ts` | P3 | **INSPECT** | Verify role and wiring status. |
| `src/decisions/cost-risk-uncertainty.ts` | P3 | **INSPECT** | Verify role and wiring status. |

### Archive

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/spine/phase1-cognition-loop.ts` | P1 | **ARCHIVE** → `proving/phase1-cognition-loop.ts` | Proving artifact living in production spine |

### Clarify

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `src/memory/experience-stream.ts` | P2 | **RENAME + CLARIFY** | Rename to `cognitive-experience-stream.ts` to distinguish from alive-body's signal-event-log.ts. This tracks cognitive outcomes; body's version tracks signal entry. |

### Create

| File/Folder | Priority | Notes |
|---|---|---|
| `src/memory/present/present-shell.ts` | P2 | Present memory shell — immediate working context buffer |
| `src/memory/present/index.ts` | P2 | Export surface |
| `src/learning/ull/universal-learning-protocol.ts` | P3 | Extract from reasoning-engine — abstract/cross-domain/probe primitive |
| `src/learning/ull/index.ts` | P3 | Export surface |
| `src/learning/ull/ull-types.ts` | P3 | ULLResult, ULLConfig types |

### Expand/Fill

| File/Folder | Priority | Action | Notes |
|---|---|---|---|
| `docs/specs/learning-system.md` | P3 | **WRITE DOCTRINE** | Currently "scaffold only". Write actual learning system doctrine. |
| `docs/specs/asm.md` | P3 | **WRITE DOCTRINE** | Currently "scaffold only". Write ASM doctrine (or delete if covered elsewhere). |

---

## Cross-Repo Actions

These actions span multiple repos and should be coordinated:

| Action | Repos | Priority | Notes |
|---|---|---|---|
| Fix SystemMode import references after rename | alive-constitution, alive-runtime, alive-mind | P1 | After renaming `system-mode.ts` type to `LockdownMode` |
| Decide experience-stream ownership | alive-body, alive-mind | P2 | Body owns signal entry log; mind owns cognitive outcome stream. Rename both for clarity. |
| Wire backbone-freeze-check into CI | alive-interface (scripts), all repos | P1 | Should fail build if any backbone violation is introduced |
| Update `package.json` entry points | alive-runtime | P1 | Remove references to main.ts, slice cycles as primary entries |

---

## Quick Wins (< 1 Hour Each)

These are high-value, low-effort items that can be done immediately:

| Item | Repo | Action | Value |
|---|---|---|---|
| Delete executor.py | alive-body | `git rm` | Removes confusion about Python execution path |
| Delete autonomic_layer.py | alive-body | `git rm` | Removes noise |
| Add CANONICAL header to pipeline.ts | alive-runtime | Edit file header | Immediately clear to all developers |
| Add FROZEN header to stop-thinking-gate.ts | alive-runtime | Edit file header | Prevents accidental modification |
| Add ARCHIVED header to main.ts before moving | alive-runtime | Edit file header | Documents why it exists |
| Create `src/wiring/README.md` | alive-runtime | New file (10 lines) | Eliminates "which entry point?" confusion |
| Add build artifacts to .gitignore | alive-constitution | Edit .gitignore | Keeps source clean |
| Rename LockdownMode in system-mode.ts | alive-constitution | TypeScript rename | Closes the worst naming collision |

---

## Status Tracking Template

Use this to track progress as work is completed:

```
Phase 1 (Lock/Freeze):
[ ] 1.1 SystemMode collision resolved
[ ] 1.2 main.ts archived
[ ] 1.2 slice*-cycle.ts archived
[ ] 1.2 phase1/ archived
[ ] 1.3 Canonical headers added
[ ] 1.3 src/wiring/README.md created
[ ] 1.4 Build artifacts removed from constitution
[ ] 1.5 Python files removed from alive-body

Phase 2 (Build First):
[ ] 2.1 CRG module created and wired into pipeline
[ ] 2.2 relay.ts created and emitting typed events
[ ] 2.3 contracts/memory-shells.ts created
[ ] 2.4 present-shell.ts created
[ ] 2.5 STM refactored to Episode-based
[ ] 2.6 Flag system wired into pipeline.ts

Phase 3 Track A (ULL):
[ ] 3A.1 ULL primitive extracted
[ ] 3A.2 ULL wired into STM onPush hooks
[ ] 3A.3 Background processor rebuilt
[ ] 3A.4 Learning system doctrine written

Phase 3 Track B (Interface):
[ ] 3B.1 RuntimeClient log-scraping replaced
[ ] 3B.2 Plugins updated for new event types
[ ] 3B.3 backbone-freeze-check in CI

Phase 3 Track C (Hardening):
[ ] TEST-001 through TEST-010 implemented and passing
```
