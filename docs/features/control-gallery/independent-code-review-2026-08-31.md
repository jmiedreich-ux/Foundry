# Independent full-repository code review — 2026-08-31

## Review decision

`REQUEST_CHANGES`

| Field | Value |
| --- | --- |
| Repository | `jmiedreich-ux/Foundry` |
| Reviewed branch | `main` (the repository has no `master` branch) |
| Reviewed commit | `5e01f5a0d02c78ced41a915042b49dd8ffd666c9` |
| Scope | Entire tracked repository: production source, public contracts, tests, package configuration, deployment workflow, security posture, accessibility, and release readiness |
| Review mode | Read-only, independent reviewer pass followed by coordinator corroboration and targeted reproduction |
| Supplemental source | Owner-provided private Google Drive document `Foundry — Repo Review (2026-08-31)`, incorporated after source-level corroboration; its private URL is not published in this repository, and the document describes its own pass as skimmed and non-exhaustive |
| Provisional review impact | `R3` — the review identifies corrections to accepted behavior, accessibility invariants, and required coverage; architecture review may revise this classification |
| Code-change authority | None. This record authorizes no implementation, configuration, test, workflow, or controlled-decision change. |
| Next gate | Architecture disposition review |

This is a repository-wide review record, not a new design authority and not an implementation packet. Existing milestone acceptance is not silently reopened by this document. The architecture review must disposition every finding and state explicitly which accepted decisions, milestones, invariants, or release gates are affected.

## Supplemental-review reconciliation

The Google Drive review was treated as reviewer input, not accepted uncritically. Its claims were checked against the reviewed commit and the approved M4 contracts. The source has no Google Docs comment threads; all feedback is in the document body.

| Drive review item | Corroborated disposition |
| --- | --- |
| No CI gate | Confirmed independently; recorded as FCR-006. |
| Overlay duplication | Confirmed as a maintainability and future-drift risk, not by itself a behavior defect. Architecture must decide the shared abstraction boundary. |
| Sibling contract drift | The controlled-callback drift corroborates FCR-003. A narrower public-trigger boundary defect is recorded as FCR-010. |
| DialogClose and PopoverClose drop children | Confirmed and expanded to DrawerClose; recorded as FCR-009. |
| Controlled Popover re-show behavior | The mechanism is real, but it implements the explicit accepted M4 contract. Its flicker/desynchronization concern remains unproven in this environment and is an architecture challenge, not an escaped implementation finding. |
| Production prop-misuse throws | Runtime refusal is explicitly required by `AGENTS.md` and accepted control contracts. Development-only guarding would change policy; architecture must decide that policy before any edit. |
| Packaging contradiction | Confirmed; already recorded as the release-readiness finding. |
| Test balance | Partially confirmed. The missing canonical unit command and bad runner discovery are FCR-007. The claim that everything except foundation is Chromium-only is rejected: the scoped run found 24 passing Vitest component/validation files with 201 tests. |
| Tooling gaps | Absence of ESLint, Prettier, explicit `include`, `noUncheckedIndexedAccess`, and `verbatimModuleSyntax` is confirmed. These are hardening choices, not demonstrated defects; architecture must decide which are release gates. |
| README, LICENSE, MenuCloseProps, and React 19 forwardRef notes | Root README/LICENSE absence expands release readiness. The MenuCloseProps export shape and continued `forwardRef` use are consistency/maintenance observations without a demonstrated runtime or contract failure. |

## Confirmed findings

### FCR-001 — High — The public size contract has no visual effect

`ControlSize` publicly promises `sm`, `md`, and `lg`, and controls resolve inherited or explicit values. However, `controlStateAttributes()` does not emit `data-size`; Button, TextField, Select, Search, Checkbox, Switch, and RadioGroup either pass size to that size-blind helper or calculate and discard it. Components that manually emit `data-size` have no size-specific rules in the default skin.

Evidence:

- `packages/react/src/foundation/control-base.ts:1-2, 20-48, 51-61`
- `packages/react/src/actions/button/button.tsx:38-53`
- `packages/react/src/inputs/text-field/text-field.tsx:42-47, 71-77`
- `packages/react/src/inputs/choice/checkbox/checkbox.tsx:60-63, 123-128`
- `packages/react/src/inputs/choice/switch/switch.tsx:62-65, 126-131`
- `packages/tokens/src/skins/default.css:42-149, 161-163`

