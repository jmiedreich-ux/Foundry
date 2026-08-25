# Control Gallery work packets

Each packet below is ready to claim only when its dependencies are complete and `tracker/assignments.json` records a non-conflicting owner.

## Required packet contents

Every implementation prompt or local-agent assignment must include:

1. The packet ID and objective.
2. Exact owned paths; a worker must not edit outside them.
3. Dependencies it may read or consume but not modify.
4. Non-goals.
5. Observable acceptance criteria and evidence commands.
6. The requirement to follow [`AGENTS.md`](../../../../AGENTS.md) and append the required handoff evidence.

## Ready work

- [M1 packets](m1.md) are ready once the coordinator establishes the workspace command.
- M2–M5 packet IDs, ownership, and acceptance criteria are defined in the matching milestone records. They become ready only after their predecessor milestone merges.

## Dispatch rule

Implementation packets with non-overlapping paths may run in parallel. The coordinator runs dependency installation, builds, browser tests, review, tracker/status updates, and the final integration serially.
