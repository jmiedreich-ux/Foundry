# Open architecture questions

This register contains only decisions that require owner authority. Technical decisions are made and recorded in the architecture workshop.

| Question | Why it matters |
| --- | --- |
| May the token and skin contract receive one exceptional bounded correction and targeted recheck? | The normal two-round review limit has been reached with three material completeness gaps; no further contract edit or implementation is authorized without this process decision. |
| Which release license does Foundry use? | The distributable package needs an owner-approved grant before publication. |

## Deferred work

A future Front of House skin may be considered only after Core v1 acceptance. It must use Foundry’s token contract and must not import Vennusign source.
