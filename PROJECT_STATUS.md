# Foundry Project Status

## Current feature

Control Gallery — Milestone 1: repository and interactive gallery foundation.

## Current state

Control Gallery M1 is active. CG-M1-01 established the reproducible workspace: clean dependency install, development server, production build, and a real Chromium smoke against the dependency-free gallery passed. CG-M1-02 merged the approved Control Base, default skin, Skin/Locale providers, English label catalog, registry, and shared example-state contracts after independent review. The accepted CG-M1-03.1 bootstrap was brought onto the M1 shell branch after the coordinator found that its earlier isolated commits had not reached `main`. The supervised Qwen 3.6 CG-M1-03.2 retry is accepted: it created the accessible title, description, and five empty family sections in `GalleryApp.tsx` and passed the path-boundary, TypeScript, static, and production-build gates. CG-M1-03.3 is accepted: its labelled native-link navigation maps exactly to those five family sections and passed the same gates. CG-M1-03.4 is accepted after one correction: it provides a type-correct reduced-motion toggle and restores a pre-existing body motion class on unmount. CG-M1-03.5 is accepted after one correction: it supplies a token-based responsive layout, visible focus, and motion reduction without a second visual-token source. CG-M1-03.6 is now in progress; CG-M1-03.7 and M1-04 remain blocked on its acceptance. Earlier local-model evidence remains in `docs/features/control-gallery/performance-reports.md`.

## Next action

Complete and verify the supervised Qwen 3.6 CG-M1-03.6 reusable-example-frame packet with path-boundary, TypeScript, build, and commit gates. Do not begin CG-M1-03.7 until it is accepted.
