# Constitution Architecture

The constitution is the supreme law of ALIVE. It has no runtime logic — only definitions.

## Layers (top to bottom)
1. **Invariants** — absolute bounds, cannot be overridden
2. **Contracts** — shared interfaces used across all repos
3. **Identity** — protected self definition
4. **Policy** — admissibility and authorization rules
5. **Amendments** — logged changes with justification

## Import Rules
- Constitution imports nothing
- All other repos import from constitution
- No circular dependencies allowed
