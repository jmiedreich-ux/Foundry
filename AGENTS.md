# Foundry Development Instructions

## Authority and startup

This process governs every Foundry change, whether completed by a person, Codex, or a local agent. Before changing the repository, read only:

1. `AGENTS.md`
2. `ai/handoffs/current.md`
3. `tracker/assignments.json`
4. `PROJECT_STATUS.md`
5. The active feature records under `docs/features/<feature>/`, when a feature is active
6. The linked issue, branch, pull request, comments, and exact-head checks, when they exist

Read architecture, component, or operations material only when the task touches it. Current repository and GitHub state override chat history and archives.

## Features and milestones

- The unit of work is a feature with small, independently mergeable milestones.
- Design authority is approved and recorded in `docs/features/<feature>/` before implementation. Open design questions go in that feature's question register; do not silently decide them in code.
- Tests are written with implementation, not after it.
- One milestone at a time: claim it, create one branch and PR, verify locally, obtain independent review, merge, then synchronize records.
- Keep changes bounded. Do not refactor unrelated behavior or start future-milestone work.
- **A packet's assignment belongs on its own checklist line, in the milestone's linked GitHub issue** — not only in `assignments.md` or the tracker. Atlas (the always-current site) reads a milestone's tasks directly from that issue's body and shows a task's owner from a trailing tag on the same line: `- [ ] task text — role-or-name` (an em dash, en dash, or plain hyphen, with a space before it). A task with no trailing tag shows as "Unassigned" on the site even when `assignments.md` names someone — the tag is the only thing Atlas actually reads. A task line may also lead with a stable id before a middle dot (`- [ ] CG-M1-01 · task text — role`), so a specific task can be referred to directly once one exists.

## How every task is performed

- Fix the behavior, not just the named example. Search for every occurrence and report which results were changed or why they were not.
- State the complete behavior before coding: entry, exit, alternate paths, refusal, conflict, empty state, retry, stale action, and recovery.
- Map every path and name what validates it. A path without validation is explicitly `UNTESTED`.
- Record and automatically assert the invariants of the area being changed. A defect caused by an impossible state becomes a new invariant as well as a regression test.
- Evidence is a rerunnable command plus its result. Never call unexecuted work verified.
- Read the handoff first and append the established facts, assumptions, deferred work, and exact next action before stopping.

## Definition of done

Consider every item below and explicitly mark non-applicable items `N/A (reason)` and unexecuted items `UNTESTED`.

- Happy path; loading, empty, disabled, invalid, error, retry, and recovery states.
- New and previously saved state; empty, minimum, maximum, long, duplicate, and partially-completed values.
- Back, reset, cancel, close, refresh, leave-and-return, repeat submission, and edit-after-completion where applicable.
- Keyboard operation, visible focus, labels, role/permission outcomes, enabled/disabled/unavailable states, and responsive behavior at smallest and largest supported widths.
- Long labels, overflow, zero/one/many records, and an adjacent-flow regression check.
- Every consumer of a shared component touched, searched, and accounted for.

## Documentation and controlled records

- Markdown is maintained product and engineering interface, not a work log. Update an existing authority before creating a new file.
- Controlled records are this file, `PROJECT_STATUS.md`, `ai/handoffs/current.md`, `tracker/assignments.json`, active feature records, and durable architecture documents.
- Batch record updates at milestone completion, except when a controlled record would otherwise become false; correct false records in the same change.
- Do not commit secrets, tokens, generated output, runtime logs, or machine-specific configuration.

## Shared-file and agent safety

- No two workers modify the same file concurrently.
- The coordinator owns contracts, package configuration, shared fixtures, workflows, tracker, status, and handoff.
- Check claims before starting. Stop and re-plan on an ownership conflict.
- Findings and out-of-scope decisions become issues or feature backlog items; do not silently expand scope.

## Verification, review, and handoff

- Run the relevant build, focused behavioral tests, static checks, and browser checks before a merge. Widen verification for shared contracts, package configuration, dependencies, or workflows.
- Tests assert behavior against real running targets when a target is involved; do not build doubles that reimplement the rule under test.
- Every change receives independent review by someone other than its author. Decisions are `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`; new commits require a new review.
- Performance records distinguish the ordinary existence of review from its impact. Every completed packet records its review decision, review rounds and minutes when measured, self-correction before review, local-authored lines retained in the accepted result, reviewer/coordinator lines added or replaced, defects that escaped automated gates, and a review-impact rating:
  - `R0` — approved unchanged.
  - `R1` — comments or polish only; no behavior change.
  - `R2` — one localized, non-contract correction with limited code or test change.
  - `R3` — any correction to approved behavior, an invariant, or previously missing required coverage.
  - `R4` — rejected or rebuilt because the core contract, scope, or implementation is wrong.
  A review-impact rating measures the work needed to reach an accepted result; it is not a negative rating simply because independent review occurred.
- **Atlas records are kept current as work happens, without independent review.** After claiming, starting, or finishing a milestone or task — checking a box in its GitHub issue, moving a milestone's status, updating `position`/`next` in `workstream.json` — commit that update directly. These are status reflections of work already true, not behavior changes, so they're exempt from the independent-review rule above; Atlas's own build validation (`node src/build.mjs`) is the check that matters here.
- At milestone completion, synchronize the issue, status, assignments, handoff, feature records, and affected durable docs. The handoff names one exact next action.
- Every milestone closes with a performance report. Record each packet's assigned role, actual agent type/model, local or cloud execution, elapsed time, review result and impact, review rounds, rework count, retained and replacement code attribution, verification result, automated-gate escapes, and `UNTESTED` count. Record milestone totals, independent-review outcome, owner-acceptance outcome, and any post-merge QA escape. Do not optimize routing or change this process without an evidence-backed issue or approved decision.
