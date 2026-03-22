# ALIVE v7.1 Hardening Plan
## alive-constitution/docs/HARDENING_PLAN.md

**Status:** Active — Slice 1.5 section is immediate. Slice 2+ section is backlog.
**Authority:** alive-constitution — this document governs testing requirements across all repos.
**Architecture:** Unchanged. This document hardens what exists. It does not add features.

---

## Purpose

This document defines the adversarial test suite and boundary violation audit for the ALIVE v7.1 system. It exists because architecture documents alone do not prevent drift — only tested, enforced boundaries do.

Every test here is derived from an invariant defined in `alive-constitution/invariants/system-invariants.ts`. Every boundary violation is a known failure mode observed in legacy repos or derived from the authority model.

---

## Part 1: Adversarial Tests — Slice 1.5 Immediate

These tests must pass before Slice 1.5 is considered complete. They verify that the boundaries hold under adversarial or edge-case conditions, not just the happy path.

---

### TEST-001: STG Correctly Denies Cognition

**Purpose:**
Verify that alive-mind is never called when the STG outputs DENY. The STG is the primary constitutional protection against unauthorized cognition. If alive-mind runs when the STG denies, the most important invariant in the system is broken.

**Trigger:**
Send input `__deny_test__` from alive-interface. This forces `resource_state = 0.0` in the STG evaluation, triggering DENY output.

**Expected Behavior:**
- STG outputs DENY
- alive-runtime does NOT call alive-mind's `runCycle()`
- alive-interface receives: `{ canvas: 'text', content: { status: 'thinking paused', reason: 'resource constraint' } }`
- Experience log records the event with `stg_output: 'deny'`
- No Decision object is created
- No Action object is created
- No execution occurs in alive-body

**Failure Condition:**
Any of the following constitutes a test failure:
- alive-mind's `runCycle()` is called
- A Decision is produced
- An Action is dispatched to alive-body
- alive-interface displays a cognitive response
- The Experience log records `stg_output: 'open'` or does not record the event at all

---

### TEST-002: Firewall Blocks Malformed Signal

**Purpose:**
Verify that alive-body's Nervous System Firewall rejects structurally invalid input before it reaches alive-runtime or alive-mind. The firewall is the only legal entry channel. Nothing that fails validation should proceed.

**Trigger:**
Inject a malformed WebSocket message directly at alive-runtime that bypasses the interface layer. Use: `{ type: 'observation', source: null, modality: null, raw: undefined }` — missing required fields.

**Expected Behavior:**
- Firewall sets `firewall_status: 'blocked'`
- Signal does not proceed to STG
- alive-mind is NOT called
- alive-interface receives: `{ canvas: 'text', content: { status: 'signal rejected' } }`
- Experience log records the blocked signal with `firewall_status: 'blocked'`

**Failure Condition:**
- Signal proceeds past the firewall with any required field missing or null
- STG is called with a malformed Signal
- Any response is generated as if the input were valid

---

### TEST-003: Body Does Not Call alive-mind Directly

**Purpose:**
Verify that alive-body has no direct code path to alive-mind. All communication between body and mind must pass through alive-runtime. This is a structural test, not a runtime test.

**Trigger:**
Static code analysis: scan all files in alive-body/ for any import of, require of, or direct function call to any module in alive-mind/.

**Expected Behavior:**
- Zero imports from alive-mind found in alive-body
- Zero direct function calls to alive-mind modules
- The only path from alive-body to alive-mind is through alive-runtime bridges

**Failure Condition:**
Any import, require, dynamic import, or eval-based call from alive-body to alive-mind found anywhere in the codebase.

---

### TEST-004: Interface Cannot Bypass alive-runtime

**Purpose:**
Verify that alive-interface has no direct path to alive-mind, alive-body, or alive-constitution mutation. The interface is a display and input layer only. It routes everything through alive-runtime.

**Trigger:**
Static code analysis: scan all files in alive-interface/ for imports from alive-mind/, alive-body/, or any direct mutation of alive-constitution/ files.

**Expected Behavior:**
- Zero imports from alive-mind in alive-interface
- Zero imports from alive-body in alive-interface
- alive-interface communicates only through the WebSocket adapter to alive-runtime

