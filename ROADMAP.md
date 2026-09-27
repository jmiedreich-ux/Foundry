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
| **Control Gallery** | Foundry's living acceptance surface — demonstrates real behavior for every Core v1 control (React/TypeScript), so a developer or reviewer can exercise the contract before a product adopts it | The functional baseline is complete through Popover. The all-control Base UI correction is drafted; its named consistency findings are closed, while final fidelity, completeness, and synchronized-status checks remain pending. Package/command architecture and implementation remain unstarted; overlay and navigation implementation remains paused. | Finish the pending review checks, then define the package and executable-gate contract. |

Design authority for a feature is approved and recorded directly under
`docs/features/<feature>/` (see `AGENTS.md`); Control Gallery's own `decisions.md` is that
authority.
