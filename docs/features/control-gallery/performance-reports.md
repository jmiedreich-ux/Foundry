# Control Gallery — milestone performance reports

Create one completed section after each milestone. Record actual execution facts; do not replace a poor result with an assumed cause.

## Required per-packet record

| Packet | Assigned role | Intended type | Actual agent/model | Local or cloud | Files changed | Elapsed time | Review decision | Review impact | Review minutes | Review rounds | Rework count | Code attribution | Automated-gate escapes | Self-correction before review | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- | ---: | --- |

`Outcome` is one of: `accepted`, `returned for rework`, `escalated`, `stopped`, or `not started`.

## Required milestone summary

| Measure | Result |
| --- | --- |
| Milestone | — |
| Packets attempted / accepted / escalated | — |
| Local completion share | — |
| Total elapsed time | — |
| Total review rounds and rework count | — |
| Build and browser-gate result | — |
| Independent-review decision and reviewed commit | — |
| Owner-acceptance result | — |
| Total `UNTESTED` items | — |
| Post-merge QA escapes | — |
| Routing recommendation | Keep / change, with evidence and linked issue or approved decision |

## M3–M5 local-code-share planning and reporting

Before dispatching any M3–M5 packet, add this forecast to that milestone's report section. Estimates are planning ranges, not completion claims.

| Packet | Planned executor/runtime | Code-bearing paths | Estimated changed lines | Why local or cloud | Preflight command and expected result | Actual executor/runtime at dispatch | Preflight result and timestamp | Maximum corrections |
| --- | --- | --- | ---: | --- | --- | --- | --- | ---: |

At milestone close, add this cost-savings result. Count added plus deleted lines in accepted implementation and test files only; exclude controlled records, generated output, lockfiles, and runtime logs. Attribute a coordinator takeover or amendment to the coordinator even if a local attempt preceded it.

| Measure | Result |
| --- | --- |
| Planned local code-bearing lines / share | — |
| Accepted local code-bearing lines / share | — |
| Coordinator code-bearing lines / share | — |
| Local-share variance | — percentage points, with packet causes |
| Local attempts stopped or taken over | — packet IDs, elapsed time, and affected line estimate |
| Cost-savings conclusion | Evidence only: local work avoided, repeated, or added to coordinator work; no unmeasured dollar claim |

**Reporting rule:** Before dispatch, `Actual executor/runtime at dispatch` and `Preflight result and timestamp` are `UNSET`; filling them is part of the claim/start record, not a deferred close-out step. M3 and M4 target 60–70% accepted local code-bearing share. M5 reports local test-code share separately and does not treat audit or documentation lines as implementation-cost savings.

## M1

M1 remains active. This is a completed local-model comparison, not the M1 milestone performance report.

### CG-M1-03.1 local-model comparison — 2026-08-26

**Protocol:** Each model received the same CG-M1-03.1 instruction in a fresh isolated worktree at `f59c1f9`. The coordinator prepared dependencies before timing. A passing result required exactly two changed paths (`apps/lab/src/main.js` and `apps/lab/src/GalleryApp.tsx`), a React `createRoot` entry, both required providers, one accessible application root without a duplicate `#root`, a passing `npm run build`, and the requested commit. Browser testing is N/A for this comparison because CG-M1-04 owns it.

| Model | Actual agent/model | Local or cloud | Elapsed time | Files changed | Build / commit | Coordinator result | UNTESTED count | Outcome |
| --- | --- | --- | ---: | --- | --- | --- | ---: | --- |
| Devstral 24B | OpenCode 1.18.21 / Ollama `devstral:24b` | Local | 1.8 s | none | Not run / none | Stopped immediately without a change or report. A 16.2 s attempt interrupted by chat input is excluded from timing. | 4 | stopped |
| GPT-OSS 20B | OpenCode 1.18.21 / Ollama `gpt-oss:20b` | Local | 94.3 s | two allowed paths | PASS / requested commit `4211080` | Scope and mechanics passed, but `GalleryApp` imported instead of rendering `SkinProvider` and `LocaleProvider`. | 0 | stopped |
| Qwen 3.5 9B | OpenCode 1.18.21 / Ollama `qwen3.5:9b-q4_K_M` | Local | 235.3 s | four paths: the two allowed paths plus forbidden `GalleryApp.js` and `main.mjs` | Not run / none | Exceeded the boundary; its edited entry rendered a `Proxy` instead of `GalleryApp`; it then stopped without build or commit. | 2 | stopped |
| Qwen3-Coder 30B | OpenCode 1.18.21 / Ollama `qwen3-coder:30b` | Local | 91.8 s | two allowed paths | PASS / requested commit `79e5dec` | Scope and mechanics passed, but it rendered a second `#root`, violating the explicit no-duplicate-root invariant. | 0 | stopped |

**Result:** `0 / 4` models passed the complete first-pass acceptance contract. GPT-OSS and Qwen3-Coder produced buildable, committed two-file changes but each missed a stated semantic invariant. Devstral did not execute the task. Qwen 3.5 exceeded scope and did not hand off.

**Routing recommendation:** Do not dispatch CG-M1-03.2 or later M1-03 work to an installed local model without an owner-approved enforcement wrapper. The evidence supports a coordinator takeover, or a new local retry only after the wrapper blocks writes outside the declared paths and automatically checks provider use, duplicate IDs, build success, and required commit presence. This is evidence for an owner decision, not an automatic routing change.

### Qwen3-Coder 30B 65K-context rerun — 2026-08-26

**Protocol:** The same CG-M1-03.1 prompt and `f59c1f9` starting commit as the comparison above. Ollama was manually launched with `OLLAMA_CONTEXT_LENGTH=65536`. During the agent run, the coordinator captured this `ollama ps` result:

```text
NAME               ID              SIZE     PROCESSOR    CONTEXT    UNTIL
qwen3-coder:30b    06c1097efce0    25 GB    100% GPU     65536      4 minutes from now
```

| Model | Context | Elapsed time | Files changed | Build / commit | Coordinator result | Outcome |
| --- | ---: | ---: | --- | --- | --- | --- |
| Qwen3-Coder 30B | 65,536 | 77.3 s | three paths: allowed `GalleryApp.tsx`, deleted `main.js`, forbidden `main.tsx` | Not run / requested commit `096369e` | Exceeded the exact file boundary and rendered a duplicate `#root` again. | stopped |

**Comparison:** The 32K run took 91.8 s, changed only the allowed paths, and passed the build but still rendered a duplicate `#root`. The 65K run was faster but exceeded scope and did not run the build. This single rerun did not show a reliability improvement; it does not establish context length as the cause of the scope failure.

### Qwen 3.6 27B 65K-context comparison — 2026-08-26

**Protocol:** OpenCode 1.18.21 was configured with the newly installed local Ollama model `qwen3.6:27b`. Ollama was manually launched with `OLLAMA_CONTEXT_LENGTH=65536`; before the runs, `ollama ps` reported the model resident on the GPU with `CONTEXT 65536`. Each valid run began at `f59c1f9` in a separate isolated worktree with dependencies prepared. The first used the original CG-M1-03.1 prompt unchanged. The second differed only by explicitly prohibiting a second element with `id="root"`. Both required exactly the two declared paths, the provider and root invariants, a passing production build, and the requested commit. Browser testing is N/A for this comparison because CG-M1-04 owns it.

| Prompt | Actual agent/model | Context | Elapsed time | Files changed | Build / commit | Coordinator result | Rework count | UNTESTED count | Outcome |
| --- | --- | ---: | ---: | --- | --- | --- | ---: | ---: | --- |
| Original CG-M1-03.1 | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | 65,536 | 88.5 s | two allowed paths | PASS / requested commit `dd830b2` | Rendered `GalleryApp` through `createRoot`, rendered both providers, and retained only the existing `index.html` `#root`. | 0 | 0 | accepted |
| Explicit no-duplicate-`#root` clause | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | 65,536 | 99.4 s | two allowed paths | PASS / requested commit `d8a9898` | First build failed because JSX was used in `.js`; the agent replaced it with `React.createElement`, reran the build, then met the same file and root invariants. | 1 | 0 | accepted |

**Invalid setup attempt (excluded):** A first explicit-clause run stopped without a commit because the coordinator had accidentally prepared dependencies in the main workspace rather than its isolated worktree. The agent did not run `npm install`, as instructed. This was a coordinator setup error, not a model result.

**Result:** Qwen 3.6 27B passed both valid CG-M1-03.1 comparisons. This is evidence that the dense model can meet the bootstrap contract in this controlled environment; it does not establish general routing reliability beyond this packet or replace the outstanding owner decision for CG-M1-03.2.

**Routing recommendation:** Do not change default routing automatically from two bootstrap runs. Owner may approve a supervised Qwen 3.6 27B beta retry for CG-M1-03.2, with the same isolation, path-boundary checks, build gate, and one-review limit; otherwise choose coordinator takeover or an enforcement wrapper.

### Qwen 3.6 27B CG-M1-03.4 capability test — 2026-08-26

**Protocol:** This was an owner-authorized throwaway capability test, not M1 production work. It began in an isolated worktree at the Qwen 3.6 CG-M1-03.1 result `dd830b2`, with dependencies prepared, and did not claim CG-M1-03.4 or change any Atlas record. The prompt allowed only a new `apps/lab/src/MotionSetting.tsx`, required the established `document.body.reduce-motion` convention, and explicitly left integration to CG-M1-03.7.

| Model | Actual agent/model | Context | Elapsed time | Files changed | Agent build / commit | Coordinator validation | UNTESTED count | Outcome |
| --- | --- | ---: | ---: | --- | --- | --- | ---: | --- |
| Qwen 3.6 27B | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | 65,536 | 273.1 s | one allowed path: `apps/lab/src/MotionSetting.tsx` | PASS / requested commit `b4d4afd` | `npm exec tsc -- --noEmit` FAILED: `aria-pressed={String(reduced)}` is not assignable to the project's button ARIA type. The production build did not expose this because the intentionally unintegrated component was not in the bundle. Source review confirmed its body-class cleanup preserves a pre-existing class. | 1 | stopped |

**Result:** The agent respected the one-file boundary, derived the established motion behavior, and committed after its requested build. It did not run the relevant TypeScript check, and its component is not type-correct. The model therefore did not complete the packet's acceptance contract.

**Routing consequence:** A production local-agent gate for new or unintegrated TypeScript files must include `npm exec tsc -- --noEmit`, not only a production build. This is an evidence-backed addition to the supervised-retry gate; it does not alter M1 status or authorize CG-M1-03.4.

### M1 completion performance report — merged and owner accepted

