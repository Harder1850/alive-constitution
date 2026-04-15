# ALIVE Contract Audit — Canonicalization Report

**Generated:** 2026-04-15  
**Scope:** alive-constitution/contracts/ + identity/ + invariants/ + policy/  
**Purpose:** Map existing repo files against the target freeze packet. No implementation performed.  
**Method:** Every `.ts` file in the repo read and cross-referenced against planning docs.

---

## Freeze Packet Target Surfaces

The eight surfaces that must be mapped:

| # | Surface | Description |
|---|---|---|
| 1 | Envelope / Signal Contract | Raw perception boundary type |
| 2 | Routes | Routing decisions / routing type surface |
| 3 | CAG Contract | Cognitive Access Gate — admissibility enforcement types |
| 4 | CRG Contract | Cognitive Resource Governor — resource budget types |
| 5 | Relay Contract | Runtime event emission types |
| 6 | Memory Contract | Memory unit types, shell interfaces |
| 7 | Layers | Layer boundary definitions, invariants |
| 8 | Index Export Surface | Barrel re-export for downstream consumers |

---

## Section A: Existing Contracts Inventory

### A.1 contracts/ directory — full inventory with status

| File | Size | Header / Lock Status | Content Summary | Quality |
|---|---|---|---|---|
| `signal.ts` | 161 lines | ✅ LOCKED v16 §31.3 | Signal, SignalSource, SignalKind, FirewallStatus, makeSignal, getSignalId | ✅ Excellent |
| `action.ts` | 59 lines | ✅ LOCKED v16 §31.3 | DisplayTextAction, WriteFileAction, Action union | ✅ Excellent |
| `decision.ts` | 84 lines | ✅ LOCKED v16 §31.3 | Decision, computeDecisionIntegrityHash (FNV-1a) | ✅ Excellent |
| `admissibility.ts` | 42 lines | ✅ LOCKED v16 §31.3 | AdmissibilityStatus, AdmissibilityResult | ✅ Excellent |
| `flag.ts` | 103 lines | ✅ LOCKED Slice 2 | Flag, FlagClass, createFlag + deprecated FlagType/FlagPriority/FlagRoute | ✅ Good (has deprecated cruft) |
| `memory.ts` | 100 lines | ✅ LOCKED Slice 3 | Episode, MemoryKey, LifecycleState | ✅ Excellent |
| `state.ts` | 67 lines | ✅ LOCKED v16 §31.3 | RuntimeState, **SystemMode** = 'idle'\|'active'\|'alert'\|'emergency' | ✅ Good |
| `authorized-action.ts` | 171 lines | ✅ Header (unlocked) | ActionAuthorization, computeActionHash (SHA-256), hasValidAuthorization, AuthorizedAction, ApprovalState, ApprovalStatus | ⚠️ Mixed concerns |
| `intent.ts` | 97 lines | ✅ Header (unlocked) | IntentCategory, IntentRequest, IntentResult | ✅ Good |
| `intent-thread.ts` | 79 lines | ✅ Header (unlocked) | IntentThread, IntentThreadStatus | ⚠️ Unsettled |
| `incident-record.ts` | 151 lines | ✅ Header (Slice 1.5) | IncidentRecord, LockdownSummary, ReadinessCheck, AuditResult | ⚠️ Unsettled |
| `system-mode.ts` | 92 lines | ✅ Header (Slice 1.5) | **SystemMode** = 'NORMAL'\|'LOCKDOWN', UnlockResult, RuntimeModeState, ModeTransitionTrigger, EnterModeParams | ❌ NAME COLLISION |
| `memory-entry.ts` | 8 lines | ❌ No header | MemoryEntry { id, layer:"uc"\|"stm"\|"ltm", content, confidence, timestamp } | ⚠️ Stub/legacy |
| `perception.ts` | 7 lines | ❌ No header | Perception { signal_id, mapped_symbols, novelty_score, change_delta, confidence } | ⚠️ Stub/legacy |
| `symbol.ts` | 6 lines | ❌ No header | Symbol { id, label, weight, lastActivated } | ⚠️ Stub/legacy |
| `story.ts` | 6 lines | ❌ No header | Story { id, title, events, significance } | ⚠️ Stub/legacy |
| `relationship.ts` | 6 lines | ❌ No header | Relationship { fromId, toId, type, strength } | ⚠️ Stub/legacy |
| `transition.ts` | 7 lines | ❌ No header | Transition { from, to, trigger, probability, timestamp } | ⚠️ Stub/legacy |
| `CONTRACT-TEMPLATE.ts` | 8 lines | Template | Empty template shell | 📋 Meta |