**Failure Condition:**
Any direct import from alive-mind or alive-body found in alive-interface.

---

### TEST-005: Experience Log Is Append-Only

**Purpose:**
Verify that no code path in the system can overwrite or delete entries from the Experience stream. The Experience log is the ground truth of system identity and continuity. If it can be mutated, the audit chain is broken.

**Trigger:**
1. Write three events to the Experience log
2. Attempt to call any function that would overwrite or delete an existing entry
3. Attempt to truncate the log file directly
4. Check log contents after each attempt

**Expected Behavior:**
- No function exists in alive-body/logging/ that modifies existing entries
- The log file only grows — never shrinks
- After three writes, three entries are present in order
- After any attempted modification, three entries are still present and unchanged

**Failure Condition:**
- Any entry is overwritten or deleted
- The log shrinks after a write sequence
- A modify or delete function exists in experience-logger even if uncalled

---

### TEST-006: STG Denial Does Not Corrupt Next Cycle

**Purpose:**
Verify that a STG denial is stateless — it does not affect the outcome of the following cycle. Each cognitive cycle must be evaluated independently.

**Trigger:**
1. Send normal input → expect OPEN and cognitive response
2. Send `__deny_test__` → expect DENY
3. Send normal input again → expect OPEN and cognitive response

**Expected Behavior:**
- Cycle 1: OPEN, response produced, logged
- Cycle 2: DENY, no response, denial logged
- Cycle 3: OPEN, response produced, logged — identical behavior to Cycle 1
- No state from Cycle 2 leaks into Cycle 3

**Failure Condition:**
- Cycle 3 produces a DENY or DEFER because of residual state from Cycle 2
- Cycle 3 produces an error or degraded response
- The queue depth from the denial causes an unexpected mode change

---

### TEST-007: Decision Cannot Trigger Execution Without Runtime Enforcement

**Purpose:**
Verify that a Decision produced by alive-mind cannot directly cause alive-body to execute anything. Execution requires alive-runtime enforcement to pass. This tests the separation between cognition and execution.

**Trigger:**
Construct a Decision object manually (simulating alive-mind output) and inject it directly into alive-body's executor, bypassing alive-runtime's enforcement step.

**Expected Behavior:**
- alive-body's executor rejects or ignores any Action not authorized by alive-runtime
- The executor requires an `authorized_by` field pointing to a valid Decision ID that was processed through enforcement
- No execution occurs from the injected Decision

**Failure Condition:**
- alive-body's executor accepts and runs an action from a Decision that did not pass through alive-runtime enforcement
- The executor has no check for `authorized_by`
- Execution occurs

---

### TEST-008: Empty Input Does Not Crash the System

**Purpose:**
Verify that an empty string, whitespace-only, or zero-length input from alive-interface is handled gracefully and does not cause any unhandled exceptions, panics, or log corruption.

**Trigger:**
Send empty string `""`, whitespace-only `"   "`, and a newline-only `"\n"` as text observations from alive-interface.

**Expected Behavior:**
- Firewall catches zero-content signals
- Firewall sets `quality_score` to 0.0 or `firewall_status: 'flagged'`
- System responds with a graceful message or silently drops the input
- No exceptions propagate to alive-interface
- Experience log records the event without corruption

**Failure Condition:**
- Unhandled exception anywhere in the pipeline
- System crashes or becomes unresponsive
- Experience log entry is malformed

---

### TEST-009: Oversized Input Is Rate-Limited or Rejected

**Purpose:**
Verify that extremely large inputs (e.g., 1MB text paste) do not overwhelm the system, cause memory issues, or bypass the firewall's payload limits.

**Trigger:**
Send a text observation with `raw_content` of 1,000,000 characters.

**Expected Behavior:**
- Firewall detects oversized payload
- Firewall sets `firewall_status: 'blocked'` or truncates to defined maximum
- Signal does not proceed to STG in full form
- alive-interface receives a rejection response
- System remains responsive after the oversized input

**Failure Condition:**
- Oversized payload passes through firewall unchanged
- alive-mind receives 1MB of raw content
- System becomes unresponsive or crashes
- Memory consumption spikes uncontrolled

---

### TEST-010: Rapid Sequential Input Does Not Corrupt Log

