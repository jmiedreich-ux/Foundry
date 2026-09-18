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
| **Control Gallery** | Foundry's living acceptance surface — demonstrates real behavior for every Core v1 control (React/TypeScript), so a developer or reviewer can exercise the contract before a product adopts it | Gallery foundation, field controls, and actions/selection/search/feedback are accepted and closed. Overlay and navigation work is paused after Popover browser checks. | Resolve architecture dispositions from PR #57; keep Menu browser checks paused until the owner resumes them. |

Design authority for a feature is approved and recorded directly under
`docs/features/<feature>/` (see `AGENTS.md`); Control Gallery's own `decisions.md` is that
authority.
