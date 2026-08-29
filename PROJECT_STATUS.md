# Foundry Project Status

## Current feature

Control Gallery — Milestone 4: overlay and navigation controls, in progress.

## Current state

M1–M3 are accepted and closed. CG-M4-01 through CG-M4-05 are merged through PRs #32, #33, #34, #36, and #38 after independent review. CG-M4-06.1 is merged through PR #41. CG-M4-06.2's Qwen rendering run stalled with no files or commit, and remote Maestro was rejected after two non-compliant attempts and a failed preflight. The Codex coordinator now owns the approved two-file rendering packet; later bounded M4 packets remain assigned to Qwen.

## Next action

CG-M4-06.2: Codex coordinator implements the approved internal Tabs rendering contract under `packages/react/src/navigation/tabs/`, then runs its required gates and obtains independent review.