**Missing from contracts/:**
- `contracts/memory-shells.ts` — Present, ShortTerm, Background, Durable shell interfaces
- `contracts/relay-envelope.ts` — RuntimeEvent emission types
- `contracts/crg.ts` — CRGState, CRGBudget, ResourceSnapshot
- `contracts/index.ts` — barrel re-export (no index exists)

### A.2 invariants/ directory

| File | Content | Status |
|---|---|---|
| `system-invariants.ts` | SystemInvariants (INV-001 through INV-006), InvariantId, SystemInvariant | ✅ LOCKED, excellent |
| `action-bounds.ts` | MAX_ACTIONS_PER_CYCLE=5, ACTION_TIMEOUT_MS=5000, REVERSIBLE_ACTIONS_REQUIRED | ✅ Good |
| `memory-bounds.ts` | STM_MAX_ENTRIES=1000, LTM_MAX_ENTRIES=100000, EXPERIENCE_STREAM_MAX_AGE_MS | ✅ Good |
| `emergency-bounds.ts` | EMERGENCY_ALLOWS_CONSTITUTION_OVERRIDE=false, EMERGENCY_MAX_DURATION_MS=60000, SAFE_STATE_ALWAYS_REACHABLE | ✅ Good |
| `contracts/invariants/system-invariants.ts` | Duplicate of `invariants/system-invariants.ts`? (different directory) | ⚠️ UNCLEAR — needs verification |

### A.3 policy/ directory

| File | Content | Status |
|---|---|---|
| `policy/admissibility.ts` | AdmissibilityPolicy { isAdmissible(action), reason(action) } | ⚠️ Stub (imports from contracts/action) |
| `policy/authorization.ts` | AuthorizationPolicy { isAuthorized(action, context) } | ⚠️ Stub (imports from contracts/action) |
| `policy/validation.ts` | ValidationPolicy { validate(input) } | ⚠️ Stub |
| `policy/escalation.ts` | EscalationPolicy { shouldEscalate, escalationTarget } | ⚠️ Stub |

### A.4 identity/ directory

| File | Content | Status |
|---|---|---|
| `identity/identity-spine.ts` | IdentitySpine { name, instanceId, createdAt, version } | ⚠️ Stub |
| `identity/continuity.ts` | ContinuityRecord { sessionId, previousSessionId, startedAt, checkpointAt } | ⚠️ Stub |
| `identity/protected-self.ts` | ProtectedSelf { coreValues, prohibitedActions, identityHash } | ⚠️ Stub |

---

## Section B: Mapping from Existing Files to Target Freeze Packet

### B.1 — Surface 1: Envelope / Signal Contract

| Question | Answer |
|---|---|
| **Existing file(s)** | `contracts/signal.ts` |
| **Coverage** | Complete — Signal interface is fully defined with all required fields (id, source, kind, raw_content, timestamp, urgency, novelty, confidence, quality_score, threat_flag, firewall_status, stg_verified, perceived_at, payload) |
| **Supporting types** | SignalSource (8 variants), SignalKind (10 variants), FirewallStatus (3 states) |
| **Helper functions** | getSignalId(), makeSignal() — both appropriate to keep in contract |
| **Reusability** | ✅ **REUSABLE AS-IS** — this is already the canonical freeze anchor |
| **Lock status** | LOCKED v16 §31.3 |
| **Canonical path** | `contracts/signal.ts` — no change needed |
| **Downstream dependency** | YES — alive-body (signal ingestion, firewall), alive-runtime (pipeline, STG, triage), alive-mind (intent.ts imports SignalKind from here) |

**Verdict:** `signal.ts` already serves as the envelope boundary. **Do not touch.**

---

### B.2 — Surface 2: Routes

| Question | Answer |
|---|---|
| **Existing file(s)** | Multiple files, none canonical for "routes" |
| **Coverage** | Fragmented |
| **Where route concepts live today** | |
| → STG routing decisions (OPEN/DEFER/DENY) | NOT in contracts — defined in `alive-runtime/src/stg/` only |
| → FlagRoute (deprecated) | `contracts/flag.ts` lines 103: `'reflex' \| 'brain' \| 'defer' \| 'log_only'` |
| → Signal routing intent | `contracts/intent.ts` — IntentCategory implies routing |
| → Lifecycle routing state | `contracts/state.ts` — SystemMode drives routing context |
| → Lockdown routing gate | `contracts/system-mode.ts` — LockdownMode gates routes |
| → Admissibility gate | `contracts/admissibility.ts` — AdmissibilityStatus |
| → Runtime event routing | `contracts/relay-envelope.ts` — DOES NOT EXIST |
| **Reusability** | ⚠️ **NEEDS CONSOLIDATION** — no single route contract file exists |
| **Naming conflicts** | FlagRoute in flag.ts is explicitly deprecated; STG route enum lives only in runtime |
| **What's missing** | A `contracts/relay-envelope.ts` that formalizes the RuntimeEvent type surface (what events the relay emits per pipeline stage) |
| **Canonical path recommendation** | `contracts/relay-envelope.ts` — new file to create (Phase 2) |
| **Downstream dependency** | alive-runtime pipeline, alive-interface RuntimeClient (currently log-scraping, blocked on relay) |