**Purpose:**
Verify that sending many inputs in rapid succession (faster than the system processes them) does not cause Experience log corruption, out-of-order entries, or missed entries.

**Trigger:**
Send 10 text observations in rapid succession (< 100ms apart) from alive-interface.

**Expected Behavior:**
- All 10 events are logged in the Experience stream
- Log entries are in chronological order (by timestamp)
- No entries are missing or duplicated
- Some may be DEFER'd by STG queue management — this is acceptable
- The system remains responsive after the burst

**Failure Condition:**
- Any entry is missing from the log
- Entries are written out of order
- Log file is corrupted
- System becomes unresponsive

---

## Part 2: Hardening Backlog — Slice 2+

These tests are not required for Slice 1.5 but must be implemented before each relevant slice ships. They are tracked here to prevent them from being skipped.

---

### TEST-B001: Memory Promotion Requires LTG Approval (Slice 2)

**Purpose:**
Verify that no knowledge can enter Derived Memory without the Learning Gate (LTG) explicitly approving the promotion. This is the memory equivalent of the STG for cognition.

**Trigger:**
Attempt to write directly to alive-mind's Derived Memory store, bypassing the LTG evaluation.

**Expected Behavior:**
- No write path to Derived Memory exists that does not pass through LTG
- Direct writes are rejected
- LTG evaluation result is logged for every promotion attempt

**Failure Condition:**
- A direct write path to Derived Memory exists
- Knowledge enters Derived Memory without an LTG approval record

---

### TEST-B002: Contradiction Handling Does Not Silently Resolve (Slice 2)

**Purpose:**
Verify that when alive-mind detects two contradicting beliefs, it does not silently prefer one over the other. The lower-confidence node must be demoted and flagged, not silently overwritten.

**Trigger:**
Inject two Symbols into Derived Memory that produce directly conflicting predictions for the same context.

**Expected Behavior:**
- CCE detects the contradiction
- Lower-confidence node is demoted (lifecycle → 'cold' or flagged)
- Contradiction is recorded in Experience log
- Cognition continues from the higher-confidence node
- No silent resolution occurs

**Failure Condition:**
- One node overwrites the other without a logged contradiction event
- Both nodes persist without flagging
- System crashes on contradiction

---

### TEST-B003: STG Uses Real Resource Monitoring (Slice 2)

**Purpose:**
Verify that the Slice 2 STG replaces the test trigger (`__deny_test__`) with real resource state monitoring from alive-runtime's scheduler.

**Trigger:**
Artificially exhaust the configured compute budget in alive-runtime scheduler (simulate by setting budget to 0 programmatically in test mode).

**Expected Behavior:**
- STG evaluates `resource_state < 0.15`
- STG outputs DENY for non-survival signals
- The test trigger `__deny_test__` string no longer causes special behavior (it should be removed)

**Failure Condition:**
- STG still uses hardcoded test trigger in Slice 2
- Real resource state is not connected to STG evaluation
- Budget exhaustion does not affect STG output

---

### TEST-B004: Calibration Does Not Modify Constitutional Law (Slice 2)

**Purpose:**
Verify that the Calibration Engine (CE) in alive-mind cannot alter invariants, protected identity rules, or constitutional policy — even when confidence weights are being adjusted.

**Trigger:**
Run calibration cycle after a series of failed predictions. Inspect alive-constitution/invariants/ after calibration completes.

**Expected Behavior:**
- alive-constitution/invariants/ files are unchanged after any calibration run
- Calibration modifies only confidence weights in alive-mind/calibration/
- Calibration has no write path to alive-constitution

**Failure Condition:**
- Any file in alive-constitution/ is modified by a calibration run
- Calibration Engine has an import that writes to alive-constitution

---

### TEST-B005: Peer Knowledge Requires Local LTG Validation (Slice 3)

**Purpose:**
Verify that knowledge received from a peer node in the distributed network is treated as advisory until the local LTG validates and promotes it. No peer node can directly write to local Derived Memory.

**Trigger:**
Simulate a peer node sending a high-confidence Symbol directly to alive-mind's Derived Memory endpoint.

**Expected Behavior:**
- Peer knowledge is received and held in Thought Memory (advisory state)
- LTG evaluates the peer knowledge against local evidence
- LTG either promotes, defers, or discards
- No direct write from peer to Derived Memory is possible