| Packet | Assigned role | Actual agent/model | Local or cloud | Elapsed time | Review rounds | Rework count | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | ---: | ---: | ---: | --- | ---: | --- |
| CG-M1-01 | coordinator | historical coordinator execution | Cloud | Not captured | 1 | 0 | Clean install, dev, build, and Chromium smoke recorded as PASS. | 0 | accepted |
| CG-M1-02 | coordinator / foundation specialist | historical coordinator execution | Cloud | Not captured | 1 | 0 | Foundation tests 7/7, TypeScript, static check, and build PASS. | 0 | accepted |
| CG-M1-03.1 | gallery bootstrap | OpenCode / Ollama `qwen3-coder:30b` | Local | Not captured | 0 | 1 | Accepted historical two-file bootstrap and accessibility correction were restored to the M1 branch; TypeScript and build PASS. | 0 | accepted |
| CG-M1-03.2 | gallery content | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 61.5 s | 0 | 0 | One-file boundary, TypeScript, static check, build, title/description, and five empty sections PASS. | 0 | accepted |
| CG-M1-03.3 | gallery navigation | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 58.6 s | 0 | 0 | One-file boundary, TypeScript, static check, build, labelled native links, and five exact targets PASS. | 0 | accepted |
| CG-M1-03.4 | motion setting | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 162.1 s | 0 | 1 | First draft was uncommitted and removed pre-existing motion state; corrected one-file result passed TypeScript, static check, build, and source review. | 0 | accepted |
| CG-M1-03.5 | gallery layout | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 166.4 s | 0 | 1 | First draft retained literal reduced-motion durations; corrected two-file result passed token, TypeScript, static, build, and screenshot checks. | 0 | accepted |
| CG-M1-03.6 | example frame | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 92.5 s | 0 | 1 | First draft used invalid legend contents; corrected one-file result passed semantic source review, TypeScript, static check, and build. | 0 | accepted |
| CG-M1-03.7 | coordinator integration | Codex coordinator | Cloud | Not separately captured | 0 | 1 | Integrated all accepted parts; corrected local `.tsx` import suffixes; TypeScript, static check, build, and 1280×720/320×720 Chromium screenshots PASS. | 0 | accepted |
| CG-M1-04 | browser specifications | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 161.0 s | 3 | 2 | First test programmatically focused the button; the returned test then used a generic outline assertion. A coordinator correction now asserts Foundry's exact solid 3px default-skin focus ring and 4px offset; the full TypeScript, foundation, static, build, and five-check Chromium gate passed. | 0 | accepted |

| Measure | Result |
| --- | --- |
| Milestone | M1 — Gallery foundation and test harness |
| Packets attempted / accepted / escalated | 10 / 10 / 0 |
| Local completion share | 7 of 10 packets (70%) |
| Total elapsed time | 702.1 s measured local execution; historical coordinator and CG-M1-03.1 timings were not captured. |
| Total review rounds and rework count | Three independent review rounds: `d3bd907` requested a focus-contract assertion, `feeb8a4` requested controlled-record head-reference correction, and `99132e9` received `APPROVE`. Eight total rework rounds: five local packet-return corrections (including the historical bootstrap correction) and three coordinator corrections. |
| Build and browser-gate result | PASS: foundation 7/7, TypeScript, static check, build, and Chromium 5/5. |
| Independent-review decision and reviewed commit | `APPROVE` on `99132e9` after the two recorded request-change rounds. PR #18 merged to `main` at `6f45394`. |
| Owner-acceptance result | PASS — owner accepted the live M1 gallery on 2026-08-27. |
| Total `UNTESTED` items | 0. |
| Post-merge QA escapes | N/A — no escape reported at merge. |
| Routing recommendation | Keep Qwen 3.6 only under the measured path-boundary, TypeScript, build, required-commit, coordinator-source-review, and one-correction gates. |

### Muse Glimmer 30B M1 packet comparison — partial, 2026-08-26

**Status:** This is an owner-requested, non-production comparison. It does not change M1, issue #3, its accepted code, or its routing decision. The run stopped after four of six packets were attempted; CG-M1-03.6 and CG-M1-04 were not started. This section deliberately preserves incomplete and missing results rather than estimating them.

**Protocol:** OpenCode 1.18.21 used local Ollama `muse-glimmer:30b`. Ollama was manually started with `OLLAMA_CONTEXT_LENGTH=65536`; immediately before the runs, `ollama ps` showed the model at `100% GPU` with `CONTEXT 65536`. Each packet began in a separate detached worktree at the same historical starting commit used for its Qwen 3.6 production run, with dependencies prepared. The gates were exact writable paths, TypeScript, static check, production build, requested commit, one permitted rework, and coordinator source review. Browser testing is N/A for packets CG-M1-03.2 through CG-M1-03.6 because CG-M1-04 owns it.

```text
NAME                ID              SIZE     PROCESSOR    CONTEXT
muse-glimmer:30b    de878ce33ad8    16 GB    100% GPU     65536
```

| Packet | Assigned role | Actual agent/model | Local or cloud | Files changed | Elapsed time | Review rounds | Rework count | Failed-tool recovery without coordinator rework | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| CG-M1-03.2 | gallery content | OpenCode 1.18.21 / Ollama `muse-glimmer:30b` | Local | `apps/lab/src/GalleryApp.tsx` | 604.7 s | 2 | 1 | No | Initial draft used incompatible section IDs; corrected draft passed exact-path, TypeScript, static, build, commit, and source-review gates. | 0 | accepted |
| CG-M1-03.3 | gallery navigation | OpenCode 1.18.21 / Ollama `muse-glimmer:30b` | Local | `apps/lab/src/FamilyNavigation.tsx` | 334.9 s | 1 | 0 | Yes — it recovered after an attempted read of the intentionally absent new file. | Exact-path, TypeScript, static, build, commit, native-link, and source-review gates passed. | 0 | accepted |
| CG-M1-03.4 | motion setting | OpenCode 1.18.21 / Ollama `muse-glimmer:30b` | Local | `apps/lab/src/MotionSetting.tsx` | 1,001.4 s | 2 | 1 | No | Initial draft temporarily removed an existing motion class. Corrected draft preserves and restores original state; exact-path, TypeScript, static, build, commit, and source-review gates passed. | 0 | accepted |
| CG-M1-03.5 | gallery layout | OpenCode 1.18.21 / Ollama `muse-glimmer:30b` | Local | Uncommitted `apps/lab/src/GalleryLayout.tsx` only; required stylesheet was not changed | Not captured as a completed packet | 0 | 1 | Yes — it continued after a failed stylesheet-inspection command, but did not finish. | Initial run changed its fixed historical checkout, violating isolation. Its one replacement run did not complete the layout, gates, or commit. | 5 | stopped |
| CG-M1-03.6 | example frame | Not dispatched | N/A | none | N/A | 0 | 0 | N/A | Not run because the comparison stopped after the incomplete layout packet. | 6 | not started |
| CG-M1-04 | browser specifications | Not dispatched | N/A | none | N/A | 0 | 0 | N/A | Not run because the comparison stopped after the incomplete layout packet. | 7 | not started |

| Measure | Result |
| --- | --- |
| Packets attempted / accepted / escalated | 4 / 3 / 0; two packets not started. |
| Completed-packet elapsed time | 1,941.0 s (32.4 min) for CG-M1-03.2 through CG-M1-03.4 only. The incomplete layout attempt has no trustworthy completed-packet time, so no six-packet total is reported. |
| Comparison to Qwen 3.6 | The same three Qwen packets totaled 282.2 s (4.7 min); Muse took 6.9× as long for the completed subset. Qwen completed all six packets in 702.1 s (11.7 min). |
| Build and browser-gate result | Three accepted packet build gates PASS. Browser gate N/A for CG-M1-03.2 through CG-M1-03.6; UNTESTED for CG-M1-04 because it was not dispatched. |
| Independent-review decision | UNTESTED — this is an in-progress comparison record, not a production milestone change. |
| Owner-acceptance result | N/A — the benchmark does not seek owner acceptance or alter M1's outstanding owner-acceptance item. |
| Routing recommendation | Do not replace supervised Qwen 3.6 routing with Muse Glimmer on this evidence. Muse recovered from two failed tool actions without a coordinator-issued rework, but it was markedly slower and failed the layout packet's isolation/completion contract. |

### Codestral 22B M1 packet dispatch preflight — 2026-08-26

**Status:** This owner-requested comparison could not dispatch a packet through the same OpenCode local-agent method used for Qwen and Muse. It is a configuration result, not a six-packet performance result; no Foundry source or temporary benchmark worktree was changed.