Impact: consumers receive identical visual sizing from `size="sm"`, `size="md"`, and `size="lg"`; the public contract is therefore inert. Existing tests prove some value resolution and hooks but do not prove distinct rendered sizes.

Required architecture disposition: decide the exact semantic and visual meaning of each size, whether every applicable control must expose a fixed resolved size hook, which skin tokens/rules own the distinction, and whether this reopens M2/M3/M4 acceptance or is assigned to the M5 cross-control gate.

### FCR-002 — High — The shared keyboard focus treatment fails non-text contrast

The focus ring is `#93c5fd`, used by both the default skin and gallery shell. Calculated WCAG contrast is:

- `1.80:1` against white;
- `1.68:1` against the Foundry canvas (`#f4f7fb`);
- `2.87:1` against the primary action blue (`#2563eb`).

Each is below the `3:1` non-text contrast threshold.

Evidence:

- `packages/tokens/src/skins/default.css:11, 22-25`
- `apps/lab/src/styles.css:36-41`
- `docs/features/control-gallery/done-ledger.md:12, 27` records tests that assert the exact low-contrast treatment.

Impact: keyboard focus can be difficult to perceive, and the current browser assertions preserve rather than detect the accessibility defect.

Required architecture disposition: choose a compliant single-color or two-color focus treatment against every supported adjacent surface, define the invariant centrally, and decide which accepted milestone evidence must be renewed.

### FCR-003 — High — Controlled Dialog and Drawer can become undismissable

Dialog and Drawer accept controlled `open` while leaving `onOpenChange` optional. In that state, internal close requests do not change state and the absent callback receives nothing. Escape is prevented, and the supplied close control makes the same no-op request.

Evidence:

- `packages/react/src/overlays/dialog/dialog.tsx:23-47, 49-64, 195-207, 225-247`
- `packages/react/src/overlays/drawer/drawer.tsx:23-49, 51-66, 198-210, 228-250`
- Popover and Menu already reject controlled use without a function callback, demonstrating the stronger established boundary.

Trigger: render `<DialogRoot open>` or `<DrawerRoot open>` without `onOpenChange`, then press Escape or activate the supplied close control.

Impact: the modal remains open with focus contained. This is a keyboard and accessibility trap accepted by the public type boundary.

Required architecture disposition: decide whether all controlled state-bearing controls share one mandatory change-callback invariant and whether the requirement must be enforced at both type and runtime boundaries.

### FCR-004 — Medium — Controlled Tabs retain a stale keyboard-focus request

After a keyboard selection commits, `keyboardRequestPending` is never cleared. Later parent-driven changes to the controlled value can therefore pull focus back into Tabs even after the user moved focus elsewhere.

Evidence:

- `packages/react/src/navigation/tabs/tabs.tsx:103-135`
- Targeted reproduction: accept a keyboard change from tab one to tab two, focus an external button, and have that button cause the parent to select tab three. The active element incorrectly becomes tab three instead of remaining on the external button.

Impact: controlled application updates can unexpectedly steal keyboard and assistive-technology focus.

Required architecture disposition: define when a pending keyboard focus request is consumed or cancelled and distinguish a user-request acceptance from an unrelated parent-controlled value change.

### FCR-005 — Medium — Required overlay titles can be empty

Dialog, Drawer, and Popover declare `title: ReactNode`, which accepts `null`, `false`, and empty content. No runtime validation rejects those values. Each control then points `aria-labelledby` at an empty heading.

Evidence:

- `packages/react/src/overlays/dialog/dialog.tsx:119-124, 140, 186-212`
- `packages/react/src/overlays/drawer/drawer.tsx:121-126, 142, 188-215`
- `packages/react/src/overlays/popover/popover.tsx:119-129, 146, 216-229`

Impact: a public API state contradicts the recorded requirement for a visible, accessible overlay title.

Required architecture disposition: define the accepted title content boundary and whether heading level/element remains control-owned or becomes a governed consumer composition point.

### FCR-006 — Medium — Production changes have no automated CI gate

The only GitHub Actions workflow builds and publishes Atlas. Its push paths are limited to documentation and Atlas configuration. No pull-request or source-change workflow runs installation, TypeScript, component tests, the production build, or Playwright.

Evidence:

- `.github/workflows/atlas.yml:6-20, 33-89`
- `AGENTS.md:72-84` requires verification and independent review, but those gates are not enforced by GitHub.

Impact: source, types, tests, and the application build can merge even when broken; the repository currently depends on manually reported evidence.