**Failure Condition:**
- Peer knowledge bypasses LTG and enters Derived Memory directly
- A peer node can write to local Derived Memory with a high enough confidence score

---

### TEST-B006: Survival Mode Does Not Override Constitutional Prohibitions (Slice 2)

**Purpose:**
Verify that emergency/survival mode correctly narrows context and suspends background tasks, but does NOT override constitutional prohibitions or allow inadmissible actions.

**Trigger:**
1. Trigger survival mode (via autonomic threshold)
2. While in survival mode, send an input that would normally be inadmissible (blocked by admissibility policy)

**Expected Behavior:**
- Survival mode activates: context collapse, background suspended
- Admissibility check still runs
- Inadmissible action is still blocked
- STG still denies unauthorized cognition even in emergency mode
- System does not enter an "anything goes" state

**Failure Condition:**
- Admissibility check is skipped during survival mode
- An action that would normally be blocked is executed
- Constitutional prohibitions are suspended by mode flag

---

### TEST-B007: alive-runtime Cannot Redefine Constitutional Law (All Slices)

**Purpose:**
Verify that alive-runtime has no code path that mutates alive-constitution files at runtime. alive-runtime enforces the constitution. It does not own it.

**Trigger:**
Static analysis: scan all files in alive-runtime/ for any write operations targeting alive-constitution/ paths.

**Expected Behavior:**
- Zero write operations from alive-runtime to alive-constitution
- alive-runtime reads from alive-constitution at startup (constitution-loader.ts)
- alive-runtime does not write to alive-constitution at any point

**Failure Condition:**
- Any file write from alive-runtime to alive-constitution found
- Constitution-loader.ts has a write path
- Configuration updates from alive-runtime modify constitutional policy files

---

## Part 3: Boundary Violation Audit

Each entry describes a specific pattern of architectural drift, how to detect it, how severe it is, and how to prevent it.

---

### VIOLATION-001: Cognition in alive-body

**Violation Pattern:**
alive-body modules contain reasoning logic, pattern matching, intent interpretation, or decision formation. Any module in alive-body that imports alive-mind modules, maintains decision state, or produces outputs that are not raw signals or raw executions.

**Detection Rule:**
- Static: Any import from alive-mind/ in alive-body/ files
- Static: Any function in alive-body/ whose return type is Decision, Perception, or Symbol
- Runtime: alive-body produces a response without receiving an authorized Action from alive-runtime

**Severity:** CRITICAL

Cognition in alive-body breaks the fundamental separation of decision and execution authority. It creates an execution path that bypasses the STG, the admissibility check, and alive-runtime enforcement.

**Prevention Method:**
- alive-body's file structure has no cognition/ or decisions/ directory
- alive-body's package.json has no dependency on alive-mind
- Pre-commit hook: fail if any alive-body file imports from alive-mind
- Code review gate: any alive-body PR that adds decision logic is automatically rejected

---

### VIOLATION-002: Execution in alive-mind

**Violation Pattern:**
alive-mind modules directly call external services, write to the filesystem, send network requests, or invoke alive-body actuators. Any module in alive-mind that produces side effects in the real world.

**Detection Rule:**
- Static: Any import from alive-body/actuators/ or alive-body/nervous-system/ in alive-mind/
- Static: Any direct fetch(), fs.write(), or WebSocket.send() call in alive-mind/ (excluding test utilities)
- Runtime: alive-body actuator is triggered without a corresponding alive-runtime enforcement record

**Severity:** CRITICAL

Execution in alive-mind means cognition can act without authorization. This bypasses all enforcement, admissibility checks, and experience logging. It is the most dangerous failure mode in the architecture.

**Prevention Method:**
- alive-mind's package.json has no dependency on alive-body
- alive-mind's contract with alive-runtime is return-only: it receives a Perception and returns a Decision
- Pre-commit hook: fail if any alive-mind file imports from alive-body
- alive-mind has no actuators/ or execution/ directory

---

### VIOLATION-003: Law Definition in alive-runtime

**Violation Pattern:**
alive-runtime defines invariants, updates constitutional policy files, or contains hardcoded policy rules that duplicate or contradict alive-constitution. alive-runtime should read law, not write it.

