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
| **Control Gallery** | Foundry's living acceptance surface — demonstrates real behavior for every Core v1 control (React/TypeScript), so a developer or reviewer can exercise the contract before a product adopts it | **M1–M3 are accepted and closed. M4 is merged through CG-M4-18 and paused before CG-M4-19.** The 2026-08-31 independent full-repository review, including corroborated supplemental Google Drive feedback, returned `REQUEST_CHANGES`; existing acceptance remains unchanged until architecture disposition. | Complete the architecture disposition review for `FCR-001` through `FCR-010` and the release-readiness/risk items. Do not resume CG-M4-19 while the owner pause remains active. |

Design authority for a feature is approved and recorded directly under
`docs/features/<feature>/` (see `AGENTS.md`); Control Gallery's own `decisions.md` is that
authority.
