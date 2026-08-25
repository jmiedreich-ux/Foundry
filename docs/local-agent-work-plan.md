# Foundry — Local Agent Work Plan

## Purpose

The mandatory development process in [`AGENTS.md`](../AGENTS.md), adapted from the Vennusign development process, governs every Foundry change. This document adds a deliberately small subset of the prior **Maestro** framework in the existing repository to coordinate local agents; it never substitutes for or relaxes `AGENTS.md`.

## Included Maestro patterns

- One bounded milestone at a time.
- A short work packet with acceptance criteria and explicitly owned files.
- Area roles with no overlapping write ownership.
- Local agents used only for bounded implementation, test, or review tasks.
- Verification is serialized after implementation work, since local workers share machine resources.
- A simple done ledger records the packet, owner, checks run, and result.

## Deliberately excluded

- Maestro's v1 hosted-worker/PR control loop and its owner-approval workflow.
- Maestro's v3 independent-review, QA-hook, metrics, and Linux-gate automation.
- Inbound services, polling loops, or autonomous process changes.
- Vennusign code, tokens, components, compatibility layers, or migration helpers.

## Feature packet authority

The Control Gallery feature records are the authoritative execution plan:

- [Feature overview](features/control-gallery/README.md)
- [Milestones and ordered packet IDs](features/control-gallery/milestones.md)
- [Advance assignment map](features/control-gallery/assignments.md)
- [Ready M1 local-agent packets](features/control-gallery/work-packets/m1.md)
- [Path coverage and invariants](features/control-gallery/path-coverage.md)
- [Done ledger](features/control-gallery/done-ledger.md)

The prior `FND-*` outline is superseded by the `CG-M*` packet IDs and must not be dispatched.

## Packet format

Each packet must contain:

1. Objective and non-goals.
2. Exact owned files and directories.
3. Dependencies and interfaces it may consume but not modify.
4. Acceptance criteria written as observable behavior.
5. Commands to run and expected result.
6. A done-ledger entry with commit, checks, and unresolved findings.

## Working rules

- Every worker follows `AGENTS.md`, including complete path coverage, behavior-first investigation, rerunnable evidence, controlled records, and independent review.
- Only one agent writes a file or directory within a milestone.
- Agents do not expand scope or alter coordination rules; they propose changes in an issue or plan note.
- Run independent implementation packets in parallel only when their owned paths do not overlap.
- Run builds, browser checks, and integration verification serially.
- Keep commits packet-sized and reversible.
