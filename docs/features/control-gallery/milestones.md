# Control Gallery — milestones

## M1 — Gallery foundation and test harness

**Goal:** Establish the runnable React/TypeScript workspace, gallery shell, reusable example harness, and browser-test foundation without implementing the remaining control packages.

**Exit behavior:** A reviewer can load the gallery, navigate its control families, use reduced motion, and run the first browser specification against a real browser target.

**Packets:** `CG-M1-01` through `CG-M1-04`. See [M1 record](milestones/m1.md).

## M2 — Foundations and field controls

**Goal:** Deliver the control contract, tokens/skin boundary, `Field`, `Group`, `TextField`, and `Select` as reusable React controls, with gallery examples and browser coverage.

**Exit behavior:** A consumer can compose labelled fields that validate, preserve entered values during correction, and reset predictably.

**Packets:** `CG-M2-01` through `CG-M2-04`. See [M2 record](milestones/m2.md).

## M3 — Actions, choices, search, and feedback

**Goal:** Deliver Button, Checkbox, RadioGroup, Switch, Search, StatusChip, Banner, Toast, EmptyState, and LoadingSkeleton.

**Exit behavior:** The gallery demonstrates real action, selection, loading, disabled, empty, and feedback behavior, including all approved Button variants.

**Packets:** `CG-M3-01` through `CG-M3-18`. See [M3 record](milestones/m3.md).

## M4 — Overlay and navigation controls

**Goal:** Deliver Dialog, Drawer, Popover, Menu, Tabs, Card, and the overlay root.

**Exit behavior:** Layer controls manage focus, Escape, appropriate dismissal, and keyboard navigation consistently.

**Packets:** `CG-M4-01` through `CG-M4-15`. See [M4 record](milestones/m4.md).

## M5 — Cross-control acceptance and release handoff

**Goal:** Complete path coverage, accessibility checks, responsive review, API documentation, independent review, and owner acceptance material.

**Exit behavior:** Core v1 gallery behavior has evidence, open risks are explicitly marked, and the feature can be accepted without beginning Vennusign conversion.

**Packets:** `CG-M5-01` through `CG-M5-06`. See [M5 record](milestones/m5.md).

## Post-Core roadmap

After M5 acceptance, scope and assign separate features in this order: structural/data controls (Accordion, Grid, Timeline, data lookup, Tree); complex input/workflow controls (calendar/date-range picker, drag-reorder list, Stepper/Wizard, Kanban); then visual/specialized controls (Chart, ColorPicker). Custom controls are feature-specific and are never promoted into Core without a new approved record.