**Verdict:** No single route contract file exists. FlagRoute is deprecated and should be removed in a future cleanup. The missing piece is `relay-envelope.ts` which formalizes runtime event routing types. Route intent is already partially covered by IntentCategory in intent.ts and AdmissibilityStatus in admissibility.ts. **Do not consolidate the existing files yet — create relay-envelope.ts as the new formal surface.**

---

### B.3 — Surface 3: CAG Contract (Cognitive Access Gate)

| Question | Answer |
|---|---|
| **Existing file(s)** | `contracts/admissibility.ts` (primary), `contracts/authorized-action.ts` (token model) |
| **Coverage** | Substantial — both the status lifecycle and the execution token are defined |
| **admissibility.ts coverage** | AdmissibilityStatus ('pending'\|'passed'\|'blocked'), AdmissibilityResult — clean, correct |
| **authorized-action.ts coverage** | ActionAuthorization (execution token), computeActionHash (SHA-256), hasValidAuthorization, AuthorizationResult + factory helpers. Also has AuthorizedAction and ApprovalState (intent result shapes) |
| **Reusability** | ✅ `admissibility.ts` — **REUSABLE AS-IS** |
| | ⚠️ `authorized-action.ts` — **REUSABLE but has mixed concerns** (two distinct concepts co-located) |
| **Naming conflicts** | None for the types themselves |
| **Structural issue** | `authorized-action.ts` mixes: (1) ActionAuthorization — the body-validated execution token, and (2) AuthorizedAction / ApprovalState — backbone-freeze result shapes from intent-handler. These are different contracts living in one file. The file's own comment acknowledges this ("Two distinct authorization concepts live here"). |
| **Canonical path** | `contracts/admissibility.ts` → keep as-is, FREEZE |
| | `contracts/authorized-action.ts` → keep as-is for now, flag for future split |
| **Downstream dependency** | YES — alive-runtime admissibility-check.ts, global-gate.ts both import from these |

**Verdict:** `admissibility.ts` is the clean CAG contract anchor. `authorized-action.ts` covers the execution token model but is overloaded — it will eventually need to be split into `authorized-action.ts` (token only) and `intent-result.ts` (ApprovalState / AuthorizedAction). **For now: freeze both as-is, annotate the split debt.**

---

### B.4 — Surface 4: CRG Contract (Cognitive Resource Governor)

| Question | Answer |
|---|---|
| **Existing file(s)** | **NONE** |
| **Coverage** | Zero — no CRG types exist anywhere in alive-constitution |
| **What's missing** | `contracts/crg.ts` — needs CRGState, CRGBudget, ResourceSnapshot, STGContext (or confirm STGContext lives in STG contract) |
| **Reusability** | ❌ **MISSING — must create** |
| **Canonical path** | `contracts/crg.ts` |
| **Note** | The STG already accepts an `STGContext` parameter in alive-runtime, but that type is defined in runtime — not in constitution. This is a contract definition violation (VIOLATION-007 from HARDENING_PLAN). The STGContext type should be defined here and imported by runtime. |
| **Downstream dependency** | alive-runtime CRG (to be created), alive-runtime STG (already uses STGContext implicitly) |

**Verdict:** CRG contract is completely missing. This is the highest-priority missing contract. **Create `contracts/crg.ts` in Phase 2.**

---

### B.5 — Surface 5: Relay Contract

| Question | Answer |
|---|---|
| **Existing file(s)** | **NONE in alive-constitution**. `alive-interface/packages/shared-types/src/events.ts` has RuntimeEvent types but lives in a different repo. |
| **Coverage** | Zero in constitution |
| **What exists elsewhere** | alive-interface has RuntimeEvent types — these are the correct types but are in the wrong repo. The constitution should be the single source of truth. |
| **Reusability** | ❌ **MISSING in constitution — must create** |
| **Canonical path** | `contracts/relay-envelope.ts` |
| **Note** | Creating this in constitution doesn't mean copying it verbatim from alive-interface — it means establishing the type surface here and having alive-interface import from constitution instead of defining its own. This resolves a potential VIOLATION-007 (types defined outside constitution). |
| **Downstream dependency** | alive-runtime relay.ts (to be created), alive-interface RuntimeClient (currently log-scraping) |

