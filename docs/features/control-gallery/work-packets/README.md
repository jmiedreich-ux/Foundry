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

## Local-agent execution protocol

Give a local agent one packet only. Its prompt must repeat the packet ID, exact writable paths, acceptance checks, and evidence command. The agent must:

1. Read `AGENTS.md`, the current handoff, its linked issue checklist line, and its packet before editing.
2. Change only its owned paths. It may read listed dependencies but must not edit them.
3. Implement every stated behavior and its test in the same packet. It must not start a later packet or invent missing product decisions.
4. Run the packet's evidence commands and return the unedited result, changed-file list, `PASS`/`UNTESTED` paths, and any blocker.
5. Stop immediately on an ownership conflict, failed prerequisite, or missing decision; report the exact blocker to the coordinator rather than guessing a workaround.

The coordinator alone updates package configuration, shared contracts, test infrastructure, controlled records, issue checkboxes, and milestone status.