**Environment:** The official Ollama image `codestral:22b` (`0898a8b286d5`) was installed and loaded at `100% GPU`. The temporary Ollama server had `OLLAMA_CONTEXT_LENGTH=65536` set, but `ollama ps` correctly reported `CONTEXT 32768`: this specific Codestral 22B image has a 32K context window. The official Ollama tags list that 32K limit. [Ollama Codestral tags](https://ollama.com/library/codestral/tags)

| Packet | Actual agent/model | Local or cloud | Files changed | Elapsed time | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| CG-M1-03.2 dispatch preflight | OpenCode 1.18.21 / Ollama `codestral:22b` | Local | none | No model task elapsed time | OpenCode rejected dispatch before model work: `registry.ollama.ai/library/codestral:22b does not support tools`. The model therefore could not read, edit, run the gates, or commit. | 6 | stopped |
| CG-M1-03.3 through CG-M1-03.6 | Not dispatched | N/A | none | N/A | Not run after the tool-support preflight failure. Browser testing is N/A because CG-M1-04 owns it. | 6 each | not started |
| CG-M1-04 | Not dispatched | N/A | none | N/A | Not run after the tool-support preflight failure; its real-browser gate was not exercised. | 7 | not started |

| Measure | Result |
| --- | --- |
| Packets attempted / accepted / escalated | 0 / 0 / 0; one dispatch preflight stopped before model work, five packets not started. |
| Completed-packet elapsed time | N/A — OpenCode rejected the model before a packet began. |
| Build and browser-gate result | UNTESTED — no model-authored change exists to validate. |
| Routing recommendation | Do not route Foundry local coding packets to this `codestral:22b` Ollama image through OpenCode. Its tool-support absence makes it ineligible for the controlled agentic workflow; a different harness would be a different benchmark and requires separate approval. |

## M2

### M2 completion performance report — merged, owner acceptance pending

| Packet | Assigned role | Intended type | Actual agent/model | Local or cloud | Files changed | Elapsed time | Review rounds | Rework count | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- | ---: | --- |
| CG-M2-01 | coordinator / foundation specialist | Premium cloud coordinator | Codex coordinator | Cloud | `foundation/field.*`, `validation/**`, decision record | Not separately captured | 2 | 1 | Field/Group/validation focused tests, TypeScript, static check, build, and diff check PASS. The explicit-child-ID contract gap found during the next packet was corrected before acceptance. | 0 | accepted |
| CG-M2-02 | input-controls agent | Local 24B–35B coding agent | OpenCode 1.18.21 / Ollama `qwen3.6:27b` stopped; Codex coordinator completed | Local + cloud | `inputs/text-field/**`, `inputs/select/**`, public exports | Local restarted attempt: over 7 min with no source change; coordinator time not separately captured | 2 | 1 | Focused tests, TypeScript, static check, build, and diff check PASS. | 0 | accepted |
| CG-M2-03 | gallery agent | Local 9B–24B coding agent | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | `apps/lab/src/examples/fields/FieldExamples.tsx` | 182 s measured agent session | 2 | 1 | Agent corrected its required-form handling after coordinator review; TypeScript, static check, build, and diff check PASS. | 0 | accepted |
| CG-M2-03.1 | coordinator integration | Premium cloud coordinator | Codex coordinator | Cloud | `apps/lab/src/GalleryApp.tsx` | Not separately captured | 2 | 0 | Inputs section integration plus focused tests, TypeScript, static check, build, and diff check PASS. | 0 | accepted |
| CG-M2-04 | specifications agent | Local 9B–24B coding agent | OpenCode 1.18.21 / Ollama `qwen3.6:27b` stopped; Codex coordinator completed | Local + cloud | `tests/fields/control-gallery-fields.spec.ts` | Local attempt: about 7 min 30 s before stop; coordinator time not separately captured | 2 | 1 | Local draft failed its first real-browser run and stalled. Coordinator replacement passes all seven M2 Chromium checks. | 0 | accepted |
| CG-M2-review-01 | review correction | Premium cloud coordinator | Codex coordinator | Cloud | focus hook, TextField, Select, default skin, browser spec | Not separately captured | 1 | 1 | First independent review found missing default-skin state treatments and absent focus-visible state. Correction passed focused 21/21, TypeScript, static check, build, full Chromium 13/13, and diff check; renewed review approved. | 0 | accepted |

| Measure | Result |
| --- | --- |
| Milestone | M2 — Foundations and field controls |
| Packets attempted / accepted / escalated | 5 / 5 / 2 coordinator takeovers (CG-M2-02 and CG-M2-04). |
| Local completion share | 1 of 5 packets (20%) completed directly by the local agent; CG-M2-03 required one correction. |
| Total elapsed time | At least 17 min 32 s of measured/observed local-agent time. Coordinator timing was not separately captured, so no fabricated total is reported. |
| Total review rounds and rework count | Two independent-review rounds: `REQUEST_CHANGES` on `e49aa8f`, then `APPROVE` on `2b7002a`. Five recorded rework/correction rounds, including two coordinator takeovers and the review correction. |
| Build and browser-gate result | PASS: focused Vitest 21/21, TypeScript, static check, production build, and Chromium 13/13. |
| Independent-review decision and reviewed commit | `APPROVE` on `2b7002a`; PR #21 merged to `main` at `2ab4753`. |
| Owner-acceptance result | PASS — owner approved the merged M2 field-controls gallery on 2026-08-27. |
| Total `UNTESTED` items | 0. |
| Post-merge QA escapes | N/A — no post-merge escape reported. Pre-merge independent review found and corrected the default-skin/focus-visible defects under Issue #22. |
| Routing recommendation | Keep Qwen 3.6 only for very small, presentation-level packets with exact paths, preinstalled dependencies, TypeScript/build/commit gates, source review, and one correction. It completed CG-M2-03 after correction but did not complete the input or browser-test packets; no routing expansion is supported by this evidence. |

## M3

### M3 packet reports

Each completed M3 packet receives a short report in this section before the next ordered packet starts. The report distinguishes local code retained in the accepted result from coordinator completion work; it does not substitute for the milestone-close performance table.

#### Review-impact protocol

Every new packet report records the independent-review decision, measured review minutes when available, review rounds, local-authored lines retained in the accepted result, reviewer/coordinator lines added or replaced, defects that escaped automated gates, and whether the agent made any self-correction before review. A failed-test or failed-tool-call self-correction is called out separately when it occurred. The review-impact rating is about the amount of corrective work, not whether review occurred:

| Rating | Meaning |
| --- | --- |
| R0 | Approved unchanged. |
| R1 | Comments or polish only; no behavior change. |
| R2 | One localized, non-contract correction with limited code or test change. |
| R3 | Any correction to approved behavior, an invariant, or previously missing required coverage. |
| R4 | Rejected or rebuilt because the core contract, scope, or implementation is wrong. |

Report `N/A (not measured)` rather than inventing a review-duration value. A packet whose automated gates pass can still be R3 or R4 when review finds a contract defect those gates did not cover.

#### CG-M3-02 — Checkbox

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `65bb2bb`. |
| Assigned / actual executor | Qwen (local) / Qwen (local), with coordinator completion after the one local correction stalled. |
| Final code ownership | Qwen retained 170 of 245 changed lines (69%); coordinator wrote 75 lines (31%). |
| Estimate / actual size | 90–130 / 245 changed lines. The estimate was exceeded; future reusable controls use the shared choice-control invariants. |
| Local elapsed time | 13 min 29 sec across the initial result and its stalled correction. |
| Rework and review | One local correction returned no commit and escalated. Two coordinator follow-up commits; first independent review requested changes, renewed review approved. |
| Misses caught before acceptance | Live uncontrolled state, native reset synchronization, Field-native required propagation, and the controlled/uncontrolled prop conflict. |
| Verification | Focused Checkbox tests 9/9, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Real-browser toggle, reset, focus, and accessibility behavior; CG-M3-24 owns it. |

The local agent correctly held its two-file path boundary but silently inferred reusable-control conventions instead of reporting them as missing. This is a protocol finding, not only an implementation defect.

#### CG-M3-03 — Switch

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `ea9f247`. |
| Assigned / actual executor | Qwen (local) / Qwen (local), with one coordinator semantic-boundary correction. |
| Final code ownership | Qwen retained 246 of 253 changed lines (97%); coordinator wrote 7 lines (3%). |
| Estimate / actual size | 80–110 / 253 changed lines. This is a material forecast variance. |
| Local elapsed time | 244 sec (4 min 4 sec) across initial work and the commit-only correction. |
| Rework and review | The initial handoff omitted the required commit; its one local correction created it without changing source. First independent review found a consumer role-override escape; coordinator fixed it and renewed review approved. |
| Verification | Focused Switch tests 10/10, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Real-browser Switch toggle, reset, focus, and accessibility behavior; CG-M3-25 owns it. |

Qwen followed the new shared-control behavior rules in the returned source, but it again required a commit-only correction and exceeded the planned size. The fixed semantic role boundary was caught before acceptance.

#### CG-M3-04 — RadioGroup

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `b76a26a`. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: all 322 changed lines. |
| Estimate / actual size | 220–300 / 322 changed lines. Slightly over the forecast; no local-routing target applies to this coordinator contract packet. |
| Implementation elapsed time | 5 min 19 sec from first source commit through the accepted correction. Contract design/review time is separately represented by PR #25. |
| Rework and review | Contract review requested two successive clarification rounds before approving PR #25. Source review requested two corrections: disabled/missing controlled selection plus runtime semantic escaping, then required behavior under effective disabled state. Renewed source review approved. |
| Verification | Focused RadioGroup tests 9/9, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Live native-radio keyboard, reset, focus, and accessibility behavior; CG-M3-26 owns it. |

This packet proves the value of recording a complete public contract before code: every reported defect was resolved inside the bounded RadioGroup directory before acceptance.

#### CG-M3-05 — Search

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `2d910d8`. |
| Assigned / actual executor | Qwen (local) / Qwen (local) attempted, then Codex coordinator (cloud) completed the packet. |
| Final code ownership | Coordinator retained all 337 accepted lines; Qwen retained 0 lines because its run produced no source or commit. |
| Estimate / actual size | 100–140 / 337 changed lines. This materially exceeded the local-routing forecast. |
| Local elapsed time | 3 min 57 sec of recorded OpenCode activity, ending after exploration with no subsequent tool action, source, or commit. |
| Rework and review | Two coordinator corrections: the first independent review found uncontrolled native-value clearing, runtime semantic/hook escaping, and disabled/read-only defects; renewed review found an accidental public helper export. Final independent review approved. |
| Verification | Focused Search tests 7/7, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Real-browser typing, clear/callback order, native reset, focus, keyboard, and responsive behavior; CG-M3-27 owns it. |

The packet’s contract was clear, but its 337-line implementation plus live uncontrolled-state behavior exceeded the current Qwen envelope. Keep Search-like stateful input controls coordinator-owned unless a future benchmark shows reliable bounded completion.

#### CG-M3-07 — Banner

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `87748b3`. |
| Assigned / actual executor | Qwen (local) / Qwen (local) authored the first scoped commit; its one correction made no commit, so Codex coordinator (cloud) completed the named repair and the component-test capability decision. |
| Final code ownership | Qwen retained 313 of 476 Banner source/test/export lines (66%); coordinator retained 163 lines. The jsdom dependency and lockfile are excluded from this code-bearing attribution. |
| Estimate / actual size | 100–140 / 476 Banner source/test/export lines. The forecast was materially exceeded, primarily because the accepted contract requires executable open-state transitions. |
| Local elapsed time | Initial authoring duration: N/A (not captured). Permitted correction: 5 min 20 sec recorded OpenCode activity; it ended without a required commit. |
| Rework and review | Coordinator source review found missing section labelling and Control Base/Group size/disabled behavior. Qwen's correction attempted a blocked subagent call, then imported an uninstalled test library and did not commit; it was stopped. The coordinator repaired the contract. First independent review requested executable dismiss/restore/refusal coverage; the coordinator added a per-file jsdom environment and live component checks. Renewed independent review approved. |
| Review impact | `R4` — local result and correction did not satisfy the core component contract; coordinator repair and test-harness escalation were required. |
| Misses caught before acceptance | Accessible name relationship, Group/Control Base state, component-owned `data-open` spread collision, and absent live open-state coverage. |
| Verification | Banner checks 25/25, TypeScript, static check, production build, scope check, and diff check passed. Independent review approved `87748b3`. |
| UNTESTED | Real-browser dismissal, controlled restore, focus behavior, long-content layout, and responsive behavior; CG-M3-29 owns them. |

This packet added the durable local-agent rule that a dispatch names its available test harness. An agent must report a missing capability rather than importing a new test library or changing dependencies.

#### CG-M3-08 — Toast

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `b1594e0`. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: all 338 Toast source/test/export lines. |
| Estimate / actual size | 100–140 / 338 source/test/export lines. The forecast did not include the full live lifecycle coverage required for an announcement control. |
| Implementation elapsed time | 1 min 45 sec from recorded preflight through source commit. |
| Rework and review | No implementation rework. Independent review returned `APPROVE` on the submitted head. |
| Review impact | `R0` — approved unchanged. |
| Verification | Toast checks 10/10, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Real-browser announcement, close/focus, bounded-repeat, long-content, and responsive behavior; CG-M3-30 owns them. |

Toast intentionally adds no provider, queue, portal, stacking, timeout, hover-pause, or auto-dismiss behavior. It uses the per-file jsdom capability introduced by Banner to execute lifecycle tests without changing the global Vitest environment.

#### CG-M3-09 — EmptyState

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `1ce0a0f`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`, followed by Codex coordinator (cloud) for the post-review semantic-boundary repair. |
| Final code ownership | Qwen retained the original component, tests, and export; the coordinator added 27 final source/test lines for the stable-semantics refusal boundary. Final packet size: 254 source/test/export lines. |
| Estimate / actual size | 50–80 / 254 source/test/export lines. The forecast materially understated the required public-boundary and regression coverage. |
| Local elapsed time | 4 min 32 sec from initial commit `e2f1cb4` through the permitted local correction `fb31ff0`; its initial dispatch included substantial context-reading time. |
| Rework and review | Qwen's initial commit invented a disabled API; its one correction removed it and added a regression assertion. Independent review then found that a consumer could supply `aria-live`, violating the stable non-live contract. With the local correction budget used, the coordinator stripped type/runtime live, busy, alternate-label, loading, and open-state escapes and added cast-based regression coverage. Renewed review approved. |
| Review impact | `R3` — independent review caught a required semantic/refusal invariant after the local correction; coordinator repair was narrow and retained the local component. |
| Misses caught before acceptance | Unsupported disabled API; consumer live-region, busy, alternate accessible-name, loading, and open-state escapes. |
| Verification | EmptyState checks 10/10, TypeScript, static check, production build, scope check, and diff check passed. Independent review approved `1ce0a0f`. |
| UNTESTED | Gallery recovery flow and real-browser semantic, action, long-content, and responsive proof; CG-M3-19 and CG-M3-31 own them. |

#### CG-M3-10 — LoadingSkeleton

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `2ef245b`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` authored a contained draft but timed out without its required commit; Codex coordinator (cloud) completed the implementation and review repairs. |
| Final code ownership | Approximately 293 of 342 source/test/export lines retain Qwen-authored draft content; the coordinator added the export, fixed Control Base loading state, and retained the post-review public/runtime root-semantic guards. The accepted execution owner is the coordinator because the local handoff failed. |
| Estimate / actual size | 70–100 / 342 source/test/export lines. The forecast materially understated required invalid-input, fixed-hook, and reduced-motion regression coverage. |
| Local elapsed time | 7 min 50 sec recorded activity, from 2026-08-27T19:52:10-04:00 until the runner was stopped with no required commit. |
| Rework and review | No local correction was allowed because the initial local result did not commit. The coordinator completed the contained draft. First independent review found consumer `data-skeleton-bar`, `aria-hidden`, `autoFocus`, and `contentEditable` escapes on the required status root. Renewed review then found the missing public `data-skeleton-bar?: never` refusal. Final renewal approved. |
| Review impact | `R4` — the local execution failed its required handoff and the coordinator had to own completion; independent review caught two required root-semantics invariants. |
| Misses caught before acceptance | Missing commit; consumer bar-hook, root hiding, focus, editability, and public bar-hook type escapes. |
| Verification | LoadingSkeleton checks 15/15, TypeScript, static check, production build, scope check, and diff check passed. Independent review approved `2ef245b`. |
| UNTESTED | Gallery loading flow and real-browser busy semantics, reduced-motion, long-content, and responsive proof; CG-M3-20 and CG-M3-32 own them. |

#### CG-M3-11 — Button gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `7095423`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 68 added lines in `ButtonExamples.tsx`; the coordinator changed no example source. |
| Estimate / actual size | 70–110 / 68 added lines. |
| Local elapsed time | About 3 minutes 15 seconds from the successful post-export dispatch through the committed correction. The earlier attempt was stopped before a legal public import existed and produced no accepted source. |
| Rework and review | Initial commit `0c73401` passed gates. Independent review found that the proposed long label was only 24 characters. Qwen's one permitted correction `7095423` made it a 114-character label and updated the matching status text. Renewed independent review returned `APPROVE`. |
| Review impact | `R3` — review found missing required long-label coverage; the localized correction was made by the local agent. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (focused component tests belong to Button; rendered gallery integration and real browser activation, loading/disabled, long-label, and responsive proof remain CG-M3-22 and CG-M3-23). |

#### CG-M3-12 — Checkbox gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `daa22f3`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 79 added lines in `CheckboxExamples.tsx`; the coordinator changed no example source. |
| Estimate / actual size | 70–100 / 79 added lines. |
| Local elapsed time | 2 minutes 5 seconds from dispatch to required commit. |
| Rework and review | No rework. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (rendered gallery integration belongs to CG-M3-22; real Checkbox pointer, keyboard, reset, focus, and responsive proof belongs to CG-M3-24). |

#### CG-M3-13 — Switch gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `2f550f8`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 79 added lines in `SwitchExamples.tsx`; the coordinator changed no example source. |
| Estimate / actual size | 70–100 / 79 added lines. |
| Local elapsed time | 3 minutes 23 seconds from dispatch to required commit. |
| Rework and review | No rework. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (rendered gallery integration belongs to CG-M3-22; real Switch pointer, keyboard, reset, focus, and responsive proof belongs to CG-M3-25). |

#### CG-M3-14 — RadioGroup gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `cc69558`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`, then coordinator review repair. |
| Final code ownership | Qwen: 99 added example lines; coordinator: 2 added and 1 replaced line to report the visible selected label rather than the internal option key. |
| Estimate / actual size | 80–120 / 102 changed lines. |
| Local elapsed time | About 6 minutes 8 seconds across the first result and its required commit-only correction. |
| Rework and review | The initial local result stopped without a commit; its one correction committed unchanged source. Independent review then found that the controlled status showed `basic` rather than visible `Basic`; the coordinator repaired it and renewed review returned `APPROVE`. |
| Review impact | `R3` — review corrected the required observable status behavior. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed before and after the coordinator correction. |
| UNTESTED | N/A (rendered gallery integration belongs to CG-M3-22; real RadioGroup keyboard, selection, reset, focus, and responsive proof belongs to CG-M3-26). |

#### CG-M3-15 — Search gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `1bb3f57`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 50 added lines in `SearchExamples.tsx`; the coordinator changed no example source. |
| Estimate / actual size | 80–120 / 50 added lines. |
| Local elapsed time | About 6 minutes 59 seconds across the initial result and its required commit-only correction. |
| Rework and review | The initial local result stopped without a commit; its one correction committed unchanged source. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (rendered gallery integration belongs to CG-M3-22; real Search query, clear, focus, and responsive proof belongs to CG-M3-27). |

#### CG-M3-16 — StatusChip gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `51890ed`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 39 added lines in `StatusChipExamples.tsx`; coordinator: no source lines. |
| Estimate / actual size | 40–70 / 39 added lines. |
| Local elapsed time | N/A (not captured across the initial run and commit-only correction). |
| Rework and review | Initial result omitted its commit; one commit-only correction succeeded. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (gallery integration is CG-M3-22; browser semantics, long-label, and adjacent-flow proof is CG-M3-28). |

#### CG-M3-17 — Banner gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `f8ff47d`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`, then coordinator repair. |
| Final code ownership | Qwen: 58 initial lines; coordinator: 10 added and 8 replaced lines for the restore-state correction. |
| Local elapsed time | N/A (not captured across initial run and commit-only correction). |
| Rework and review | Initial result omitted its commit; one commit-only correction succeeded. Review found Restore available while already open and an inaccurate rendered-state claim; coordinator repair passed renewed review. |
| Review impact | `R3` — required state/outcome behavior corrected. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (gallery integration is CG-M3-22; real-browser dismiss, restore, focus, long-content, and responsive proof is CG-M3-29). |

#### CG-M3-18 — Toast gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `be4cce2`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`, then coordinator repair. |
| Final code ownership | Qwen: 51 initial lines; coordinator: 3 replacement lines. |
| Local elapsed time | N/A (not captured across initial run and commit-only correction). |
| Rework and review | Initial result omitted its commit; one commit-only correction succeeded. Review required a materially long description and removal of a competing implicit live `output`; coordinator repair passed renewed review. |
| Review impact | `R3` — required announcement and long-content behavior corrected. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (gallery integration is CG-M3-22; real-browser announcement, close, focus, repeat, long-content, and responsive proof is CG-M3-30). |

#### CG-M3-19 — EmptyState gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `506de11`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 33 added lines; coordinator: no source lines. |
| Local elapsed time | N/A (not captured). |
| Rework and review | No rework. The first attempt made the required commit; independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (gallery integration is CG-M3-22; real-browser recovery, long-content, and responsive proof is CG-M3-31). |

#### CG-M3-20 — LoadingSkeleton gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `d6c44f1`. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b`. |
| Final code ownership | Qwen: all 30 added lines; coordinator: no source lines. |
| Local elapsed time | N/A (not captured across initial run and commit-only correction). |
| Rework and review | Initial result omitted its commit; one commit-only correction succeeded. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | N/A (gallery integration is CG-M3-22; real-browser busy, reduced-motion, long-label, and responsive proof is CG-M3-32). |

### Qwen 3.8 isolated M3 replay — CG-M3-02 through CG-M3-04, 2026-08-27

**Status:** Owner-requested benchmark only. Each run used a detached historical worktree and was kept out of the accepted M3 branch, issue checklist, Atlas status, and product source. The runtime was OpenCode 1.18.21 / Ollama `qwen3.8:27b`; before dispatch it was resident at 65,536 context and 100% GPU. The protocol was the same bounded-path gate used for Qwen 3.6: focused tests, TypeScript, static check, production build, required commit, coordinator source review, and at most one coordinator-issued correction.

| Packet | Historical base | Actual agent/model | Files changed | Recorded elapsed time | Review / rework | Failed-tool self-recovery | Verification result | UNTESTED | Benchmark outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CG-M3-02 Checkbox | `4c7b8ec` | OpenCode 1.18.21 / Ollama `qwen3.8:27b` | Three allowed Checkbox files, 175 added lines; initial commit `5d91ea7` | 15m 00s: initial 11m 31s; one correction session 3m 29s | One coordinator source-review round found missing live uncontrolled `data-checked`/reset synchronization and a missing public `role` refusal. Its only correction reread context but made no file change or commit. | Yes. The initial test wrongly expected SSR `defaultChecked` markup; Qwen recognized React emits `checked`, corrected the assertion, and completed its own gates without a coordinator message. | Qwen reported 7/7 focused checks, TypeScript, static, build, scope, and commit PASS. Coordinator source review rejected the result for the two contract misses. Browser proof belongs to CG-M3-24. | 1 | stopped / rejected; no benchmark code accepted |
| CG-M3-03 Switch | `92bd549` | OpenCode 1.18.21 / Ollama `qwen3.8:27b` | Two allowed Switch files, 258 added lines; commits `8a54aee`, `da3f3e1` | 7m 56s: initial 6m 16s; correction 1m 40s | One coordinator source-review round required an explicit public `role?: never` refusal and matching type assertion; correction changed only those two lines. | Partial. Before a tool run, Qwen noticed that its proposed `role="checkbox"` test contradicted the prop boundary and removed it. It did not recover from a failed tool call. | Coordinator reran focused Switch tests 10/10, TypeScript, static check, production build, and scope/diff checks: PASS. Browser proof belongs to CG-M3-25. | 1 | accepted benchmark result; not merged into product source |
| CG-M3-04 RadioGroup | `7a7d4ab` | OpenCode 1.18.21 / Ollama `qwen3.8:27b` | none | 1m 57s of recorded OpenCode activity; the process then emitted no further work and was stopped | No source review or correction was applicable because no diff or commit existed. | No. | Baseline preflight had passed before dispatch; no Qwen-authored source exists to test. CG-M3-26 remains the real-browser owner. | 9 | stopped; no source change |

**Result:** Qwen 3.8 completed one of three replayed packets. It showed useful local self-correction on the Checkbox test assertion, but did not reliably carry the documented reusable-control contract through source review and made no RadioGroup implementation attempt. The Switch is a strong bounded-control result, but its 258 added lines again materially exceed the 80–110-line packet forecast. This benchmark does not change the current routing decision: use Qwen only under exact paths, required commits, the full gate set, source review, and a strict one-correction escalation rule.

**Comparison boundary:** Qwen 3.6's production CG-M3-02 result took 13m 29s and required coordinator completion; its CG-M3-03 result took 4m 04s and retained 246 of 253 accepted lines. CG-M3-04 was coordinator-owned, so there is no Qwen 3.6 local RadioGroup run to compare. The replay is evidence about the local runtime, not an attribution change to accepted M3 code.

### CG-M3-01 dispatch forecast

| Packet | Planned executor/runtime | Code-bearing paths | Estimated changed lines | Why local or cloud | Preflight command and expected result | Actual executor/runtime at dispatch | Preflight result and timestamp | Maximum corrections |
| --- | --- | --- | ---: | --- | --- | --- | --- | ---: |
| CG-M3-01 | Codex coordinator (cloud) | `packages/react/src/actions/button/**` | 110–140 | Cloud: shared Button contract establishes the reusable API that later examples and browser checks consume. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS | Codex coordinator (cloud) | PASS — 2026-08-27T02:45:00-04:00 | N/A (coordinator-owned contract packet) |
| CG-M3-01.1 | Codex coordinator (cloud) | `packages/tokens/src/skins/default.css` | 30–50 | Cloud: one shared default-skin file must stay coordinator-owned. | `npm exec vitest run packages/react/src/actions/button && npm exec tsc -- --noEmit && npm run build` → PASS | Codex coordinator (cloud) | PASS — 2026-08-27T02:50:50-04:00 | N/A (coordinator-owned skin packet) |
| CG-M3-02 | Qwen (local) | `packages/react/src/inputs/choice/checkbox/**` | 90–130 | Local: one native-control behavior with an exact, independent directory and existing M2 contract. | `npm exec tsc -- --noEmit && npm run build` → PASS; returned packet must also run its focused Checkbox test. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T02:53:51-04:00 | 1 |
| CG-M3-03 | Qwen (local) | `packages/react/src/inputs/choice/switch/**` | 80–110 | Local: one native Switch that applies the recorded shared choice-control invariants without creating an API. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet must also run focused Switch tests. | Qwen (local) | PASS — 2026-08-27T03:29:20-04:00 | 1 |
| CG-M3-04 | Codex coordinator (cloud) | `packages/react/src/inputs/choice/radio-group/**` | 220–300 | Cloud: RadioGroup establishes the shared selection and roving-keyboard contract that its examples and browser checks consume. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS before implementation. | Codex coordinator (cloud) | Pending recorded-contract review | N/A |
| CG-M3-04.1 | Codex coordinator (cloud) | M3 contract records only | 120–180 | Cloud: the missing API/state/accessibility decisions must be explicit before any local source packet can start. | Markdown authority review and `git diff --check` → PASS | Codex coordinator (cloud) | PASS — independent contract review approved the recorded Search and feedback boundaries | N/A |
| CG-M3-04.2 | Codex coordinator (cloud) | `packages/tokens/src/skins/default.css` | 90–140 | Cloud: shared skin selectors cannot be safely split across feedback controls. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS before implementation. | Codex coordinator (cloud) | PASS — 2026-08-27T11:41:14-04:00; providers 2/2, TypeScript, static check, build, selector scan, and independent review approved | N/A |
| CG-M3-05 | Qwen (local) | `packages/react/src/inputs/search/**` | 100–140 | Local: one native Search field after its exact contract and shared skin are accepted. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs focused Search checks. | Qwen (local), then Codex coordinator (cloud) | PASS — 2026-08-27T11:55:48-04:00; focused Search 7/7, TypeScript, static check, build, scope/diff checks, and independent review approved | 1 |
| CG-M3-06 | Qwen (local) | `packages/react/src/feedback/status-chip/**` | 50–80 | Local: one static advisory-status component with no shared infrastructure. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs focused StatusChip checks. | UNSET | UNSET | 1 |
| CG-M3-07 | Qwen (local) | `packages/react/src/feedback/banner/**` | 100–140 | Local: one bounded persistent feedback component after the open-state contract is explicit. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs focused Banner checks. | UNSET | UNSET | 1 |
| CG-M3-08 | Codex coordinator (cloud) | `packages/react/src/feedback/toast/**` | 100–140 | Cloud: Toast owns the milestone's live-message and lifecycle boundary. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS before implementation. | Codex coordinator (cloud) | PASS — 2026-08-27T19:10:52-04:00 | N/A |
| CG-M3-09 | Qwen (local) | `packages/react/src/feedback/empty-state/**` | 50–80 | Local: one static semantic recovery component. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs focused EmptyState checks. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T19:37:12-04:00 | 1 |
| CG-M3-10 | Qwen (local) | `packages/react/src/feedback/loading-skeleton/**` | 70–100 | Local: one bounded indeterminate loading component after shared skin rules exist. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs focused LoadingSkeleton checks. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T19:50:27-04:00 | 1 |
| CG-M3-11 | Qwen (local) | `apps/lab/src/examples/actions/button/**` | 70–110 | Local: one independently rendered Button-example directory with the accepted Button contract. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; returned packet also runs any focused example checks it adds. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T20:10:56-04:00, after the public-export prerequisite | 1 |
| CG-M3-12 | Qwen (local) | `apps/lab/src/examples/choices/checkbox/**` | 70–100 | Local: one independently rendered Checkbox-example directory using the accepted Checkbox and public Field/Group contracts. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the later gallery-integration/browser packets own rendered and browser specifications. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T20:19:01-04:00, after the public-export prerequisite | 1 |
| CG-M3-13 | Qwen (local) | `apps/lab/src/examples/choices/switch/**` | 70–100 | Local: one independently rendered Switch-example directory using the accepted Switch and public Field/Group contracts. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the later gallery-integration/browser packets own rendered and browser specifications. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T20:24:09-04:00, after the public-export prerequisite | 1 |
| CG-M3-14 | Qwen (local) | `apps/lab/src/examples/choices/radio-group/**` | 80–120 | Local: one independently rendered RadioGroup-example directory using the accepted public RadioGroup, Field, and Group contracts. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the later gallery-integration/browser packets own rendered and browser specifications. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T20:28:47-04:00, after the public-export prerequisite | 1 |
| CG-M3-15 | Qwen (local) | `apps/lab/src/examples/choices/search/**` | 80–120 | Local: one independently rendered Search-example directory applying the approved fixed-local-list gallery contract. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; GalleryApp integration and browser specifications remain later packets. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-27T20:36:54-04:00, after the public-export prerequisite | 1 |
| CG-M3-16 | Qwen (local) | `apps/lab/src/examples/feedback/status-chip/**` | 40–70 | Local: one static StatusChip-example directory using every approved tone and plain-text outcome. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; GalleryApp integration and browser specifications remain later packets. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T00:14:23-04:00, after the public-export prerequisite | 1 |
| CG-M3-17 | Qwen (local) | `apps/lab/src/examples/feedback/banner/**` | 70–110 | Local: one controlled Banner example that visibly dismisses and restores under the accepted lifecycle contract. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; GalleryApp integration and browser specifications remain later packets. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T00:25:40-04:00, after the public-export prerequisite | 1 |
| CG-M3-18 | Qwen (local) | `apps/lab/src/examples/feedback/toast/**` | 60–100 | Local: one controlled Toast example with manual close and restore under the single-toast contract. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T01:00:56-04:00 | 1 |
| CG-M3-19 | Qwen (local) | `apps/lab/src/examples/feedback/empty-state/**` | 40–70 | Local: one stable EmptyState example with an explicit recovery action. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T01:47:51-04:00 | 1 |
| CG-M3-20 | Qwen (local) | `apps/lab/src/examples/feedback/loading-skeleton/**` | 30–60 | Local: one static LoadingSkeleton example using approved lines and accessible label. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T02:31:15-04:00 | 1 |
| CG-M3-21 | Codex coordinator (cloud) | `packages/react/src/index.ts` | 10–20 | Cloud: public entry point is a shared package contract and must precede legal gallery imports. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS before implementation. | Codex coordinator (cloud) | PASS — 2026-08-27T20:09:07-04:00 | N/A |
| CG-M3-23 | Qwen (local) | `tests/actions/button/**` | 70–100 | Local: one isolated real-browser specification for the already accepted Button gallery. | `npm run test:browser && npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Button specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T09:59:37-04:00 | 1 |
| CG-M3-24 | Qwen (local) | `tests/choices/checkbox/**` | 70–100 | Local: one isolated real-browser specification for the already accepted Checkbox gallery. | `npm run test:browser && npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Checkbox specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T10:14:10-04:00 | 1 |
| CG-M3-25 | Qwen (local) | `tests/choices/switch/**` | 70–100 | Local: one isolated real-browser specification for the already accepted Switch gallery. | `npm run test:browser && npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Switch specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T10:23:31-04:00 | 1 |
| CG-M3-26 | Qwen (local) | `tests/choices/radio-group/**` | 90–130 | Local: one isolated real-browser specification for the accepted RadioGroup gallery and its documented keyboard/reset invariants. | `npm run test:browser && npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused RadioGroup specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T11:19:12-04:00 | 1 |
| CG-M3-27 | Qwen (local) | `tests/choices/search/**` | 80–120 | Local: one isolated real-browser specification for the accepted controlled Search gallery. | `npm run test:browser && npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Search specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T11:28:46-04:00 | 1 |
| CG-M3-28 | Qwen (local) | `tests/feedback/status-chip/**` | 60–90 | Local: one isolated real-browser specification for the accepted advisory StatusChip gallery. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused StatusChip specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T11:37:15-04:00 | 1 |
| CG-M3-29 | Qwen (local) | `tests/feedback/banner/**` | 90–130 | Local: one isolated real-browser specification for the accepted controlled Banner gallery. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Banner specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T11:46:01-04:00 | 1 |
| CG-M3-30 | Qwen (local) | `tests/feedback/toast/**` | 90–130 | Local: one isolated real-browser specification for the accepted controlled Toast gallery. | `npm exec tsc -- --noEmit && npm run check && npm run build` → PASS; the returned packet must also run its focused Toast specification. | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-28T11:59:26-04:00 | 1 |

CG-M3-01 is accepted at branch commit `2fb0008`: component checks 4/4, TypeScript, static check, production build, and diff check passed; independent review returned `APPROVE`. Default-skin visual distinction, gallery examples, public export, integration, and browser interaction remain owned by CG-M3-01.1, CG-M3-11, CG-M3-21, CG-M3-22, and CG-M3-23.

#### CG-M3-21 — Public exports

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `a572d47`. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: all 10 public-entry export lines. |
| Estimate / actual size | 10–20 / 10 lines. |
| Implementation elapsed time | 1 minute from verified preflight through source commit. |
| Rework and review | No implementation rework. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | React checks 132/132, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | N/A (public-entry contract; M3 gallery integration and browser packets own rendered-consumer proof). |

#### CG-M3-22 — Gallery integration

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `41e0d22`. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: all 28 added and 2 replaced lines in `GalleryApp.tsx`. |
| Implementation elapsed time | N/A (not separately captured). |
| Rework and review | No implementation rework. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | Ten real-browser control specifications remain CG-M3-23 through CG-M3-32. |

#### CG-M3-23 — Button browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `8d23376` after local-agent escalation. |
| Assigned / actual executor | Qwen (local) / Codex coordinator (cloud; local-agent takeover). |
| Final code ownership | Coordinator: all 113 added lines in `tests/actions/button/control-gallery-button.spec.ts`; Qwen: 0 accepted lines. |
| Estimate / actual size | 70–100 / 113 lines. |
| Implementation elapsed time | About 6 minutes 50 seconds of Qwen activity across the initial no-change run and its one no-change correction; coordinator implementation and verification elapsed time was not separately captured. |
| Rework and review | Qwen's initial run and one named correction both stopped without a file or commit, so no further local round was allowed. Coordinator's first focused run removed a nonexistent Button `data-focus-visible` assertion. Independent review then required exact `data-variant` assertions; renewed review returned `APPROVE`. |
| Review impact | `R3` — review added required browser coverage proving the actual four variant assignments. |
| Verification | Focused Chromium Button checks 5/5, full Chromium suite 18/18, TypeScript, static check, production build, scope check, and diff check passed. The first full preflight exposed stale broad M2 Field selectors after M3 integration; coordinator commit `c62f089` scoped those tests to their exact examples, then the suite passed. |
| UNTESTED | 0 within this packet; Button's component/ref/type contract remains covered by CG-M3-01 component checks. |

#### CG-M3-24 — Checkbox browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `c35bca7`. |
| Assigned / actual executor | Qwen (local) / Qwen (local), with one coordinator reviewer-required assertion. |
| Final code ownership | Qwen: 103 added lines in `tests/choices/checkbox/control-gallery-checkbox.spec.ts`; coordinator: 1 added assertion. |
| Estimate / actual size | 70–100 / 104 lines. |
| Implementation elapsed time | About 4 minutes 30 seconds from compact-contract dispatch through the committed correction; the coordinator's one-line review correction elapsed time was not separately captured. |
| Rework and review | Qwen's first draft passed four of five focused checks but omitted the required commit; its one correction raised the Tab bound from 16 to 40, passed gates, and committed. Independent review required reasserting `data-checked` after native reset; coordinator added it and renewed review returned `APPROVE`. |
| Review impact | `R3` — review added required uncontrolled reset-state coverage. |
| Verification | Focused Chromium Checkbox checks 5/5, full Chromium suite 23/23, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | 0 within this packet; Checkbox component type/ref/Field boundary remains covered by CG-M3-02 component checks. |

#### CG-M3-25 — Switch browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `f143fe1`. |
| Assigned / actual executor | Qwen (local) / Qwen (local). |
| Final code ownership | Qwen: all 105 added lines in `tests/choices/switch/control-gallery-switch.spec.ts`. |
| Estimate / actual size | 70–100 / 105 lines. |
| Implementation elapsed time | About 2 minutes from compact-contract dispatch through required commit. |
| Rework and review | No rework. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged. |
| Verification | Focused Chromium Switch checks 5/5, full Chromium suite 28/28, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | 0 within this packet; Switch component type/ref/Field boundary remains covered by CG-M3-03 component checks. |

#### CG-M3-26 — RadioGroup browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `456be6e`. |
| Assigned / actual executor | Qwen (local) / Qwen (local). |
| Final code ownership | Qwen: all 168 added lines in `tests/choices/radio-group/control-gallery-radio-group.spec.ts`. |
| Estimate / actual size | 90–130 / 168 lines. |
| Implementation elapsed time | About 5 minutes across initial implementation and one local correction. |
| Rework and review | Initial implementation and gates passed. Independent review required native `required` and `aria-required` proof on the first enabled uncontrolled radio; Qwen's one correction added it and renewed review returned `APPROVE`. |
| Review impact | `R3` — review added required native-form coverage. |
| Verification | Focused Chromium RadioGroup checks 7/7, full Chromium suite 35/35, TypeScript, static check, production build, scope check, and diff check passed. |
| UNTESTED | 0 within this packet; RadioGroup component type/ref/refusal boundary remains covered by CG-M3-04 component checks. |

#### CG-M3-27 — Search browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `5f2ebe7`. |
| Assigned / actual executor | Qwen (local) / Qwen (local). |
| Final code ownership | Qwen: all 109 added lines in `tests/choices/search/control-gallery-search.spec.ts`. |
| Estimate / actual size | 80–120 / 109 lines. |
| Implementation elapsed time | About 6 minutes across initial implementation and one local correction. |
| Rework and review | Initial implementation passed gates. Independent review required atomic live-status semantics, exact result and no-result status assertions, the component-owned clear hook, and the mobile label; Qwen made every requested change in its sole correction and renewed review returned `APPROVE`. |
| Review impact | `R3` — review strengthened live-region, exact-outcome, component-hook, and responsive-label coverage. |
| Verification | Focused Chromium Search checks 6/6, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet; Search component controlled/uncontrolled/reset/refusal behavior remains covered by CG-M3-05 component checks. |

#### CG-M3-28 — StatusChip browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `4a95ebf`. |
| Assigned / actual executor | Qwen (local) / Qwen (local). |
| Final code ownership | Qwen: all 111 added lines in `tests/feedback/status-chip/status-chip-gallery.spec.ts`. |
| Estimate / actual size | 60–90 / 111 lines. |
| Implementation elapsed time | About 5 minutes across initial implementation and one local correction. |
| Rework and review | Initial implementation passed gates. Independent review required traversal-wide Tab proof and the static `data-size="md"` hook; Qwen completed both requests in its sole correction and renewed review returned `APPROVE`. |
| Review impact | `R3` — review strengthened fixed-hook and keyboard non-interaction proof. |
| Verification | Focused Chromium StatusChip checks 5/5, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet; StatusChip type/ref/refusal behavior remains covered by CG-M3-06 component checks. |

#### CG-M3-29 — Banner browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `08a2f60`. |
| Assigned / actual executor | Qwen (local) / Qwen (local), with coordinator custody of its uncommitted correction. |
| Final code ownership | Qwen: all 149 accepted lines in `tests/feedback/banner/banner-gallery.spec.ts`; coordinator: commit custody only. |
| Estimate / actual size | 90–130 / 149 lines. |
| Implementation elapsed time | About 10 minutes across the initial implementation and one local correction. |
| Rework and review | Initial implementation passed gates. Review required native landmark/description, exact recovery cardinality, and complete restored hooks. Qwen made those source changes but omitted its required commit and briefly created temporary debug probes; the coordinator stopped the run, confirmed only the requested one-file diff remained, committed it, and renewed review returned `APPROVE`. |
| Review impact | `R3` — review strengthened semantic-landmark, exact recovery, and restored-contract coverage. |
| Verification | Focused Chromium Banner checks 6/6, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet; Banner component controlled/uncontrolled/refusal behavior remains covered by CG-M3-07 component checks. |

#### CG-M3-30 — Toast browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `0d99ceb`. |
| Assigned / actual executor | Qwen (local) / Codex coordinator (cloud; local handoff escalation). |
| Final code ownership | Qwen draft: 143 lines; coordinator retained the draft, repaired its focus selector and added one review-required Toast-owned-Dismiss assertion. |
| Estimate / actual size | 90–130 / 144 lines. |
| Implementation elapsed time | About 7 minutes local activity; coordinator completion time not separately captured. |
| Rework and review | Qwen stopped without the required commit after four of five focused checks passed. Coordinator repaired the exact target focus loop and committed. Review then required proof that Dismiss belongs to the Toast landmark while outside its live status; renewed review approved. |
| Review impact | `R3` — review strengthened announcement/action structural coverage. |
| Verification | Focused Chromium Toast checks 5/5, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet; Toast component lifecycle/refusal behavior remains covered by CG-M3-08 component checks. |

#### CG-M3-31 — EmptyState browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `d4f7a6c`. |
| Assigned / actual executor | Qwen (local) / Qwen (local). |
| Final code ownership | Qwen: 152 added lines in `tests/feedback/empty-state/empty-state-gallery.spec.ts`. |
| Estimate / actual size | 70–100 / 152 lines. |
| Rework and review | Review required generic role-override refusal and complete sole-interactive-descendant proof; Qwen completed both requests in its one correction and renewed review returned `APPROVE`. |
| Review impact | `R3` — semantic refusal and interaction-boundary coverage. |
| Verification | Focused Chromium 6/6, TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet. |

#### CG-M3-32 — LoadingSkeleton browser checks

| Measure | Result |
| --- | --- |
| Outcome | Accepted at M3 branch head `5e8f8e8`. |
| Assigned / actual executor | Qwen (local) / Qwen (local), with a two-line coordinator review correction. |
| Final code ownership | Qwen: 128 accepted lines; coordinator: 2 assertions. |
| Estimate / actual size | 70–100 / 130 lines. |
| Rework and review | Qwen added root-level `aria-live`/`aria-value*` refusal and native `progress` rejection in its one correction. Renewed review required `aria-valuetext`; coordinator added it, and final review approved. |
| Review impact | `R3` — strengthened all forbidden progress-semantic proof. |
| Verification | Focused Chromium 5/5; full Chromium 68/68; TypeScript, static check, production build, and diff check passed. |
| UNTESTED | 0 within this packet. |

### M3 milestone closeout

All 32 M3 packets are accepted and merged through PR #27 (`033c9e1`). Final independent milestone review returned `APPROVE`. Final verification: full Chromium 68/68, TypeScript, static check, production build, and diff check all passed. Owner feedback later identified a presentation QA escape; issue #30 records its visual-completion remedy, merged in PR #31. The owner accepted the final presentation on 2026-08-28. Milestone totals: 32 behavior packets plus 4 visual-completion packets; independent review is `APPROVE`; owner acceptance is `PASS`; the one post-merge presentation QA escape is resolved by PR #31.

### M3 visual-completion follow-up

#### CG-M3-V01 — Visual brief and review gate

| Measure | Result |
| --- | --- |
| Outcome | Accepted as the documented authority at `1559ffa`; it records the presentation boundary, visual brief, independent-review rubric, and owner-final-review sequence in issue #30 and the M3 feature records. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | N/A (documentation and controlled records only). |
| Implementation elapsed time | N/A (not separately captured). |
| Rework and review | No implementation rework. Independent rendered-evidence review is deliberately owned by CG-M3-V03 after a visual implementation exists. |
| Review impact | N/A (no rendered implementation in this packet). |
| Verification | JSON parse of `tracker/assignments.json` and `workstream.json`, plus `git diff --check`, passed before the authority-record commit. |
| UNTESTED | All rendered presentation criteria; CG-M3-V02 and CG-M3-V03 own implementation and independent visual evidence. |

#### CG-M3-V02 — Gallery presentation pass

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #31 at `8a6246e`; distinct presentation hierarchy and responsive gallery rhythm without public API, behavior, M4, or Front of House scope. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: all 253 additions and 21 deletions across `ExampleFrame.tsx`, `styles.css`, and `default.css`. |
| Implementation elapsed time | N/A (not separately captured). |
| Rework and review | Automated gates first caught a generic input selector overriding the invalid border; it was repaired before the passing full run. Impeccable then identified a side-tab accent, tight leading, overlong feedback prose, and colored hover glow; each was corrected before independent review. Independent review returned `APPROVE` unchanged. |
| Review impact | `R0` — approved unchanged; pre-review self-correction resolved all automated findings. |
| Verification | TypeScript, static check, production build, `git diff --check`, full Chromium 68/68, and Impeccable source/1440×900/390×844 scans passed. |
| UNTESTED | Owner final presentation acceptance only. |

#### CG-M3-V03 — Independent visual review

| Measure | Result |
| --- | --- |
| Outcome | Independent cloud reviewer returned `APPROVE` on exact source head `805f950`, now merged through PR #31. |
| Assigned / actual executor | Independent cloud visual reviewer / separate cloud reviewer. |
| Final code ownership | N/A (review-only packet). |
| Implementation elapsed time | N/A (review-only packet). |
| Rework and review | The reviewer inspected required full-gallery evidence at 1440×900, 1024×768, 768×1024, and 390×844 and focused Actions, Inputs, Feedback views. It found no R3/R4 presentation defect and requested no correction. |
| Review impact | `R0` — approved unchanged. |
| Verification | Reviewer confirmed scope stayed within the three declared V02 files and confirmed `git diff --check`; coordinator gates are recorded under V02. |
| UNTESTED | Owner final presentation acceptance only. |

#### CG-M3-V04 — Owner final presentation acceptance

| Measure | Result |
| --- | --- |
| Outcome | Owner accepted the final Control Gallery presentation on 2026-08-28; M3 is closed. |
| Assigned / actual executor | Owner / Owner. |
| Final code ownership | N/A (acceptance-only packet). |
| Implementation elapsed time | N/A (acceptance-only packet). |
| Rework and review | Owner reviewed the independently approved PR #31 result and required no further correction. |
| Review impact | `R0` — accepted unchanged. |
| Verification | Owner acceptance follows V02's passing TypeScript, static check, production build, full Chromium 68/68, Impeccable scans, and V03 independent `APPROVE`. |
| UNTESTED | 0. |

## M4

### M4 local-routing forecast

| Packet | Planned executor/runtime | Code-bearing paths | Estimated changed lines | Why local or cloud | Preflight command and expected result | Actual executor/runtime at dispatch | Preflight result and timestamp | Maximum corrections |
| --- | --- | --- | ---: | --- | --- | --- | --- | ---: |
| CG-M4-04 | Qwen / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `packages/react/src/overlays/popover/**` | 100–140 | One internal control in an already reviewed overlay contract; no shared foundation, export, gallery, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | Qwen / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | PASS — 2026-08-28T22:51:45-04:00 | 1 |
| CG-M4-09 | Qwen (local) / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `apps/lab/src/examples/overlays/drawer/DrawerExamples.tsx` | 70–110 | One independent gallery-example file consuming only the accepted public Drawer API; no shared control, export, integration, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | Remote OpenCode `maestro/Qwen-Code-Assistant` rejected after no diff/commit; local OpenCode 1.18.21 / Ollama `qwen3.6:27b` accepted | Remote and local preflight PASS — 2026-08-30 | 1 |
| CG-M4-10 | Qwen (local) / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `apps/lab/src/examples/overlays/popover/PopoverExamples.tsx` | 70–110 | One independent gallery-example file consuming only the accepted public Popover API; no shared control, export, integration, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | Remote OpenCode `maestro/Qwen-Code-Assistant` rejected once after no diff/commit; local OpenCode 1.18.21 / Ollama `qwen3.6:27b` accepted | Remote and local preflight PASS — 2026-08-30 | 1 |
| CG-M4-11 | Qwen (local) / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `apps/lab/src/examples/overlays/menu/MenuExamples.tsx` | 90–130 | One independent gallery-example file consuming only the accepted public Menu API; real command selection needs visible outcome but no shared control, export, integration, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-30 | 1 |
| CG-M4-12 | Qwen (local) / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `apps/lab/src/examples/navigation/tabs/TabsExamples.tsx` | 100–140 | One independent gallery-example file consuming only the accepted public Tabs API; matched composition and both state modes need visible outcomes but no shared control, export, integration, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-30 | 1 |
| CG-M4-13 | Qwen (local) / OpenCode 1.18.21 and Ollama `qwen3.6:27b` | `apps/lab/src/examples/navigation/card/CardExamples.tsx` | 50–80 | One independent gallery-example file consuming only the accepted inert Card API; no interaction, shared control, export, integration, or browser-test ownership. | `npm exec tsc -- --noEmit && npm run check && npm run build && git diff --check` → PASS | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | PASS — 2026-08-30 | 1 |

#### CG-M4-01 — Overlay foundation

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #32 at `02e497b`: internal `OverlayRoot` layer registry, valid-trigger restoration, and shared focus helpers only. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: 189 implementation lines and 168 test lines retained; no local-agent code. |
| Implementation elapsed time | 6m 20s from claim commit `7419156` to corrected source commit `4ab07ca`. |
| Rework and review | Initial independent review returned `REQUEST_CHANGES`: the helper checked only a literal `disabled` attribute and missed native disabled state inherited from a disabled fieldset. One coordinator correction changed the shared filter to `:disabled` and added the fieldset regression; renewed review returned `APPROVE`. |
| Review impact | `R3` — repaired a required focus invariant and missing regression coverage. |
| Verification | Focused foundation 6/6; full React suite 138/138; TypeScript, static check, production build, full Chromium 68/68, and diff check passed. |
| Automated-gate escape | Effective native disabled state inherited through a fieldset; the original focused test covered only a directly disabled button. |
| UNTESTED | New-overlay browser behavior is N/A for this packet: it renders no gallery-facing overlay. CG-M4-02 onward own those real-browser paths. |

#### CG-M4-02 — Dialog contract

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #33 at `2918929`: internal compound Dialog root, trigger, content, and close contract. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: 259 implementation/index lines and 133 test lines retained; no local-agent code. |
| Implementation elapsed time | N/A (not separately captured). |
| Rework and review | Three review rounds. Review first required runtime stripping for trigger/close and live focus-cycle/stale-trigger coverage; renewed review then found the stripping test mounted no unsafe components and requested repeat-open/native-close proof. The coordinator made two focused test/source corrections; final review approved. |
| Review impact | `R3` — strengthened runtime refusal and recovery/focus invariants. |
| Verification | Focused Dialog 5/5; full React suite 143/143; TypeScript, static check, production build, full Chromium 68/68, and diff check passed. |
| Automated-gate escape | Runtime role/style/class escapes and recovery cases were not fully exercised by the initial focused suite. |
| UNTESTED | New Dialog Chromium behavior is N/A for this packet: CG-M4-16 owns its gallery-facing browser specification. |

#### CG-M4-03 — Drawer

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #34 at `383a055`: internal compound Drawer root, trigger, content, and close contract. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` (local). |
| Final code ownership | Qwen: 252 implementation lines and 141 initial test lines retained. Coordinator: 15 Drawer regression-test lines retained; the 19-line foundation correction belongs to PR #35, not this Drawer packet. |
| Implementation elapsed time | 7m 14s from Qwen's initial authored commit time (22:38:19) to its required scoped commit (22:45:33), excluding coordinator verification and review. |
| Rework and review | Qwen's initial result was source-correctly scoped but returned without its required commit; its one correction ran the stated gates and committed without source change. Independent review returned `REQUEST_CHANGES` for an M4-01 shared-contract defect, not a Drawer-source defect. The coordinator repaired the foundation in separate PR #35, added the required Drawer regression after rebase, and renewed review returned `APPROVE`. |
| Review impact | `R3` — repaired a focus-recovery invariant and added default-open/no-capture coverage. |
| Verification | Focused Drawer 7/7; foundation plus Drawer 14/14; full React 151/151; TypeScript, static check, production build, full Chromium 68/68, and diff check passed. |
| Automated-gate escape | The initial focused suites did not cover an overlay that starts open without prior trigger capture; source review found the mismatch with the documented foundation contract. |
| Self-correction before review | No behavior self-correction. Qwen's only correction completed its missing required commit after running the gates. |
| UNTESTED | Drawer-specific gallery Chromium behavior is N/A in this source packet; CG-M4-09 and CG-M4-17 own that real-browser path. |

#### CG-M4-04 — Popover

| Measure | Result |
| --- | --- |
| Outcome | Escalated and merged in PR #36 at `e88bc5b`: internal non-modal native auto-Popover contract. |
| Assigned / actual executor | Qwen (local) / Qwen initial draft and one correction, followed by Codex coordinator (cloud) takeover. |
| Final code ownership | Coordinator: all 268 implementation and 364 test lines in the accepted commit, per the accepted-commit attribution rule. Qwen draft code was not accepted as a completed local packet because neither local run delivered its required passing commit. |
| Implementation elapsed time | Qwen initial attempt 12m 56s; Qwen correction 9m 54s; coordinator repair/review time not separately captured. |
| Rework and review | Qwen's first two-file draft was 655 lines, had 7/10 focused failures and five TypeScript errors, and lacked a commit. Its only correction reduced focused failures to 4/10 but again stopped without a commit. The coordinator repaired the remaining mechanics, then initial source review required real native re-show, no-initial-focus, and valid-trigger proofs. Renewed review approved. |
| Review impact | `R3` — closed controlled native-dismissal, focus, and recovery coverage gaps. |
| Size variance / exception | 632 accepted lines against a 100–140-line forecast (4.5× upper bound). The owner’s standing full-authority delegation permits this recorded coordinator escalation exception; it is not a local-routing success or a precedent for future packets, which retain the 40–140-line limit. |
| Verification | Focused Popover 10/10; full React 161/161; TypeScript, static check, production build, full Chromium 68/68, and diff check passed. |
| Automated-gate escape | Initial local report claimed no passing evidence; coordinator found seven focused failures and five TypeScript errors. After takeover, source review found three missing behavioral proofs despite passing gates. |
| Self-correction before review | Qwen correction repaired the controlled/refusal/Tab tests but left native-toggle failure and no required commit. |
| UNTESTED | Real Popover light/outside-dismissal and recovery in the gallery browser are N/A for this source packet; CG-M4-10 and CG-M4-18 own that behavior. |

#### CG-M4-05 — Menu

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #38 at `3dcd8f9`: internal compound Menu keyboard and dismissal contract. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: 119 implementation lines and 231 focused-test lines retained; no local-agent code. |
| Implementation elapsed time | 3m 43s from initial scoped source commit `b83f8a1` to final accepted source commit `8b8e16d`; the separately merged PR #37 foundation correction preceded the Menu rebase. |
| Rework and review | Two Menu correction commits and three independent review rounds. First review required stale-trigger, Space, exact roving-state, and outside-close proof; renewed review required immediate refusal of a non-function controlled callback; final review approved. |
| Review impact | `R3` — closed recovery, keyboard, and runtime-refusal proofs absent from the first passing gate. |
| Verification | Focused Menu 8/8; full React suite 170/170; TypeScript, static check, production build, full existing Chromium 68/68, and diff check passed. |
| Automated-gate escape | The initial full gate did not prove stale-trigger recovery, Space activation, post-movement roving state, outside close removal, or non-function controlled callback refusal; independent review found all five. |
| UNTESTED | Real Menu gallery Chromium behavior is N/A in this internal source packet; CG-M4-11 and CG-M4-19 own that path. |

#### CG-M4-06 — Tabs (first local attempt; not accepted)

| Measure | Result |
| --- | --- |
| Outcome | Rejected before review. Qwen stopped without the required commit or focused test file; no source from this attempt is accepted. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` at 65,536 context and 100% GPU. |
| Files changed | One uncommitted allowed-path draft only: `packages/react/src/navigation/tabs/tabs.tsx` (6,985 bytes). |
| Implementation elapsed time | Approximately 10 minutes from dispatch; the runner did not provide a successful completion handoff. |
| Rework and review | 0 / 0. The packet's no-commit escalation rule prevents a correction of this full-packet attempt. |
| Verification | Baseline TypeScript, static check, production build, and diff preflight passed before dispatch. Qwen did not produce a test file, required commit, or acceptable post-change gate evidence. |
| Automated-gate escape | N/A — the required post-change gates were not reached. Coordinator inspection found an empty render-time registry validation and unavailable registry references in the abandoned draft. |
| UNTESTED | All Tabs behavior is UNTESTED. The approved behavior will be re-sliced before another local dispatch. |

#### CG-M4-06.2 — Tabs compound rendering

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #43 at `5fe3231`: internal TabsRoot, TabsList, TabsTrigger, and TabsPanel rendering from the accepted Qwen-authored composition model. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). Qwen remains the executor for later suitable packets. |
| Final code ownership | Coordinator: 207 implementation lines and 230 focused-test lines retained across the two approved paths. |
| Implementation elapsed time | 36m 48s from coordinator claim commit `975a9d3` (02:00:05) to final source commit `f153410` (02:36:53), excluding post-merge record synchronization. |
| Rework and review | Five independent review rounds: four `REQUEST_CHANGES`, then `APPROVE`. Corrections added exact-one-list refusal, static ARIA/state refusal, controlled decline and delayed-acceptance focus handling, and an out-of-order controlled-parent race policy where the currently committed parent value is authoritative. |
| Review impact | `R3` — repaired controlled focus/selection invariants, composition topology, and public runtime/type refusal coverage. |
| Owner acceptance | Approved by the owner on 2026-08-29. |
| Verification | Focused Tabs 9/9; full React 191/191; TypeScript, static check, production build, full existing Chromium 68/68, and diff check passed on final head. |
| Automated-gate escape | Initial gates did not expose controlled-parent decline/delayed/out-of-order focus paths, static refusal of arbitrary `aria-*` and `data-selected`, or zero/multiple TabsList composition. Independent review added each as an executable regression. |
| UNTESTED | Real gallery Tabs behavior is N/A for this internal packet; CG-M4-12 and CG-M4-20 own its gallery and Chromium specification. |

#### CG-M4-07 — Card

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #45 at `308bba5`: internal semantic Card container. |
| Assigned / actual executor | Qwen (local) / Codex coordinator (cloud; local-agent takeover). |
| Final code ownership | Coordinator: 103 implementation/index lines and 118 test lines retained. Qwen's uncommitted draft is not accepted. |
| Implementation elapsed time | Qwen run: about 9 minutes before rejection. Coordinator implementation and review: about 17 minutes, excluding record synchronization. |
| Rework and review | Qwen was rejected before commit after a forbidden `npm install`. The coordinator rebuilt the packet. Three review rounds: two `REQUEST_CHANGES`, then `APPROVE`; corrections closed complete event/state/native-escape refusal, blank-content validation, and live mounted-DOM proof. |
| Review impact | `R3` — strengthened the inert-container contract, including native `inert`, `draggable`, and `popover` refusal. |
| Verification | Focused Card 8/8; final full React suite 199/199; TypeScript, static check, production build, and diff check passed. |
| Automated-gate escape | Static SSR checks alone did not prove handler refusal or forwarded-ref target; independent review required jsdom proof. |
| UNTESTED | Card gallery/browser behavior is N/A in this source packet: CG-M4-13 and CG-M4-21 own it. |

#### CG-M4-08 — Dialog gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #47 at `fb15e3e`: two bounded Dialog gallery examples. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` (local). |
| Final code ownership | Qwen: 87 retained example lines in `apps/lab/src/examples/overlays/dialog/DialogExamples.tsx`. |
| Implementation elapsed time | UNTESTED — the run start was not durably captured; the authored commit timestamp predates the recorded claim and is not valid elapsed-time evidence. |
| Rework and review | Qwen returned one scoped commit. One independent source-review round returned `APPROVE`; no rework. |
| Review impact | `R1` — review confirmed the packet's two real state paths, public import boundary, and compound nesting; no correction required. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the new Dialog examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on commit `88a22ed` before PR #47 merged. |
| Automated-gate escape | N/A — no post-gate defect was found in independent source review. |
| UNTESTED | Real Dialog gallery Chromium behavior is N/A in this packet; CG-M4-16 owns that browser specification. |

#### CG-M4-09 — Drawer gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #48 at `5dcc2e4`: two bounded Drawer gallery examples. |
| Assigned / actual executor | Qwen (local) / Remote OpenCode `maestro/Qwen-Code-Assistant` rejected, then local OpenCode 1.18.21 with Ollama `qwen3.6:27b` accepted. |
| Final code ownership | Local Qwen: 89 retained example lines in `apps/lab/src/examples/overlays/drawer/DrawerExamples.tsx`. Remote Qwen produced no source. |
| Implementation elapsed time | Remote: about 3 minutes to rejected no-diff return. Local: 3m 06s from prepared-worktree start (20:57:31) to scoped commit `0cda23a` (21:00:37), excluding review and record synchronization. |
| Rework and review | Remote return was rejected before a correction round because it had no diff or commit. Local Qwen returned one scoped commit. One independent source-review round returned `APPROVE`; local rework count: 0. |
| Review impact | `R0` — approved unchanged. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the new Drawer examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on `0cda23a` before PR #48 merged. |
| Automated-gate escape | N/A — no post-gate defect was found in independent source review. |
| UNTESTED | Real Drawer gallery Chromium behavior is N/A in this packet; CG-M4-17 owns that browser specification. |

#### CG-M4-10 — Popover gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #49 at `18bd608`: two bounded Popover gallery examples. |
| Assigned / actual executor | Qwen (local) / Remote OpenCode `maestro/Qwen-Code-Assistant` rejected once, then local OpenCode 1.18.21 with Ollama `qwen3.6:27b` accepted. |
| Final code ownership | Local Qwen: 87 retained example lines in `apps/lab/src/examples/overlays/popover/PopoverExamples.tsx`. Remote Qwen produced no source. |
| Implementation elapsed time | Remote: about 3 minutes to one rejected no-diff return. Local: 3m 11s from prepared-worktree start (21:09:11) to scoped commit `69e9487` (21:12:22), excluding review and record synchronization. |
| Rework and review | The remote return was rejected before a correction round because it had no diff or commit. Local Qwen returned one scoped commit. One independent source-review round returned `APPROVE`; local rework count: 0. |
| Review impact | `R0` — approved unchanged. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the new Popover examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on `69e9487` before PR #49 merged. |
| Automated-gate escape | N/A — no post-gate defect was found in independent source review. |
| UNTESTED | Real Popover outside/light-dismissal browser behavior is N/A in this packet; CG-M4-18 owns that browser specification. |

#### CG-M4-11 — Menu gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #50 at `bedbf96`: two bounded Menu gallery examples. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` (local). |
| Final code ownership | Local Qwen: 113 retained example lines in `apps/lab/src/examples/overlays/menu/MenuExamples.tsx`. |
| Implementation elapsed time | 4m 04s from prepared-worktree start (21:20:12) to scoped commit `0af6d40` (21:24:16), excluding review and record synchronization. |
| Rework and review | Qwen returned one scoped commit. One independent source-review round returned `APPROVE`; source rework count: 0. After that commit, Qwen made forbidden, uncommitted controlled-record edits; the coordinator stopped it and excluded them. |
| Review impact | `R0` for accepted source — approved unchanged. Process finding: implementation agents must return handoff facts rather than edit coordinator-owned records. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the new Menu examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on `0af6d40` before PR #50 merged. |
| Automated-gate escape | The existing agent prompt did not explicitly resolve the general handoff-append rule against coordinator-owned records; Qwen attempted false completion updates after its scoped commit. Those uncommitted changes were caught before PR creation. |
| UNTESTED | Real Menu gallery keyboard and dismissal behavior is N/A in this packet; CG-M4-19 owns that browser specification. |

#### CG-M4-12 — Tabs gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #51 at `6e92d47`: two bounded Tabs gallery examples. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` (local). |
| Final code ownership | Local Qwen: 79 retained example lines in `apps/lab/src/examples/navigation/tabs/TabsExamples.tsx`. |
| Implementation elapsed time | 4m 15s from prepared-worktree start (21:28:14) to scoped commit `92cf19f` (21:32:29), excluding review and record synchronization. |
| Rework and review | Qwen returned one scoped commit and a text-only handoff. One independent source-review round returned `APPROVE`; source rework count: 0. |
| Review impact | `R0` — approved unchanged. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the new Tabs examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on `92cf19f` before PR #51 merged. |
| Automated-gate escape | The initial agent read path misspelled the feature directory, then self-corrected before writing. The explicit coordinator-record prohibition prevented the M4-11 post-commit record-write escape. |
| UNTESTED | Real Tabs keyboard, focus, and responsive behavior is N/A in this packet; CG-M4-20 owns that browser specification. |

#### CG-M4-13 — Card gallery examples

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #52 at `01546c1`: one complete static Card example and one valid minimal Card example. |
| Assigned / actual executor | Qwen (local) / OpenCode 1.18.21 with Ollama `qwen3.6:27b` (local). |
| Final code ownership | Local Qwen: 40 retained example lines in `apps/lab/src/examples/navigation/card/CardExamples.tsx`. |
| Implementation elapsed time | 5m 06s from prepared-worktree start (21:35:01) to its final scoped commit `ce2533c` (21:40:07), excluding review and record synchronization. |
| Rework and review | Qwen returned the required scoped commit, then made one targeted local cleanup correction removing an unused type import. Initial independent review returned `COMMENT`; renewed review of the corrected head returned `APPROVE`. No behavior changed. |
| Review impact | `R1` — polish-only cleanup; the complete/minimal static Card behavior remained unchanged. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — owner has not yet reviewed the Card examples in the integrated gallery. |
| Verification | TypeScript, static check, production build, and diff check passed on `ce2533c` before PR #52 merged. |
| Automated-gate escape | The configured TypeScript gate did not flag the unused type import; independent source review caught it. |
| UNTESTED | Real Card browser semantics and responsive proof are N/A in this packet; CG-M4-21 owns them. |

#### CG-M4-15 — Gallery integration

| Measure | Result |
| --- | --- |
| Outcome | Merged in PR #53 at `d7fae94`: renders Dialog, Drawer, Popover, and Menu examples in Overlays, and Tabs and Card examples in Navigation. |
| Assigned / actual executor | Codex coordinator (cloud) / Codex coordinator (cloud). |
| Final code ownership | Coordinator: 19 added and 7 removed lines in `apps/lab/src/GalleryApp.tsx`. |
| Implementation elapsed time | 1m 24s from claim commit `de4af71` (21:46:26) to scoped source commit `4cbc188` (21:47:50), excluding verification, review, and record synchronization. |
| Rework and review | One independent source-review round returned `APPROVE`; no source rework. |
| Review impact | `R0` — approved unchanged. Review minutes: not separately captured. |
| Owner acceptance | UNTESTED — the newly integrated M4 gallery has not yet received owner review. |
| Verification | TypeScript, static check, production build, diff check, and full Chromium 68/68 passed on the accepted rerun. The first parallel full-suite run had one unrelated reduced-motion focus-test failure; its isolated five-test file and the accepted full rerun passed without source change. |
| Automated-gate escape | N/A — no post-gate implementation defect was found in independent review. |
| UNTESTED | M4-specific Dialog, Drawer, Popover, Menu, Tabs, and Card browser behavior remains owned by CG-M4-16 through CG-M4-21. |

## M5

Not started.