**Detection Rule:**
- Static: Any write operation to alive-constitution/ paths from alive-runtime/ code
- Static: Any hardcoded policy constant in alive-runtime/ that duplicates a value defined in alive-constitution/policy/
- Runtime: Constitution file timestamp changes after alive-runtime startup

**Severity:** HIGH

When alive-runtime defines law, the separation between governance and enforcement collapses. Constitutional amendments can happen without the formal amendment process, making the system ungovernable.

**Prevention Method:**
- alive-runtime reads constitution at startup via constitution-loader.ts only
- constitution-loader.ts is read-only — no write interface
- Any constant that appears in both alive-runtime and alive-constitution is a violation: one source of truth
- Automated test: run `git diff alive-constitution/` after alive-runtime test suite — should be empty

---

### VIOLATION-004: UI Controlling System Lifecycle

**Violation Pattern:**
alive-interface spawns, terminates, or restarts alive-runtime or alive-body processes. The interface layer controls infrastructure rather than just displaying state and submitting commands through alive-runtime.

**Detection Rule:**
- Static: Any child_process.spawn(), exec(), or process management call in alive-interface/
- Static: Any alive-interface code that opens a WebSocket to alive-body directly (bypassing alive-runtime)
- Runtime: alive-runtime was started by alive-interface instead of by a separate process manager

**Severity:** HIGH

This was observed directly in alive-host-ui-legacy/server.js (spawned alive-system on startup). When interface controls lifecycle, removing the interface breaks the system — violating the replaceability invariant. It also means the interface has implicit authority over the system's existence.

**Prevention Method:**
- alive-interface is a pure client — it connects to alive-runtime, it does not start it
- System startup is handled by alive-runtime/src/lifecycle/startup.ts or an external process manager
- alive-interface package.json has no child_process, exec, or spawn dependencies
- Pre-commit hook: fail if alive-interface imports node:child_process or similar

---

### VIOLATION-005: Memory Ownership Outside alive-mind

**Violation Pattern:**
Derived Memory, Symbol storage, or Story storage is managed by alive-body, alive-runtime, or alive-constitution directly. Any module outside alive-mind that reads from or writes to Derived Memory structures.

**Detection Rule:**
- Static: Any import of alive-mind/memory/ modules from alive-body, alive-runtime, or alive-interface
- Static: Any Symbol, Story, or MemoryEntry write call outside alive-mind/
- Runtime: Derived Memory contents change without a corresponding alive-mind LTG record

**Severity:** HIGH

This was observed in alive-body-legacy/core/memory.js and alive-core-legacy/memory/. When memory is split across layers, the LTG gate is bypassed, the MVI tracking breaks, and the identity continuity guarantee fails.

**Prevention Method:**
- alive-mind/memory/ is private — no external imports permitted
- Memory contracts in alive-constitution are schemas only — not access interfaces
- alive-body has write access only to Experience stream (append-only log) — never to Derived Memory
- alive-runtime has read access to memory lifecycle state for scheduling — never write access

---

### VIOLATION-006: Mixed Decision and Execution in One Module

**Violation Pattern:**
A single module or function both determines what should happen (decision) and causes it to happen (execution). This pattern makes the module impossible to gate, audit, or constrain.

**Detection Rule:**
- Static: Any function that both produces a Decision/Action AND calls an actuator or external service in the same call stack
- Code review: Any module that has both a "what should I do" path and a "do it" path without a boundary crossing
- Runtime: An action occurs without a corresponding Entry in Experience log (meaning no logging step was reached)

**Severity:** CRITICAL

This was observed in alive-body-legacy/nervous-system/observation-handler.js, which called Claude (decision) and returned a render instruction (action) in a single function. This collapses the STG, admissibility, and enforcement steps into nothing.

**Prevention Method:**
- All Decision logic lives in alive-mind
- All execution logic lives in alive-body
- alive-runtime is the only entity that can authorize the crossing
- Code review gate: any PR where a single file appears in both alive-mind/ and alive-body/ dependency chains is automatically flagged

---

### VIOLATION-007: Constitutional Types Defined Outside alive-constitution

**Violation Pattern:**
Canonical type definitions (Signal, Decision, Action, Symbol, etc.) are duplicated, re-defined, or extended in alive-mind, alive-runtime, alive-body, or alive-interface instead of imported from alive-constitution.

