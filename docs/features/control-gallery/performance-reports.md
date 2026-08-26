# Control Gallery — milestone performance reports

Create one completed section after each milestone. Record actual execution facts; do not replace a poor result with an assumed cause.

## Required per-packet record

| Packet | Assigned role | Intended type | Actual agent/model | Local or cloud | Files changed | Elapsed time | Review rounds | Rework count | Verification result | UNTESTED count | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

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

### M1 completion performance report — pending independent review

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
| CG-M1-04 | browser specifications | OpenCode 1.18.21 / Ollama `qwen3.6:27b` | Local | 161.0 s | 2 | 2 | First test programmatically focused the button; the returned test then used a generic outline assertion. A coordinator correction now asserts Foundry's exact solid 3px default-skin focus ring and 4px offset; the full TypeScript, foundation, static, build, and five-check Chromium gate passed. | 0 | accepted |

| Measure | Result |
| --- | --- |
| Milestone | M1 — Gallery foundation and test harness |
| Packets attempted / accepted / escalated | 10 / 10 / 0 |
| Local completion share | 7 of 10 packets (70%) |
| Total elapsed time | 702.0 s measured local execution; historical coordinator and CG-M1-03.1 timings were not captured. |
| Total review rounds and rework count | Two independent review rounds returned `REQUEST_CHANGES`: `d3bd907` needed a focus-contract assertion, then `feeb8a4` needed its controlled-record references corrected to the current PR head. The current PR #18 head awaits final review. Eight total rework rounds: five local packet-return corrections (including the historical bootstrap correction) and three coordinator corrections. |
| Build and browser-gate result | PASS: foundation 7/7, TypeScript, static check, build, and Chromium 5/5. |
| Independent-review decision and reviewed commit | `REQUEST_CHANGES` on `d3bd907`: the browser focus test accepted a user-agent outline. A renewed review of `feeb8a4` confirmed the behavior fix and gates but requested a controlled-record head-reference correction. Final review of the current PR #18 head is UNTESTED. |
| Owner-acceptance result | UNTESTED — requested after reviewed merge. |
| Total `UNTESTED` items | 2: independent review and owner acceptance. |
| Post-merge QA escapes | N/A — not merged. |
| Routing recommendation | Keep Qwen 3.6 only under the measured path-boundary, TypeScript, build, required-commit, coordinator-source-review, and one-correction gates. |

## M2

Not started.

## M3

Not started.

## M4

Not started.

## M5

Not started.
