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
- The original CG-M1-03 local OpenCode 1.18.21 / Ollama 0.32.15 `qwen3-coder:30b` attempt was stopped without an accepted change: its first attempt edited forbidden package configuration, and its single rework made no implementation commit. Its isolated worktrees remain unmerged as evidence. The M1-03 plan is now sequential sub-packets; only CG-M1-03.1 is active. Ollama must run with `OLLAMA_MODELS=/home/jeremy/aibox-setup/ollama-models`; the default `~/.ollama/models` store is empty.
- CG-M1-03.1 beta result: the same local agent committed a two-file React bootstrap (`e5e96d9`), which the coordinator rejected for a nested duplicate `#root`; one single-file correction (`ed492c0`) replaced it with an accessible `main`. The coordinator reran `npm run check`, `npm run build`, `git diff --check`, and the two-file boundary check; all passed. Browser smoke is `UNTESTED` because CG-M1-04 owns it. CG-M1-03.2 is the sole active sub-packet.
- CG-M1-03.2 beta result: the same local agent produced the requested one-file family-section change and ran a passing build, but did not make the required commit. Its one permitted handoff-only correction stopped after a pseudo-tool call without running the check or committing. The uncommitted in-scope diff remains in `/home/jeremy/Development/Foundry-m1-03-1-beta` as evidence; it is not accepted. No later M1-03 sub-packet is active.
- A normalized CG-M1-03.1 comparison ran every installed local model from `f59c1f9` with the same prompt and preinstalled dependencies. Devstral 24B stopped without a change; GPT-OSS 20B built and committed but omitted the rendered providers; Qwen 3.5 9B exceeded scope and did not hand off; Qwen3-Coder 30B built and committed but rendered a duplicate `#root`. The full evidence and timings are in `docs/features/control-gallery/performance-reports.md`. No model passed first-pass acceptance.
- Qwen3-Coder 30B was rerun from the same starting commit after manual Ollama launch with `OLLAMA_CONTEXT_LENGTH=65536`; the captured `ollama ps` output in `performance-reports.md` confirms live 65,536 context. It completed in 77.3 s but deleted allowed `main.js`, created forbidden `main.tsx`, skipped the requested build, and rendered a duplicate `#root`. This single 65K rerun did not show a reliability improvement; it does not establish context length as the cause of the scope failure. The manual server was stopped; no `ollama.service` exists to persist the setting.

## Deliberately deferred

- Any Vennusign adoption or conversion plan.
- Concrete controls beyond the minimum gallery shell used by CG-M1-03.

## Exact next action

Obtain owner direction: authorize coordinator takeover of the remaining M1-03 work, or approve an enforcement wrapper before any local retry. Do not dispatch CG-M1-03.3.
