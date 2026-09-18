# Foundry Roadmap

Where every workstream is, on one page. This document is the map of what Foundry is building and
where each piece currently stands. It is updated at milestone completion, alongside
`PROJECT_STATUS.md` and the tracker.

**What this is.** The living index of workstreams, their milestones, and their current position.

**What this is not.** Not a design authority, not a plan, not a status log. Each workstream links
to its own records under `docs/features/<feature>/`; the detail lives there.

---

## Workstreams

| Codename | What it is | Position | Gate |
|---|---|---|---|
| **Control Gallery** | Foundry's living acceptance surface — demonstrates real behavior for every Core v1 control (React/TypeScript), so a developer or reviewer can exercise the contract before a product adopts it | The functional baseline is complete through Popover. The Core v1 contract and Base UI production integration are approved; the published token and skin correction closed font sizing and modal layering but retained an incomplete recipe inventory at its exceptional review bound; overlay and navigation implementation remains paused. | Obtain the owner's decision on one further bounded recipe correction and recheck. |

Design authority for a feature is approved and recorded directly under
`docs/features/<feature>/` (see `AGENTS.md`); Control Gallery's own `decisions.md` is that
authority.
