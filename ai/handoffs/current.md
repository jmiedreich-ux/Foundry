# Current handoff

## Established

- Foundry is independent from Vennusign. No Vennusign code, tokens, components, styling, migration layer, or compatibility work belongs here.
- Core button variants are Primary, Secondary, Destructive, and Link.
- The gallery must demonstrate real control behavior, not static specimens.
- The general Vennusign development process is mandatory for all Foundry work, adapted only to remove Vennusign-specific architecture and infrastructure rules.
- Initial repository commit: `8583064 Initialize Foundry control gallery`.
- The gallery exercises buttons, validation/reset, search, selection controls, dialog, drawer, menu, popover, tabs, banner, toast, loading, and reduced-motion behavior.
- `node --check apps/lab/src/main.js` passed. The visual detector found an overused typeface, which was replaced before the final commit.
- `docs/features/control-gallery/` now contains the approved decisions, question register, path coverage, M1–M5 records, ready M1 packets, and an explicit done ledger.
- `docs/features/control-gallery/assignments.md` marks the complete advance allocation: 16 bounded local-agent packets and 5 coordinator/specialist packets.
- Every Control Gallery milestone now requires an actual agent-routing performance report, including the model used, elapsed time, rework, review, verification, and `UNTESTED` results.
- GitHub issues #3–#7 now hold the approved packet checklists for Control Gallery milestones M1–M5; `docs/features/control-gallery/workstream.json` links each milestone to its issue.
- CG-M1-01 is complete: Node 22.23.2 and npm 10.9.8 ran `npm install`, `npm run check`, `npm run build`, and a real Chromium gallery smoke successfully. The issue #3 task is checked; the first durable browser specification remains CG-M1-04 work.
- CG-M1-02 is complete: PR #13 merged at `57bc1d7` after an independent final review approved `bd73c6f`. The coordinator reran `npm run test:foundation` (7/7), `npm exec tsc -- --noEmit`, `npm run check`, `npm run build`, and `git diff --check`; all passed. Browser specifications remain CG-M1-04 work.
- CG-M1-03 is claimed for the local OpenCode 1.18.21 agent using Ollama 0.32.15 and `qwen3-coder:30b` on the R9700. Ollama must run with `OLLAMA_MODELS=/home/jeremy/aibox-setup/ollama-models`; the default `~/.ollama/models` store is empty.

## Deliberately deferred

- Any Vennusign adoption or conversion plan.
- Concrete controls beyond the minimum gallery shell used by CG-M1-03.

## Exact next action

Execute CG-M1-03: the local-agent-owned React gallery shell and reusable example frame, then collect its unedited evidence and perform serialized coordinator verification.
