# Control Gallery — done ledger

Use `PASS`, `N/A (reason)`, or `UNTESTED`. Do not leave cells blank at milestone close.

## M1

| Check | Status | Evidence / reason |
| --- | --- | --- |
| Clean install and development command | PASS | CG-M1-01: Node 22.23.2 / npm 10.9.8; `npm install` and `npm run dev` passed. |
| Production build | PASS | Final M1 `npm run build` passed with 41 modules transformed. |
| Direct gallery load | PASS | CG-M1-04 real Chromium test asserts one root, main landmark, heading, and five family sections. |
| Family navigation and visible focus | PASS | CG-M1-04 real Chromium tests assert five exact hash targets, keyboard Tab focus, and the default skin's solid 3px `#93c5fd` outline with 4px offset. |
| Reduced-motion path | PASS | CG-M1-04 real Chromium test asserts body class, boolean pressed state, labels, visible sections, and recovery. |
| Narrow and wide layout | PASS | CG-M1-03.7 Chromium screenshots passed at 1280×720 and 320×720; CG-M1-04 asserts no horizontal scroll at 320px. |
| Independent review | PASS | The first review returned `REQUEST_CHANGES` on `d3bd907` because the focus assertion allowed a user-agent outline; the second requested correction of stale record references. Final review approved `99132e9`; PR #18 merged to `main` at `6f45394`. |
| Owner acceptance workbook | PASS | Owner accepted the live M1 gallery on 2026-08-27 after reviewed merge. |

## M2

| Check | Status | Evidence / reason |
| --- | --- | --- |
| Field labels, descriptions, errors, and required relationships | PASS | M2 Chromium specification asserts accessible labels, required semantics, alert association, and the Field-owned relationship. |
| Invalid submission, announcement, correction, and success | PASS | Real Chromium submits blank, observes the alert and invalid state, enters a correction without value loss, then observes cleared error and status success. |
| Controlled and uncontrolled state | PASS | Browser checks observable controlled output and uncontrolled native TextField/Select values. |
| Native form reset | PASS | Browser changes both uncontrolled controls and asserts Reset restores `hello` and `alpha`. |
| Disabled and invalid treatments | PASS | Default-skin `data-disabled` opacity and `data-invalid` border are asserted in Chromium. |
| Keyboard focus and focus-visible state | PASS | Real Tab traversal asserts the exact default-skin ring and `data-focus-visible` for TextField and Select; pointer input clears the state. |
| Long label and narrow width | PASS | 320px Chromium check asserts accessible long-label connection and no horizontal overflow. |
| Loading, duplicate records, maximum values, and retry | N/A (M2 field controls do not implement loading, record collections, maximum-length policy, or network retry.) |
| Shared-control consumer search | PASS | `rg` found only the M2 gallery examples as TextField/Select consumers; they are covered by the browser target. |
| Independent review | PASS | Review requested changes on `e49aa8f` for default-skin and focus-visible defects; renewed review approved `2b7002a`. PR #21 merged at `2ab4753`. |
| Owner acceptance workbook | PASS | Owner approved the merged M2 field-controls gallery on 2026-08-27. |

## M3

In progress. CG-M3-01 through CG-M3-07 are accepted on the M3 branch. Their focused component, TypeScript, static, production-build, scope, and independent-review gates passed. Real browser proof remains `UNTESTED` where it is owned by CG-M3-23 through CG-M3-29; Banner dismissal, restore, and focus proof specifically belong to CG-M3-29.

## M4–M5

Not started. Each milestone adds a complete check table before implementation begins.