**Verdict:** Relay contract is missing from constitution. `relay-envelope.ts` must be created. Before creating it, the existing `alive-interface/packages/shared-types/src/events.ts` definition should be examined for reuse/alignment. **Create `contracts/relay-envelope.ts` in Phase 2.**

---

### B.6 — Surface 6: Memory Contract

| Question | Answer |
|---|---|
| **Existing file(s)** | `contracts/memory.ts` (primary, LOCKED), `contracts/memory-entry.ts` (older), `invariants/memory-bounds.ts`, missing: `contracts/memory-shells.ts` |
| **memory.ts coverage** | Episode (STM unit with id, kind, source, signal_id, outcome, confidence, mvi, created_at, last_accessed, lifecycle, trust_score), MemoryKey (`${kind}:${source}`), LifecycleState ('active'\|'cooling'\|'compressed'\|'pruned') |
| **memory-entry.ts coverage** | MemoryEntry { id, layer:"uc"\|"stm"\|"ltm", content, confidence, timestamp, expiresAt? } — DIFFERENT model |
| **memory-bounds.ts coverage** | STM_MAX_ENTRIES=1000, LTM_MAX_ENTRIES=100000, EXPERIENCE_STREAM_MAX_AGE_MS=86400000 |
| **Reusability** | ✅ `memory.ts` — **REUSABLE AS-IS**, this is the canonical memory contract anchor |
| | ⚠️ `memory-entry.ts` — **CONFLICTING** — see below |
| | ✅ `memory-bounds.ts` — **REUSABLE AS-IS** |
| **Conflict: memory.ts vs memory-entry.ts** | `Episode` (memory.ts) and `MemoryEntry` (memory-entry.ts) are competing models for what a unit of STM is. Episode is richer, locked, and has lifecycle/MVI semantics. MemoryEntry is bare-bones, unlocked, and uses a layer string enum. The GAP analysis (GAP-009) already states STM should use Episode. MemoryEntry is the legacy type that needs to be deprecated or reconciled. |
| **What's missing** | `contracts/memory-shells.ts` — Present, ShortTerm, Background, Durable shell interfaces |
| **Canonical path** | `contracts/memory.ts` → keep, FREEZE |
| | `contracts/memory-entry.ts` → **DEPRECATE** (mark with @deprecated header, not deleted — check downstream usage first) |
| | `contracts/memory-shells.ts` → **CREATE** in Phase 2 |
| **Downstream dependency** | memory.ts: alive-mind LTG, episode-store, memory-orchestrator all import Episode. memory-entry.ts: unknown — no header/lock suggests lower-priority usage. |

**Verdict:** `memory.ts` already serves as the memory contract anchor — explicitly say this. `memory-entry.ts` is a legacy competing definition that should be deprecated after confirming no downstream imports. `memory-shells.ts` must be created.

---

### B.7 — Surface 7: Layers

