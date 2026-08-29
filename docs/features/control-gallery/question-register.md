# Control Gallery — question register

| ID | Question | Status | Decision / next action | Affected milestone |
| --- | --- | --- | --- | --- |
| CG-Q01 | Should Foundry inherit Vennusign code or design authority? | resolved | No. Foundry remains independent; future conversion is separate. | all |
| CG-Q02 | Which Button variants are Core v1? | resolved | Primary, Secondary, Destructive, and Link. | M3 |
| CG-Q03 | Is the gallery static documentation or executable behavior? | resolved | It is an executable acceptance surface. | all |
| CG-Q04 | Does every contributor follow the Vennusign-derived engineering process? | resolved | Yes. `AGENTS.md` is mandatory regardless of assignment method. | all |
| CG-Q05 | What package-manager/runtime configuration will install and run the React/TypeScript workspace on the local agent box? | implementation prerequisite | The coordinator records the chosen, working command in M1 before M2 starts. This is setup, not a product-design decision. | M1 |
| CG-Q06 | What common API and state contract does every Foundry control expose? | resolved | Control Base owns the approved properties, inherited values, root `data-*` state vocabulary, shared accessibility behavior, and consumer-styling boundary in `decisions.md`. | M1–M5 |
| CG-Q07 | How do labels, locale, and Button text work in Core v1? | resolved | Ship `LocaleProvider`, the English catalog, and the approved Button category policy in M1/M3; `add` and `back` alone permit supplied labels. | M1, M3 |
| CG-Q08 | What is the skin source of truth and package identity? | resolved | Use `@foundry/react`, `@foundry/tokens`, and `packages/tokens/src/skins/default.css`; the repository skin is authoritative. | M1 |
| CG-Q09 | Which non-Core controls are committed now? | resolved | None. The approved candidates are post-Core roadmap items and require their own scoped feature records before implementation. | post-Core |
| CG-Q10 | What is the smallest safe API and accessibility contract for M3 Search and feedback controls? | resolved | CG-M3-04.1 defines native Search; advisory StatusChip; persistent Banner; one polite, manual Toast; semantic EmptyState; and indeterminate LoadingSkeleton. Popups, remote search, toast infrastructure, auto-dismiss, and progress values are deferred. | M3 |
| CG-Q11 | What token contract and governance are required before a future Front of House skin can be admitted? | planned | Post-Core issue #26 records the candidate token keys, `data-size` audit, and three required governance decisions. It must not start before M5 acceptance and must not import Vennusign source. | post-Core |
| CG-Q12 | How does Foundry decide that a functional gallery is visually presentation-ready? | resolved | M3's visual-completion gate requires a project-neutral visual brief, rendered evidence at four viewports, independent screenshot review with one bounded correction cycle, and then one owner-ready final presentation. | M3 follow-up |

No product or control-behavior questions are open for the currently planned M3 controls. The Front of House skin-contract proposal is parked for post-Core work in issue #26.