**Detection Rule:**
- Static: Any file outside alive-constitution/contracts/ that defines an interface or type named Signal, Decision, Action, Symbol, Relationship, Story, MemoryEntry, Perception, or Transition
- Static: Any file that defines `type ClientRole` or similar cross-layer type outside alive-constitution

**Severity:** MEDIUM

Observed in alive-system-legacy/runtime/types.ts which declared "THIS FILE IS THE LAW" but lived in the runtime layer. When types are defined in multiple places, implementations drift apart silently.

**Prevention Method:**
- alive-constitution/contracts/ is the single source of truth for all shared types
- All other repos import types only — never define them
- Pre-commit hook: fail if any non-constitution file defines a type with a name matching the canonical contract list
- ESLint rule: no local redeclaration of imported contract types

---

### VIOLATION-008: Emergency Mode Bypassing Admissibility

**Violation Pattern:**
A mode flag (emergency, survival, last-resort) is used to skip the admissibility check or constitutional invariant enforcement. Code contains patterns like `if (mode === 'emergency') { skip_check = true }`.

**Detection Rule:**
- Static: Any conditional in alive-runtime/enforcement/ or alive-runtime/stg/ that skips an invariant check based on a mode value
- Static: Any `if emergency` branch that removes an enforcement step rather than adjusting thresholds
- Runtime: An admissibility check record is missing from the Experience log for a cycle that completed execution

**Severity:** CRITICAL

This is the most subtle violation pattern. Emergency mode should change urgency and narrow context. It must never skip enforcement. The STG may still DENY in emergency mode. Admissibility still runs in emergency mode.

**Prevention Method:**
- Admissibility check and STG evaluation are called unconditionally — no mode gate wraps them
- Emergency mode only affects: signal priority weighting, resource allocation, context narrowing, background task suspension
- Code review gate: any PR that adds a mode-conditional to an enforcement function is automatically rejected
- Invariant: `emergency_bounds.EMERGENCY_CHANGES_URGENCY_NOT_SOVEREIGNTY` is tested in TEST-B006

---

### VIOLATION-009: Peer Node Writing Directly to Local Derived Memory

**Violation Pattern:**
A peer node in the distributed network sends a knowledge payload that bypasses the local LTG and writes directly to Derived Memory. The peer's confidence score is used as a substitute for local LTG evaluation.

**Detection Rule:**
- Static: Any network receive handler in alive-mind/ that writes directly to memory without LTG
- Runtime: A Derived Memory entry exists with a provenance source of 'peer_node' and no corresponding LTG evaluation record

**Severity:** HIGH

Peer knowledge is advisory by constitutional invariant. High peer confidence does not substitute for local validation. An adversarial peer node could otherwise inject false beliefs directly into the system.

**Prevention Method:**
- All incoming peer knowledge enters Thought Memory first (advisory state)
- LTG evaluation is always required before promotion to Derived Memory regardless of source
- Peer knowledge has a `peer` trust modifier that reduces its initial LTG promotion weight
- Network receive handlers have no direct path to Derived Memory storage

---

### VIOLATION-010: Experience Stream Being Filtered or Redacted

**Violation Pattern:**
Code exists that can modify, delete, redact, or selectively exclude events from the Experience stream. This includes "cleanup" functions, log rotation that discards content, or "privacy" filters that blank fields.

**Detection Rule:**
- Static: Any function in alive-body/logging/ other than `append()` or `read()`
- Static: Any scheduled task that truncates, rotates with discard, or modifies the experience.jsonl file
- Runtime: Log entry count decreases between two reads

**Severity:** CRITICAL

The Experience stream is the ground truth of system identity. If it can be modified, the audit chain is broken and identity continuity cannot be guaranteed. Log rotation may compress but must never discard — cold storage is acceptable, deletion is not.

**Prevention Method:**
- experience-logger.ts exposes exactly two public functions: `log(entry)` and `readAll()`
- No delete, truncate, redact, or modify function exists
- File is opened in append mode only (`flags: 'a'`)
- Automated test: verify file only grows after writes (TEST-005 above)

---

## Severity Classification