Required architecture disposition: define the required PR and default-branch gates, supported Node/npm versions, browser provisioning, branch protection expectations, and which gates are blocking.

### FCR-007 — Medium — The repository has no reliable complete unit-test entry point

The root package has no `test` or `test:unit` script and exposes only a foundation-focused Vitest script. Running the natural complete command, `vitest run`, discovers Playwright specifications and fails fifteen suites because they are executed by the wrong runner, even though all 201 component/validation tests pass when explicitly scoped.

Evidence:

- `package.json:15-21`
- `npm test -- --run` returns `Missing script: "test"`.
- `npm exec vitest -- run` returns 24 passing component files and 15 failed Playwright suites from cross-runner discovery.

Impact: contributors and future CI must know an undocumented path-filter command to obtain the real unit result.

Required architecture disposition: define runner boundaries and canonical `test`, `test:unit`, and `test:browser` commands before CI is added.

### FCR-008 — Low — Search bypasses the locale contract for its clear action

Search hardcodes the visible text `Clear search` and does not use `LocaleProvider`; the shared label catalog has no corresponding category.

Evidence:

- `packages/react/src/inputs/search/search.tsx:191-210`
- `packages/react/src/foundation/labels.ts:1-29`

Impact: a non-English locale still receives an English control-owned action label.

Required architecture disposition: assign the label to the shared governed catalog or explicitly define a different localized Search-label contract.

### FCR-009 — Medium — Three public close controls silently discard accepted children

`DialogCloseProps`, `DrawerCloseProps`, and `PopoverCloseProps` inherit the native button `children` prop. Each implementation forwards that value through its rest object and then renders the catalogue `Dismiss` label as an explicit JSX child, which overwrites the consumer child. `MenuClose` avoids the mismatch by omitting `children` from its public type.

Evidence:

- `packages/react/src/overlays/dialog/dialog.tsx:216-247`
- `packages/react/src/overlays/drawer/drawer.tsx:219-250`
- `packages/react/src/overlays/popover/popover.tsx:235-266`
- `packages/react/src/overlays/menu/menu.tsx:116-118`
- Targeted static-render probe: custom close content rendered `false` and the catalogue `Dismiss` label rendered `true` for Dialog, Drawer, and Popover.

Impact: a valid public prop is accepted and silently ignored. Consumers may believe they supplied visible close content while the rendered control says something else.

Required architecture disposition: decide whether every catalogue-labelled close control forbids `children`, or whether an explicit bounded label/child override exists; then align type, runtime, localization, tests, and all four overlay siblings.

### FCR-010 — Low — PopoverTrigger exposes an inconsistent, partly inert native-prop surface

`PopoverTriggerProps` accepts native `type` and `aria-haspopup`. The implementation always overwrites `type` with `button`, while `aria-haspopup` is passed through. Dialog and Menu omit their control-owned `type` and `aria-haspopup` props from the public type. This is a narrower instance of the sibling drift identified by the supplemental review.

Evidence:

- `packages/react/src/overlays/popover/popover.tsx:77-105`
- `packages/react/src/overlays/dialog/dialog.tsx:73-102`
- `packages/react/src/overlays/menu/menu.tsx:64-74`

Impact: one public prop is accepted but cannot affect output, and a consumer can assert a popup relationship that the sibling trigger contracts treat as control-owned.

Required architecture disposition: define one explicit trigger-prop ownership matrix per overlay semantic, including `type`, `aria-haspopup`, relationship attributes, event handlers, and runtime stripping, then apply it consistently where semantics are shared.

## Release-readiness finding

`@foundry/react` is currently private and exports raw TypeScript source rather than built JavaScript and declaration artifacts. `npm pack --dry-run --workspace @foundry/react` includes source tests and no distributable build output. The repository root also has no human-facing README or license grant; the nested feature READMEs serve internal workstream governance instead. These are confirmed release blockers but are consistent with M5 not having started, so they are not classified as escaped M1-M4 implementation defects.

Evidence:

- `packages/react/package.json:1-13`
- repository-root file inventory; no `README*` or `LICENSE*` file exists at the root
- `docs/features/control-gallery/milestones.md:35-39`

The architecture review must confirm that M5 owns package output, export maps, declaration generation, React peer dependency policy, package file inclusion, a packed-consumer smoke test, human onboarding documentation, and the intended license decision. This review does not choose a license on the owner's behalf.

