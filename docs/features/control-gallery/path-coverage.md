# Control Gallery — path coverage

This is the feature-level path inventory. Each milestone must turn its applicable rows into automated browser specs or explicit `UNTESTED` entries in the done ledger.

| Area | Required paths | Evidence target |
| --- | --- | --- |
| Gallery entry | direct load, in-page navigation, narrow and wide width, reduced motion | browser spec + visual check |
| Text and select fields | valid entry, blank required entry, short/invalid entry, correction after error, reset, previously entered value | component + browser spec |
| Choice controls | checked/unchecked, radio selection, disabled, keyboard operation, reset | component + browser spec |
| Buttons | all four variants, enabled, disabled, loading, repeated activation prevention, action confirmation | component + browser spec |
| Search | no query, matching query, no matches, clear/retry | browser spec |
| Overlays | open from trigger, keyboard focus, Escape, applicable outside dismissal, close action, focus restoration, repeated open/close | browser spec |
| Tabs | pointer selection, Arrow key selection, selected panel, loading and empty content | browser spec |
| Feedback | banner dismiss/restore, toast announcement, status labels, empty state, loading skeleton | browser spec |
| Shared states | visible focus, long labels, narrow/wide layout, reduced motion, disabled/invalid/loading/empty states | browser spec + review |

## Invariants

- A control with `disabled` or `loading` does not perform its action.
- A validation error identifies the problem and allows correction without losing the entered value.
- An overlay has one active trigger and returns focus to that trigger when it closes.
- Exactly one tab is selected and exactly one associated panel is visible.
- A gallery example must have an observable behavior; decorative controls do not count as coverage.
