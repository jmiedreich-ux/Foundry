# Open architecture questions

These questions are active decisions, not a history of resolved work. Each needs an owner decision, an assigned delivery stage, and verification before related implementation resumes.

| Question | Why it matters |
| --- | --- |
| Does Core v1 ship an installable Foundry package? | Determines package output, export maps, consumer smoke coverage, onboarding documentation, license, and release gates. |
| What visible differences do small, medium, and large controls guarantee? | The public size contract needs an observable skin and token outcome. |
| What focus treatment meets contrast requirements everywhere it appears? | Keyboard focus must remain perceivable on canvas, controls, and actions. |
| What callback is required for controlled state? | A controlled control must not become impossible to dismiss or change. |
| When does a Tabs keyboard-focus request end? | Parent-driven changes must not steal focus after the user moves elsewhere. |
| What counts as a visible overlay title? | Dialog, Drawer, and Popover need a reliable accessible name. |
| Which checks block a pull request and release? | CI needs canonical unit, browser, type, build, and security gates. |
| Where does the Search clear label come from? | The control must follow the shared localization boundary. |
| Is close text fixed or consumer-configurable? | The public API must not silently discard accepted content. |
| Which trigger properties are owned by each overlay? | Semantic attributes and native button behavior must be consistent. |

## Deferred work

A future Front of House skin may be considered only after Core v1 acceptance. It must use Foundry’s token contract and must not import Vennusign source.