## Risks requiring architecture confirmation

1. `.github/workflows/atlas.yml` uses mutable major-version Action tags. Pinning reviewed commit SHAs would reduce supply-chain movement, but no compromise is asserted by this review.
2. Several native-prop surfaces do not explicitly refuse `dangerouslySetInnerHTML`. Controls that also render owned children can turn that accepted prop into a render failure; any security consequence depends on consumer provenance. Architecture should decide whether the public native-prop policy rejects this escape consistently.
3. Several reusable controls own a fixed `<h2>` while the gallery nests them below `<h3>` example headings. Architecture should decide whether heading hierarchy is control-owned, configurable through a bounded semantic API, or supplied by composition.
4. Dialog, Drawer, Popover, and Menu repeat context guards, controlled/uncontrolled state resolution, ID construction, presentation-prop stripping, and ref assignment. Confirmed drift already exists. Architecture should choose the smallest shared overlay foundation without presupposing the supplemental review's proposed helper names.
5. Controlled Popover native dismissal requests `false` and re-shows the native auto popover in a microtask when the controlling prop remains `true`. This exactly implements the accepted M4 decision, but the supplemental reviewer challenged its flicker and asynchronous-parent behavior. Architecture should retain, amend, or replace that decision explicitly; browser behavior remained unavailable in this review environment.
6. Runtime throws for invalid composition and forbidden state modes are an explicit repository policy and accepted contract, not an accidental production leak. Architecture should decide whether refusal remains production-enforced, becomes development-only, or uses a different failure channel before any global change.
7. The root toolchain has no ESLint or Prettier gate and does not enable explicit TypeScript `include`, `noUncheckedIndexedAccess`, or `verbatimModuleSyntax`. These are confirmed hardening opportunities, not evidence that the current passing build is defective. Architecture should decide which belong in CI and whether adoption is staged to avoid unrelated churn.
8. `MenuCloseProps` is derived at the package barrel rather than exported beside its component, and the React 19 codebase continues to use `forwardRef`. These are consistency and modernization observations only; no public behavior failure is asserted.

## Verification evidence

| Command or check | Result |
| --- | --- |
| `git rev-parse HEAD` | `5e01f5a0d02c78ced41a915042b49dd8ffd666c9` |
| `git status --short --branch` | Clean review target before and after inspection |
| `npm ci` | Completed; review environment warned that Node 24/npm 11 are outside the repository's supported Node 22/npm 10 range |
| `npm exec tsc -- --noEmit` | PASS |
| `npm run check` | PASS |
| `npm run build` | PASS; 82 modules transformed |
| `npm exec vitest -- run packages/react/src packages/validation/src` | PASS; 24 files, 201 tests |
| `npm exec vitest -- run` | FAIL as a canonical gate; 201 unit tests pass, 15 Playwright suites are incorrectly discovered by Vitest |
| `npm audit --audit-level=low` | PASS; zero known vulnerabilities |
| `npm pack --dry-run --json --workspace @foundry/react` | Confirms raw source/tests and no compiled package artifacts |
| `npm run test:browser` | `UNTESTED` for product behavior in this clean environment; all 83 attempts failed before browser launch because Chromium was absent |
| Playwright Chromium installation retry | Environment download failure; the CDN returned truncated zero-size downloads, so this is not classified as a product failure |
| Targeted controlled-Tabs focus probe | Reproduced FCR-004; the external focused button lost focus to the parent-selected tab |
| Targeted close-children static-render probe | Reproduced FCR-009 for Dialog, Drawer, and Popover; custom children were absent and `Dismiss` rendered |
| Supplemental Google Doc and comment read | Full body incorporated; zero comment threads |
| Secret-pattern scan | No committed credential or private-key match found |
| Worktree state | No production, test, configuration, workflow, or package file changed by the review |

## Architecture review requirements

The architecture review must return one row per `FCR-*` finding with:

1. `ACCEPT`, `REJECT`, or `DEFER`;
2. evidence and rationale;
3. the controlling decision or invariant to create or amend;
4. the owning milestone, issue, and bounded correction sequence;
5. whether prior milestone acceptance is reopened;
6. required automated and independent-review gates;
7. dependencies and execution order across findings.

The architecture review must also disposition the release-readiness finding, each confirmation risk, and every row in the supplemental-review reconciliation. No code fix, package change, workflow change, test repair, milestone resume, or accepted-decision amendment is authorized by this review record alone.