| Severity | Definition | Action Required |
|---|---|---|
| CRITICAL | Breaks a constitutional invariant or enables unauthorized execution | Block PR immediately; requires architectural review before merge |
| HIGH | Breaks a boundary rule or creates an ungoverned code path | Block PR; requires lead review and architectural sign-off |
| MEDIUM | Creates drift risk or naming/type inconsistency | Flag in PR review; must be resolved within same slice |
| LOW | Style or naming issue that could lead to confusion | Note in review; resolve within two slices |

---

## Amendment Note

This document is part of alive-constitution. Changes to this document require a formal amendment following the process defined in `alive-constitution/amendments/AMENDMENT-TEMPLATE.md`.

Any test added, removed, or modified must be recorded as an amendment with justification, risk assessment, and authorization.

---

## Part 6: Meta-Hardening

Meta-hardening ensures the hardening layer itself cannot be circumvented, disabled, or silently skipped. These tests verify that enforcement runs, that it runs correctly, and that the build process cannot proceed when enforcement fails.

**Rule: All hardening tests are required for merge. No partial passes. No skipped tests. No override flags.**

---

### META-TEST-001: Enforcement Script Runs Without Error

**Purpose:**
Verify that `scripts/enforce-hardening.js` executes to completion without runtime errors on a clean codebase. An enforcement script that crashes silently provides no protection.

**Trigger:**
Run `node scripts/enforce-hardening.js` on the current codebase.

**Expected Behavior:**
- Script exits with code 0 on a clean codebase
- Script exits with code 1 and prints violation details on a dirty codebase
- No unhandled exceptions, no silent failures

**Failure Condition:**
- Script throws an unhandled exception
- Script exits with code 0 on a codebase containing known violations
- Script produces no output when violations are present

---

### META-TEST-002: Enforcement Blocks Dynamic Mind Invocation

**Purpose:**
Verify that the enforcement script detects and blocks any dynamic invocation of alive-mind from outside alive-runtime. Dynamic patterns (`require()`, `eval()`, `import()`) are harder to catch than static imports and must be explicitly checked.

**Trigger:**
Add a line to alive-body containing `require('alive-mind')` or `eval("require('alive-mind')")` and run the enforcement script.

**Expected Behavior:**
- Enforcement script detects the dynamic invocation
- Script exits with code 1
- Violation is printed with file path and line number

**Failure Condition:**
- Dynamic invocation passes enforcement check
- Script exits with code 0

---

### META-TEST-003: Enforcement Is Wired into Build Flow

**Purpose:**
Verify that `npm run hardening` exists in the root package.json (or in each repo's package.json) and that the pre-commit hook (if present) calls enforcement before allowing a commit.

**Trigger:**
Run `npm run hardening` from the repo root.

**Expected Behavior:**
- Command exists and runs the enforcement script
- Exit code reflects enforcement result (0 = clean, 1 = violations)

**Failure Condition:**
- `npm run hardening` is not defined
- Command exists but does not call enforce-hardening.js
- Pre-commit hook exists but does not call enforcement

---

### META-TEST-004: Enforcement Cannot Be Bypassed by Skipping Tests

**Purpose:**
Verify that individual tests in the enforcement suite cannot be selectively disabled via a flag, environment variable, or inline comment without modifying the enforcement script itself.

**Trigger:**
Attempt to run `SKIP_TEST=TEST-003 node scripts/enforce-hardening.js` and verify TEST-003 still runs.

**Expected Behavior:**
- No skip mechanism exists
- All tests in the suite always run
- Environment variables do not affect which tests execute

**Failure Condition:**
- Any test can be skipped without modifying enforce-hardening.js
- An environment variable disables one or more tests

---

### META-TEST-005: Enforcement Failure Blocks Execution

**Purpose:**
Verify that when enforcement fails, execution does not proceed. The enforcement log entry must precede any execution record in the Experience stream.

**Trigger:**
Inject a violation into the codebase, run the system, and check whether execution occurred despite the violation.

**Expected Behavior:**
- Enforcement detects the violation before execution
- No execution record appears in Experience stream for the cycle containing the violation
- Enforcement log entry appears before any execution entry in the Experience stream

**Failure Condition:**
- Execution occurs before enforcement log entry
- Execution occurs despite enforcement failure
- Experience stream contains execution record with no preceding enforcement record