| Question | Answer |
|---|---|
| **Existing file(s)** | `invariants/system-invariants.ts` (primary), `contracts/state.ts`, `contracts/system-mode.ts`, `contracts/flag.ts` |
| **system-invariants.ts coverage** | INV-001 (STG gate), INV-002 (mind boundary), INV-003 (body boundary), INV-004 (interface boundary), INV-005 (enforcement integrity), INV-006 (firewall gate) — this IS the layer boundary specification |
| **state.ts coverage** | RuntimeState, SystemMode ('idle'\|'active'\|'alert'\|'emergency') — the state model that coordinates layer state |
| **system-mode.ts coverage** | SystemMode ('NORMAL'\|'LOCKDOWN'), UnlockResult, RuntimeModeState, ModeTransitionTrigger — the lockdown state model (NAME COLLISION) |
| **Reusability** | ✅ `invariants/system-invariants.ts` — **REUSABLE AS-IS** — this is the layer definition anchor |
| | ✅ `contracts/state.ts` — **REUSABLE AS-IS** after SystemMode collision is resolved |
| | ⚠️ `contracts/system-mode.ts` — **NEEDS RENAME** (SystemMode → LockdownMode or OperationalMode) |
| **Critical Conflict** | `contracts/state.ts` exports `SystemMode = 'idle' \| 'active' \| 'alert' \| 'emergency'` AND `contracts/system-mode.ts` exports `SystemMode = 'NORMAL' \| 'LOCKDOWN'`. **Same name, different semantics, both exported from alive-constitution.** Any downstream repo importing both will silently get one or the other depending on import order. |
| **system-mode.ts additional issue** | `RuntimeModeState` includes `blockedActionsCount: number` as a field — this is runtime state slipping into a pure contract definition. The interface describes what alive-runtime tracks, not a pure structural type. This is acceptable in constitution only if it's clearly a "state shape" type, not a "state store". It is, so it's fine — but should be reviewed. |
| **Canonical path** | `invariants/system-invariants.ts` → keep, FREEZE |
| | `contracts/state.ts` → keep, FREEZE (it owns the cognitive-cycle SystemMode) |
| | `contracts/system-mode.ts` → RENAME `SystemMode` → `LockdownMode`, then keep |
| **Downstream dependency** | system-invariants.ts: alive-runtime executive.ts references invariant IDs by string. state.ts: alive-mind StateModel. system-mode.ts: alive-runtime lockdown-triggers, modes/* |

**Verdict:** `invariants/system-invariants.ts` is the layer boundary anchor. The SystemMode collision between state.ts and system-mode.ts must be resolved immediately (GAP-021) — this is the #1 blocking naming conflict.

---

### B.8 — Surface 8: Index Export Surface

| Question | Answer |
|---|---|
| **Existing file(s)** | **NONE** — no `contracts/index.ts` exists anywhere |
| **Coverage** | Zero — all downstream consumers must import each contract file individually |
| **Reusability** | ❌ **MISSING** |
| **Impact** | Every downstream repo (alive-runtime, alive-mind, alive-body) imports contracts like: `import type { Signal } from 'alive-constitution/contracts/signal'` — path coupling, not package surface coupling |
| **Canonical path** | `contracts/index.ts` |
| **Note** | Creating an index should happen AFTER the SystemMode collision is resolved and the full set of contracts is stabilized. Creating it prematurely would freeze bad names into the export surface. |
| **Downstream dependency** | Will affect ALL downstream repos' import paths once created |

**Verdict:** Index export surface is completely missing. This is the last thing to create, not the first — it should be written only after the collision is fixed and the surface is confirmed stable.

---

## Section C: Conflicts / Overlaps

### C.1 — CRITICAL: SystemMode Name Collision

**Files:** `contracts/state.ts` line 28 AND `contracts/system-mode.ts` line 24

```typescript
// contracts/state.ts
export type SystemMode = 'idle' | 'active' | 'alert' | 'emergency';

// contracts/system-mode.ts  
export type SystemMode = 'NORMAL' | 'LOCKDOWN';
```

**Impact:** Any downstream file doing `import { SystemMode } from 'alive-constitution/contracts/state'` gets the cognitive mode. Any file doing `import { SystemMode } from 'alive-constitution/contracts/system-mode'` gets the lockdown mode. Both are named identically. If a future `contracts/index.ts` re-exports both, one silently shadows the other. This is the worst naming conflict in the entire constitution.

**Resolution:** Rename `contracts/system-mode.ts` export to `LockdownMode`. Update all imports in alive-runtime that reference `SystemMode` from system-mode.ts.

---

### C.2 — HIGH: Memory Model Duality (Episode vs MemoryEntry)

**Files:** `contracts/memory.ts` (Episode — LOCKED) and `contracts/memory-entry.ts` (MemoryEntry — no header)

**Overlap:** Both define what a unit of memory looks like. They are not complementary — they describe the same concept at different levels of formality and richness.

| Aspect | Episode (memory.ts) | MemoryEntry (memory-entry.ts) |
|---|---|---|
| Lock status | LOCKED Slice 3 | None |
| Fields | 10 rich fields with MVI, lifecycle, trust_score | 5 bare fields with layer enum |
| Layer typing | kind+source composite key | "uc"\|"stm"\|"ltm" string enum |
| Lifecycle | LifecycleState type | expiresAt number only |

**Resolution:** memory.ts / Episode is canonical. memory-entry.ts is legacy. Downstream usage of MemoryEntry must be audited before deprecation is enforced.

---

### C.3 — MEDIUM: authorized-action.ts Mixed Concerns

**File:** `contracts/authorized-action.ts`

**Overlap:** Two semantically distinct contract surfaces in one file:
1. **ActionAuthorization** — an execution-gating token that alive-body validates before running an action
2. **AuthorizedAction / ApprovalState** — backbone-freeze intent result shapes produced by alive-runtime after an intent cycle

These are different things. The file's own comment says "Two distinct authorization concepts live here" — the developer was aware. They were co-located for convenience, not because they're the same concept.

**Resolution:** For now, keep co-located (do not split yet). When Phase 2 intent handler work begins, split into `authorized-action.ts` (token model) and `intent-authorization.ts` (result shapes).

---

### C.4 — LOW: Deprecated FlagRoute Still Exported

**File:** `contracts/flag.ts` lines 95–103

`FlagRoute = 'reflex' | 'brain' | 'defer' | 'log_only'` is marked `@deprecated` but is still a live export. If downstream repos are importing it, they're coupling to deprecated API. It exists "for TriageResult only" per comment.

**Resolution:** Check alive-runtime triage/ for FlagRoute usage. Once confirmed unused, remove in a future cleanup pass.

---

### C.5 — LOW: policy/ files import from contracts/ (non-circular, but worth noting)

**Files:** `policy/admissibility.ts` and `policy/authorization.ts` both import `Action` from `contracts/action.ts`.

This is valid (constitution importing sibling contracts within itself), but it means the policy layer has a compile-time dependency on the contracts layer. If contracts/action.ts changes, policy/ files will need updates. This is expected behavior, not a defect — just worth documenting.

---

### C.6 — INFORMATIONAL: contracts/invariants/system-invariants.ts vs invariants/system-invariants.ts

**Finding from `list_files contracts/invariants`:** There is a `contracts/invariants/system-invariants.ts` file inside the contracts directory, in addition to the `invariants/system-invariants.ts` at the root level.

**Risk:** If these files have different content, there are two competing sources of truth for system invariants. If they're identical, the nested one is a copy that will drift. **Must verify these are not two different files before freezing either.**

---

## Section D: Missing Pieces

The following contracts are referenced in planning documents but do not yet exist in alive-constitution:

| Missing File | Priority | What It Must Define | Blocked On |
|---|---|---|---|
| `contracts/crg.ts` | **P2 — High** | CRGState, CRGBudget, ResourceSnapshot, STGContext | Nothing — pure types |
| `contracts/relay-envelope.ts` | **P2 — High** | RuntimeEvent union type (one variant per pipeline stage), RuntimeEventKind enum | Verify against alive-interface shared-types/events.ts before creating |
| `contracts/memory-shells.ts` | **P2 — High** | PresentShell, ShortTermShell, BackgroundShell, DurableShell interfaces | SystemMode collision resolved first |
| `contracts/index.ts` | **P3 — After stabilization** | Barrel re-export of all canonical contracts | ALL conflicts resolved, ALL missing files created |

Additionally, these files need resolution before they can be considered present:
- `contracts/invariants/system-invariants.ts` — unknown if duplicate or different from root `invariants/system-invariants.ts`

---

## Section E: Recommended Canonicalization Plan (Exact Step Order)

Steps are ordered by dependency. Each step's dependencies are listed explicitly.

---

### STEP 1 — Verify `contracts/invariants/system-invariants.ts` vs `invariants/system-invariants.ts`

**Action:** Diff both files. If identical → delete the nested copy and update any imports pointing to `contracts/invariants/`. If different → determine which is canonical and merge.  
**Why first:** If these are different, we have a duplicate invariant definition — this poisons every step downstream.  
**Dependencies:** None  
**Effort:** 15 minutes  
**Closes:** Potential ghost duplicate (untracked risk)

---

### STEP 2 — Resolve SystemMode Name Collision (GAP-021)

**Action:** In `contracts/system-mode.ts`, rename `SystemMode` → `LockdownMode`. Update `RuntimeModeState.mode` field type. Update `EnterModeParams.targetMode` field type. Search all repos for `SystemMode` imports from system-mode.ts and update.  
**Why second:** Until this is resolved, creating an index.ts would freeze the collision into the export surface. Also blocks every downstream file that might need to import both.  
**Dependencies:** Step 1  
**Effort:** 1–2 hours  
**Closes:** GAP-021

---

### STEP 3 — Freeze Tier 1 Canonical Contracts (Add headers)

**Action:** Add `CANONICAL — FROZEN` header comment to these files (they are already locked by content, just need the visual marker):
- `contracts/signal.ts` — verify header already says LOCKED (it does)
- `contracts/action.ts` — verify header already says LOCKED (it does)
- `contracts/decision.ts` — verify header already says LOCKED (it does, confirm frozen)
- `contracts/admissibility.ts` — verify header already says LOCKED (it does)
- `contracts/memory.ts` — verify header already says LOCKED (it does)
- `contracts/state.ts` — verify header and add FROZEN marker
- `invariants/system-invariants.ts` — verify header says LOCKED (it does)

**Why third:** Once the collision is fixed, these are safe to formally freeze. Freezing them before fixing the collision would incorrectly imply system-mode.ts is also frozen in its current broken form.  
**Dependencies:** Steps 1, 2  
**Effort:** 30 minutes

---

### STEP 4 — Audit memory-entry.ts Downstream Usage

**Action:** Search alive-mind, alive-runtime, alive-body for `import.*memory-entry`. If it has zero live imports, add `@deprecated — use Episode from contracts/memory.ts` header. If it has live imports, document them and create a migration plan.  
**Why fourth:** We cannot deprecate or remove memory-entry.ts without knowing who imports it. This is a safe read-only audit that doesn't require any changes.  
**Dependencies:** None (can run in parallel with Steps 2–3)  
**Effort:** 30 minutes

---

### STEP 5 — Audit Stub Contracts for Live Downstream Usage

**Action:** Search all repos for imports of: `perception.ts`, `symbol.ts`, `story.ts`, `relationship.ts`, `transition.ts`. Categorize each as:  
- (A) **Actively imported** → add minimal header, flag for future enrichment  
- (B) **Not imported anywhere** → mark as `@deprecated` candidates  
- (C) **Referenced in ARCHITECTURE docs as intentional future contracts** → add `FUTURE SLICE` header  

**Why fifth:** These stubs are ambiguous. We can't remove or lock them without knowing their real status. A search-only audit answers this.  
**Dependencies:** None (can run in parallel with Steps 2–4)  
**Effort:** 45 minutes

---

### STEP 6 — Annotate authorized-action.ts Split Debt

**Action:** Add a comment block to `contracts/authorized-action.ts` at the top clearly labeling the two sections: "SECTION 1 — Execution token (body gate)" and "SECTION 2 — Intent result shapes (runtime output)". Add a `TODO: Split into authorized-action.ts + intent-authorization.ts in Phase 2` note. Do NOT split yet.  
**Why sixth:** Documents the structural debt without acting on it. Prevents future developers from adding more mixed-concern types here.  
**Dependencies:** Steps 2, 3  
**Effort:** 10 minutes

---

### STEP 7 — Annotate Deprecated FlagRoute

**Action:** Audit alive-runtime triage/ for FlagRoute usage. If unused, add `@deprecated — remove when TriageResult is confirmed unused` to the FlagRoute export in flag.ts. Do NOT delete yet.  
**Dependencies:** Step 3 (flag.ts should be frozen after this)  
**Effort:** 20 minutes

---

### STEP 8 — Remove Compiled Build Artifacts from Tracking (GAP-022)

**Action:** Add to `.gitignore`: `contracts/*.js`, `contracts/*.js.map`, `contracts/*.d.ts`, `contracts/*.d.ts.map`, `identity/*.js`, `identity/*.js.map`, `invariants/*.js`, `invariants/*.js.map`. Run `git rm --cached` for all tracked build artifacts.  
**Dependencies:** None (can run any time)  
**Effort:** 30 minutes  
**Closes:** GAP-022

---

### STEP 9 — Create `contracts/crg.ts`

**Action:** Create new file with: CRGState, CRGBudget, ResourceSnapshot, STGContext types. These should be pure structural types with no implementations. Coordinate with alive-runtime CRG module design to ensure the types here match what the CRG will implement.  
**Dependencies:** Steps 2, 3 (constitution frozen before adding new files)  
**Effort:** 2–4 hours  
**Closes:** GAP-003 (contracts side)

---

### STEP 10 — Create `contracts/relay-envelope.ts`

**Action:** Examine `alive-interface/packages/shared-types/src/events.ts` first. Extract canonical RuntimeEvent type surface into constitution. The interface repo should then import from constitution. Define: RuntimeEventKind, RuntimeEvent union, one variant per pipeline stage (signal.received, firewall.checked, stg.evaluated, mind.started, mind.completed, admissibility.checked, execution.completed, pipeline.terminated).  
**Dependencies:** Steps 2, 3, 9  
**Effort:** 2–4 hours  
**Closes:** GAP-004, GAP-005 (contracts side)

---

### STEP 11 — Create `contracts/memory-shells.ts`

**Action:** Create new file with: PresentShell, ShortTermShell, BackgroundShell, DurableShell interfaces. These must use Episode from memory.ts (not MemoryEntry from memory-entry.ts). Include Pattern type stub for BackgroundShell.getPatterns() return.  
**Dependencies:** Steps 2, 3, 4 (memory-entry audit complete before creating shells)  
**Effort:** 2–4 hours  
**Closes:** GAP-010, GAP-012 (contracts side)

---

### STEP 12 — Create `contracts/index.ts`

**Action:** Create barrel re-export file that re-exports from ALL stable canonical contracts. Explicitly omit deprecated files (memory-entry, stub contracts not yet settled). Add `CANONICAL EXPORT SURFACE` header.  
**Dependencies:** ALL prior steps — especially Steps 9, 10, 11 (new files must exist before being exported)  
**Effort:** 1 hour  
**Closes:** Index export surface gap

---

## Section F: Minimal File Creation + Patch Plan

Listed in precise order of execution. No step creates a second source of truth.

```
PATCH ORDER:

1. [READ-ONLY AUDIT]  Diff contracts/invariants/system-invariants.ts vs invariants/system-invariants.ts
   → If same: rm contracts/invariants/system-invariants.ts + update any imports
   → If different: merge, determine canonical location

2. [RENAME - 1 line change] contracts/system-mode.ts
   → Line 24: `export type SystemMode = 'NORMAL' | 'LOCKDOWN';`
   → Change to: `export type LockdownMode = 'NORMAL' | 'LOCKDOWN';`
   → Update RuntimeModeState.mode field type
   → Update EnterModeParams.targetMode field type
   → Update all downstream imports (alive-runtime search: `SystemMode` from system-mode)

3. [ADD HEADER] contracts/state.ts, contracts/signal.ts, contracts/action.ts,
   contracts/decision.ts, contracts/admissibility.ts, contracts/memory.ts,
   invariants/system-invariants.ts
   → Add CANONICAL — FROZEN marker where not already present

4. [READ-ONLY AUDIT] Search for imports of: perception.ts, symbol.ts, story.ts,
   relationship.ts, transition.ts, memory-entry.ts
   → Produce import map; classify each as active/unused/future

5. [ADD COMMENT] contracts/authorized-action.ts
   → Annotate section boundary between token model and intent result shapes
   → Add split-debt TODO note

6. [GITIGNORE + UNTRACK] .gitignore
   → Add *.js, *.js.map, *.d.ts, *.d.ts.map patterns for contracts/, identity/, invariants/
   → git rm --cached all tracked build artifacts

7. [CREATE] contracts/crg.ts
   → CRGState, CRGBudget, ResourceSnapshot, STGContext
   → Pure types, no implementations

8. [CREATE] contracts/relay-envelope.ts
   → Examine alive-interface/packages/shared-types/src/events.ts first
   → RuntimeEventKind, RuntimeEvent union (8 variants)
   → Pure types, no implementations

9. [CREATE] contracts/memory-shells.ts
   → PresentShell, ShortTermShell, BackgroundShell, DurableShell
   → Must use Episode from memory.ts
   → Pure interfaces, no implementations

10. [CREATE] contracts/index.ts — LAST STEP
    → Re-export from all stable canonical contracts
    → Explicitly omit: memory-entry.ts (deprecated), stub contracts (pending review)
```

---

## Quick Reference: Freeze Packet Status

| Surface | File | Status | Action Required |
|---|---|---|---|
| Envelope / Signal | `contracts/signal.ts` | ✅ EXISTS — CANONICAL | None — freeze marker only |
| Routes | `contracts/relay-envelope.ts` | ❌ MISSING | CREATE (Step 10) |
| CAG Contract | `contracts/admissibility.ts` + `contracts/authorized-action.ts` | ✅ EXISTS — MIXED | Freeze admissibility; annotate authorized-action split |
| CRG Contract | `contracts/crg.ts` | ❌ MISSING | CREATE (Step 9) |
| Relay Contract | `contracts/relay-envelope.ts` | ❌ MISSING | CREATE (Step 10) — same file as Routes surface |
| Memory Contract | `contracts/memory.ts` | ✅ EXISTS — CANONICAL | None — freeze marker only |
| Memory Shells | `contracts/memory-shells.ts` | ❌ MISSING | CREATE (Step 11) |
| Layers | `invariants/system-invariants.ts` | ✅ EXISTS — CANONICAL | Verify no duplicate |
| Index Export | `contracts/index.ts` | ❌ MISSING | CREATE LAST (Step 12) |

---

## Blocking Risks Summary

| Risk | Severity | Mitigation |
|---|---|---|
| Two `SystemMode` types in the same contracts layer | CRITICAL | Step 2 resolves — rename system-mode.ts type before any index is created |
| `contracts/invariants/` subdirectory may have a duplicate system-invariants.ts | HIGH | Step 1 — verify and delete or merge before freezing |
| `memory-entry.ts` may be imported by downstream consumers | MEDIUM | Step 4 audit — do not deprecate without checking |
| `authorized-action.ts` mixed concerns will leak into index export | MEDIUM | Step 6 annotation documents debt before index is written |
| Creating `contracts/index.ts` too early freezes broken names | HIGH | Enforced by ordering — index is Step 12, after all conflicts resolved |

---

*End of Contract Audit Report. No files were created or modified in producing this report.*
