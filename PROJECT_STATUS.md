# Foundry Project Status

## Current feature

Control Gallery — Milestone 1: repository and interactive gallery foundation.

## Current state

Control Gallery M1 is active. CG-M1-01 established the reproducible workspace: clean dependency install, development server, production build, and a real Chromium smoke against the dependency-free gallery passed. CG-M1-02 merged the approved Control Base, default skin, Skin/Locale providers, English label catalog, registry, and shared example-state contracts after independent review. The original four-model CG-M1-03.1 comparison produced no complete first-pass result, and a 65K-context Qwen3-Coder rerun also failed scope and acceptance. A separate 65K-context Qwen 3.6 27B comparison then passed both the unchanged original CG-M1-03.1 prompt and the explicit no-duplicate-`#root` variant; the latter self-corrected one build error. An owner-authorized throwaway Qwen 3.6 CG-M1-03.4 test then respected scope and passed its build but failed the relevant TypeScript check because `aria-pressed` had the wrong type. The evidence is recorded in `docs/features/control-gallery/performance-reports.md`. With owner authorization, CG-M1-03.2 is now in progress as a supervised Qwen 3.6 local-agent retry; later M1-03 sub-packets remain blocked on its acceptance.

## Next action

Complete and verify the supervised Qwen 3.6 CG-M1-03.2 retry with path-boundary, TypeScript, build, and commit gates. Do not dispatch CG-M1-03.3 until it is accepted.
