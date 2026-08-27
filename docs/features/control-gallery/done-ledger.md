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

## M2–M5

Not started. Each milestone adds a complete check table before implementation begins.
