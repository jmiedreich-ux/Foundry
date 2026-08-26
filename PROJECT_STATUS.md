# Foundry Project Status

## Current feature

Control Gallery — Milestone 1: repository and interactive gallery foundation.

## Current state

Control Gallery M1 is active. CG-M1-01 established the reproducible workspace: clean dependency install, development server, production build, and a real Chromium smoke against the dependency-free gallery passed. CG-M1-02 merged the approved Control Base, default skin, Skin/Locale providers, English label catalog, registry, and shared example-state contracts after independent review. The original CG-M1-03 local attempt produced no accepted change and is replaced by sequential beta sub-packets. CG-M1-03.1 is coordinator-accepted on the M1-03 branch after one blocking correction; CG-M1-03.2 is claimed for the local OpenCode `qwen3-coder:30b` gallery content agent.

## Next action

Execute `CG-M1-03.2` only: add the gallery title, description, and five planned family sections in `GalleryApp.tsx`. Do not change configuration, foundation contracts, styles, navigation, motion, example frames, or test-owned files.
