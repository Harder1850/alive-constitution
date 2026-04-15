"use strict";
/**
 * MEMORY CONTRACT — alive-constitution
 * LOCKED — Slice 3  (v16 §25)
 *
 * Defines the Episode (STM unit) and MemoryKey structural types used by
 * alive-mind's memory subsystem (episode-store, semantic-graph, LTG).
 *
 * Rules:
 *   • alive-constitution imports nothing.
 *   • All other repos import from here.
 *   • Episodes are created and mutated ONLY by alive-mind's memory layer.
 *   • alive-runtime records/queries; it never mutates Episode fields directly.
 *
 * MemoryKey = kind:source  (structural composite of the two most stable
 * signal attributes — collapses repeated observations of the same condition
 * into a single episode rather than storing per-signal copies).
 *
 * MVI semantics (Slice 3):
 *   mvi starts at 1.0 on first record.
 *   +0.1 on each recall (usage reinforcement).
 *   −0.01 × (elapsed_s) on each decay tick.
 *   < 0.20 → cooling  (low-value, but retained)
 *   < 0.05 → pruned   (scheduled for removal)
 *
 * Do not add STM ring-buffer semantics, Symbol, Relationship, or Story
 * memory here — those are separate contracts in future slices.
 */
Object.defineProperty(exports, "__esModule", { value: true });
