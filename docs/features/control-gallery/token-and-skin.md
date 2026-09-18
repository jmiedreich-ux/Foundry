# Token and skin contract

This is the visual authority for Core v1. It defines the values a skin must supply, the parts Foundry may style, the recipes Foundry owns, and the rendered evidence required before any skin or styling packet enters Maestro. It does not approve token values or implement CSS.

## Outcome and boundary

Foundry owns one complete recipe set. A skin supplies the values used by those recipes. Consumers opt into both through documented CSS exports; importing `@foundry/react` never loads CSS, injects a stylesheet, or changes unrelated application markup.

The default skin is not approved from a token table alone. Its values become implementation input only after the complete control catalog has been rendered, measured, independently reviewed, and accepted under the protocol below. A future skin uses the same schema and recipes. It does not copy or replace component behavior.

Base UI has no public styling role. Its attributes, variables, classes, and DOM conveniences may be read only inside a private adapter and must be translated to the Foundry hooks in this contract.

## Three-layer model

| Layer | Owner | Contract |
| --- | --- | --- |
| Skin values | An approved Foundry skin | Supplies every required custom property for one exact skin name. It may use private palette values internally, but publishes only the schema below. |
| Shared recipes | Foundry | Applies layout and visual treatment only to exact owned-part hooks. Recipes consume required tokens and private runtime measurements; they contain no unexplained visual constants. |
| Control markup | `@foundry/react` | Emits the owned part, skin, size, value, and state hooks that recipes require, including equivalent hooks on portaled parts. |

The logical CSS assets are a shared recipe sheet, one value sheet per approved skin, and a convenience default-skin bundle containing both in deterministic layer order. The package and executable-gate contract will fix their final export paths and built-file layout. JavaScript imports never imply any of these assets.

## Token schema

The source manifest is the authority. It produces CSS custom-property names, TypeScript names, validation metadata, and the documentation table from one record; those outputs may not be maintained separately.

Each entry has exactly `{ name, cssProperty, type, constraints, description }`. `FoundryTokenName` is the union of manifest names. `foundryTokenNames` and `foundryTokenDefinitions` are readonly generated values. There is no token lookup with a fallback value: a missing value must fail validation instead of silently changing the design.

Names use lower-case dot segments. Their CSS form prefixes `--foundry-` and replaces dots with hyphens; for example, `color.text.default` becomes `--foundry-color-text-default`. Renaming or removing a token is a breaking change. Adding one is also breaking for skin authors until every approved skin supplies it.

### Value types

| Type | Accepted form | Additional rule |
| --- | --- | --- |
| `color` | One parseable CSS color | No gradients; alpha is allowed only for backdrop and selection roles. |
| `length` | `0` or one finite `rem`/`px` length | No percentages, viewport units, `calc()`, or negative values in a skin value. Text scales with `rem`; borders, focus widths, and fixed target minima may use `px`. |
| `number` | One finite unitless number | Must satisfy the entry's inclusive range. |
| `time` | One non-negative integer in `ms` | Reduced-motion recipes do not consume a different skin value; they suppress motion. |
| `easing` | `linear`, a standard easing keyword, or one `cubic-bezier()` | Spring or JavaScript timing is outside Core v1. |
| `font-family` | A non-empty CSS font-family list | The final family must be a generic fallback. |
| `font-weight` | An integer from 400 through 700 | Variable-font ranges are not accepted. |
| `shadow` | One or more valid box-shadow layers | Every color inside the shadow must be a private skin palette reference resolved during generation. |
| `layer` | A non-negative integer | Layer ordering must satisfy the inequalities below. |

### Required keys

Braced sets expand to every listed key. All keys are required; there are no optional Core v1 tokens.

| Category | Exact keys |
| --- | --- |
| Canvas and surfaces | `color.canvas`; `color.surface.{default,raised,sunken,overlay}` |
| Text and borders | `color.text.{default,muted,subtle,inverse,disabled}`; `color.border.{default,strong,disabled}` |
| Primary action | `color.action.primary.{background,backgroundHover,backgroundActive,foreground,border}` |
| Secondary action | `color.action.secondary.{background,backgroundHover,backgroundActive,foreground,border}` |
| Destructive action | `color.action.destructive.{background,backgroundHover,backgroundActive,foreground,border}` |
| Link action | `color.action.link.{foreground,foregroundHover,foregroundActive}` |
| Fields | `color.field.{background,backgroundHover,backgroundReadOnly,backgroundDisabled,foreground,foregroundDisabled,border,borderHover,borderInvalid,borderDisabled,placeholder}` |
| Focus and selection | `color.focus.{inner,outer}`; `color.selection.{background,foreground}` |
| Status | `color.status.{neutral,success,warning,danger}.{background,border,foreground}` |
| Backdrop and skeleton | `color.backdrop`; `color.skeleton.{base,highlight}` |
| Typography | `font.family.body`; `font.size.{xs,sm,md,lg}`; `font.lineHeight.{tight,default,relaxed}`; `font.weight.{regular,medium,semibold}`; `font.letterSpacing.label` |
| Spacing | `space.{0,050,100,150,200,300,400,500,600,800}` |
| Control density | `control.height.{sm,md,lg}`; `control.paddingInline.{sm,md,lg}`; `control.paddingBlock.{sm,md,lg}`; `control.gap.{sm,md,lg}`; `control.iconSize.{sm,md,lg}`; `surface.padding.{sm,md,lg}` |
| Target and stroke | `target.minimum`; `border.width.{default,strong,focusInner,focusOuter}` |
| Radius | `radius.{control,surface,round}` |
| Elevation | `elevation.{surface,popup,modal,toast}` |
| Motion | `motion.duration.{fast,medium,slow}`; `motion.easing.{standard,enter,exit}`; `motion.distance.{short,medium}` |
| Layers | `layer.{popup,modal,toast}` |
| Overlay geometry | `overlay.viewportMargin`; `overlay.maxBlockSize`; `dialog.maxInlineSize`; `drawer.inlineSize`; `popover.maxInlineSize`; `menu.maxInlineSize`; `toast.inlineSize` |

Type assignment is exact: every `color.*` key is `color`; `font.family.*` is `font-family`; `font.size.*`, `font.letterSpacing.*`, every spacing/density/target/stroke/radius/distance/geometry key are `length`; `font.lineHeight.*` is `number`; `font.weight.*` is `font-weight`; `elevation.*` is `shadow`; `motion.duration.*` is `time`; `motion.easing.*` is `easing`; and `layer.*` is `layer`.

The manifest enforces these cross-token constraints:

- `target.minimum` is at least 24 CSS pixels; `control.height.sm < control.height.md < control.height.lg`, while every height and interactive hit area is at least `target.minimum`;
- text-entry `font.size` is at least 16 CSS pixels at every size;
- spacing, padding, gap, icon size, surface padding, radius, and motion distance are non-decreasing within their declared scales;
- `border.width.focusInner + border.width.focusOuter` is at least two CSS pixels;
- `layer.popup < layer.modal < layer.toast`, adjacent values differ by at least 256, and a private layer index is an integer from 0 through 255;
- overlay dimensions cannot exceed the available block or inline size after twice the viewport margin; and
- the default-skin candidate must meet the contrast and focus requirements in rendered evidence. A parser-valid color is not an approved color.

## Scope and cascade

`FoundryProvider` stays DOM-free. Every recipe-bearing DOM element receives all three identity attributes directly:

```html
data-foundry-skin="default" data-control="button" data-part="root"
```

The skin value sheet defines variables only on `[data-foundry-skin="<exact name>"]`. The shared recipes target the same element with the exact `data-control` and `data-part`. Because portaled content retains React context and carries its own identity, it does not depend on a provider wrapper or application ancestry.

The nearest provider supplies the resolved skin. Updating it changes every still-mounted owned part, including portals and Toast viewports, without remounting, state callbacks, focus movement, timer reset, or announcement. A nested provider affects only its own React subtree and portal boundary.

No library selector may contain `:root`, `html`, `body`, `*`, an element name, a role, an ID, a class, a consumer attribute, a descendant/child/sibling combinator, or `:has()`. A recipe selector consists of one owned target compound, optional approved value/state hooks on that same target, and only the applicable `:hover`, `:active`, `:focus-visible`, `:autofill`, `::placeholder`, `::selection`, `::before`, or `::after`. Grouping exact target compounds is allowed. Reduced-motion, forced-color, pointer-capability, and responsive media queries do not relax this rule.

Consumer children, native `option`/`optgroup` children, and consumer-supplied action content are never given Foundry identity and are never selected by a recipe. Foundry may style an owned wrapper around that content, but not the content itself.

Shared recipes live in named cascade layers in this order: `foundry.structure`, `foundry.recipe`, `foundry.state`, `foundry.accessibility`. Skin value sheets only declare custom properties. Stable hooks are for Foundry recipes, approved skin tooling, and observation; per-instance consumer CSS overrides are unsupported.

## Owned parts

Part names are public styling and test contracts. DOM-free roots emit no part. Each listed part is required when its corresponding content exists; conditional parts are marked.

| Control | Exact recipe-bearing parts |
| --- | --- |
| Field | `root`, `label`, `required-marker` (required only), `description` (conditional), `error` (conditional) |
| Group | `root`, `legend` |
| Button | `root`, `loading-indicator` (loading only and hidden from assistive technology), `loading-announcer` (transient and visually hidden) |
| TextField | `root` |
| NativeSelect | `root`, `input`, `indicator` |
| Checkbox | `root`, `input`, `indicator` |
| Switch | `root`, `input`, `track`, `thumb` |
| RadioGroup | `root`, `legend`, `option`, `input`, `indicator`, `label`, `description` (conditional per option) |
| SearchField | `root`, `input`, `clear` (non-empty editable value only) |
| StatusChip | `root` |
| Banner | `root`, `title`, `description`, `action` (conditional), `dismiss` (conditional), `announcer` (transient when announcement is requested) |
| EmptyState | `root`, `title`, `description`, `action` (conditional) |
| LoadingSkeleton | `root`, `line` (one through six) |
| Card | `root`, `title`, `description` (conditional), `content` (conditional) |
| Dialog | `trigger` (conditional), `backdrop`, `viewport`, `content`, `title`, `description` (conditional), `close` (one system action plus any declared close parts) |
| Drawer | `trigger` (conditional), `backdrop`, `viewport`, `content`, `title`, `description` (conditional), `close` (one system action plus any declared close parts) |
| Popover | `trigger`, `positioner`, `content`, `title`, `description` (conditional), `close` (zero or more) |
| Menu | `trigger`, `positioner`, `content`, `group` (conditional), `group-label` (conditional), `item`, `separator` (conditional) |
| Tabs | `list`, `trigger`, `panel` |
| Toast | `viewport`, `announcer`, `root`, `content`, `title`, `description` (conditional), `action` (conditional), `close` |

An internal portal node used only for mounting and an internal positioning node with no box or visual behavior are not parts. A node becomes a declared part as soon as a recipe gives it layout, size, paint, typography, motion, or hit-area behavior.

Native semantics and public refs do not move to the visual wrapper. `NativeSelect`, Checkbox, Switch, and SearchField forward their public props and refs to the documented native `select` or `input`; RadioGroup still forwards its ref to the `fieldset`. Their `root`, `indicator`, `track`, and `thumb` parts are private non-semantic presentation nodes, are hidden from the accessibility tree where appropriate, and cannot receive focus or events independently. The native input covers the hit area and remains the form, autofill, validation, reset, keyboard, focus, and accessibility authority. Button's visual loading indicator does not replace or hide its accessible name.

## Value and state hooks

Value hooks always contain one documented value. Presence hooks are present with an empty value only while true. Consumers cannot set or override them.

| Kind | Exact hooks and values |
| --- | --- |
| Values | `data-size="sm|md|lg"`; `data-variant="primary|secondary|destructive|link"`; `data-tone="neutral|success|warning|danger"`; `data-orientation="horizontal|vertical"`; `data-side="top|bottom|left|right"`; `data-align="start|center|end"` |
| Public state | `data-disabled`, `data-readonly`, `data-invalid`, `data-loading`, `data-checked`, `data-indeterminate`, `data-selected`, `data-open` |
| Visual interaction | `data-focus-visible`, `data-highlighted`, `data-entering`, `data-exiting` |

`data-side` is the final physical side after direction resolution and collision handling, not merely the requested placement. Drawer also reports its final physical side. `data-align` reports final alignment. `data-highlighted` identifies the current Menu discovery item and may coexist with `data-disabled`. `data-entering` and `data-exiting` represent Foundry presence phases; dependency-specific animation attributes are never selected.

The root part carries every applicable hook. A non-root part repeats each value or presence hook its own recipe consumes, so recipes never reach through ancestry. Browser `:hover`, `:active`, and `:focus-visible` are authoritative; `data-focus-visible` must mirror `:focus-visible` and exists for deterministic recipes and evidence, not as a separate modality system.

## Recipe contract

Structure values such as `display`, `position`, `overflow`, `auto`, `none`, `transparent`, `0`, `100%`, grid/flex keywords, `currentColor`, transforms needed to draw simple marks, and visually-hidden geometry are reviewed recipe constants. Check, mixed, chevron, spinner, and switch-thumb marks are drawn only on their declared owned parts from tokenized stroke, size, and color; no font glyph, external image, data URL, or consumer asset is part of a recipe. All color, typography, spacing, size, stroke, radius, elevation, motion, and layer values come from the manifest. Runtime positioning may set only documented `--foundry-private-*` measurements; those variables are neither public tokens nor skin inputs.

Every recipe must cover the applicable cells below. `N/A` is recorded in the generated recipe manifest with a reason; absence is not an implicit `N/A`.

| Family | Required dimensions |
| --- | --- |
| Field and Group | `sm/md/lg`; default, disabled, invalid; required marker; description/error presence; long and wrapped labels |
| Button | Four variants × three sizes; default, hover, active, focus-visible, disabled, loading; text, icon-plus-text, and icon-only |
| TextField and NativeSelect | Three sizes; default, hover, focus-visible, disabled, invalid, read-only where supported; placeholder, filled, long, autofill, and selection |
| Checkbox and Switch | Three sizes; unchecked/checked and Checkbox indeterminate; hover, active, focus-visible, disabled, invalid |
| RadioGroup | Three sizes; zero/current selection; option default, hover, active, focus-visible, checked, disabled, invalid; description present/absent |
| SearchField | Three sizes; input states equal to TextField; clear default, hover, active, focus-visible; empty, filled, disabled, and read-only |
| Status and feedback | Four tones × three sizes; title/description/action variants; dismissible Banner open/enter/exit; one-to-six skeleton lines; skeleton still state under reduced motion |
| Card and EmptyState | Three sizes; title, optional description/content/action; zero/one/many and long content |
| Dialog and Drawer | Trigger button states; backdrop, viewport, surface, title, description, close; open/enter/exit; smallest/largest viewport; overflow; nested layers; Drawer left/right |
| Popover | Trigger/close button states; positioner/content; four physical sides × three alignments; open/enter/exit; collision and constrained available size |
| Menu | Trigger states; content/group/label/separator; item default, hover, highlighted, active, focus-visible, disabled; four sides × three alignments; open/enter/exit; zero is refused, one/many/long items |
| Tabs | Three sizes × two orientations; trigger default, hover, active, focus-visible, selected, disabled; panel empty/long/focusable-first/no-focusable-first |
| Toast | Four tones × three sizes; viewport/root/content/title/description/action/close; queued/visible/enter/exit/paused-by-hover/paused-by-focus; one and maximum visible; long content |

State treatments preserve the semantic distinction when color is unavailable. Checked controls retain a mark or position change; selected Tabs retain an indicator; invalid fields retain both error relationship/content and a boundary change; disabled controls retain native or ARIA disabled semantics and a visible non-color treatment. Hover alone never reveals required information.

### Focus, contrast, and high contrast

The default recipe uses a two-color focus indicator on every interactive part. The combined qualifying perimeter is at least two CSS pixels and each edge has at least 3:1 contrast against both adjacent surface and unfocused control pixels. It cannot be clipped by an owned ancestor at 100% or 400% zoom.

Normal text meets 4.5:1; large text and essential boundaries, icons, marks, and state indicators meet 3:1. Muted and placeholder text are still readable text and meet the applicable text ratio. Tone combinations are validated independently; status meaning does not rely on hue alone.

Under `forced-colors: active`, recipes use system colors such as `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `Highlight`, `HighlightText`, and `GrayText`. `forced-color-adjust: none` is allowed only on an exact owned part whose custom mark would otherwise disappear, and that exception requires a browser assertion. Focus, checked, selected, invalid, disabled, and open boundaries remain visible.

### Motion and layering

Only opacity and transform may animate for entry, exit, and lightweight feedback. Layout, focus, scroll position, and anchor coordinates never animate. Exit presence remains mounted until its recipe completes. In `prefers-reduced-motion: reduce`, animation and transition are removed, movement is zero, exit completes immediately, and state, focus, queue, and announcement timing remain unchanged.

Dialog/Drawer use the modal layer, Popover/Menu normally use the popup layer, and Toast uses the toast layer. A Popover or Menu opened from inside a modal is promoted to that modal's band. The internal recipe sets a private layer-base variable to the applicable public token and adds a private provider-local index from 0 through 255. Exhausting a band is a composition error rather than permission to overlap unpredictably. Backdrop and content share one logical layer record; the backdrop is immediately below its content. A nested provider inherits the containing layer band for its boundary. No recipe uses `z-index` outside the layer base plus private index.

## Skin lifecycle and failure behavior

- `SkinName` must equal its trimmed form and be non-empty. The resolved value is written literally to every owned part; CSS selector escaping is the skin author's responsibility at authoring time.
- A skin value sheet includes `--foundry-skin-ready: 1` beside every required token. After mount, development builds check a connected owned part on the next animation frame. A missing sentinel reports `FOUNDRY_SKIN_MISSING` with the skin name and import remedy. Production does not inject or fall back to another skin.
- Build validation rejects a missing, duplicate, unknown, malformed, or constraint-breaking token. It also rejects a value sheet that emits recipes or selectors outside its exact skin target.
- Recipe validation rejects an undeclared control, part, state, value, private measurement, raw visual value, forbidden selector, missing matrix cell, or unused declared part.
- Dynamic skin changes are atomic from React's perspective. A missing next skin may appear unstyled and reports the development diagnostic; it never silently retains stale values under the new name.
- Server output includes the resolved attributes and no stylesheet tags. Hydration with matching provider inputs preserves them. A provider mismatch follows the provider contract and then updates attributes without remount.

## Rendered approval protocol

Token values advance only through a candidate manifest and a gallery generated from the packed public packages. The gallery may provide layout and labels, but it may not patch control CSS. Evidence is retained by command and artifact hash.

1. **Schema gate:** generate names/types/CSS metadata; reject missing, unknown, duplicate, malformed, out-of-range, or order-breaking values.
2. **Isolation gate:** parse built CSS and prove every value selector and recipe selector obeys this contract; mount the skin beside unowned native elements and prove their relevant computed styles do not change.
3. **Recipe gate:** compare the generated recipe manifest with the owned-part and coverage tables; every cell is covered or has a reviewed `N/A` reason.
4. **Catalog boards:** render every family and required dimension above from the packed package, including nested providers and content portaled outside provider DOM ancestry.
5. **Responsive boards:** capture at 320 CSS pixels, the normal review width, the largest supported test width, 200% text, and 400% browser zoom. Prove no required content, focus indicator, action, or popup is clipped and no page-level horizontal scroll is introduced.
6. **Accessibility boards:** measure all token color pairs and rendered composites; inspect keyboard focus, forced colors, reduced motion, text selection, autofill, disabled, invalid, checked, selected, open, and loading treatments.
7. **Browser boards:** run Chromium, Firefox, and WebKit at the exact packed revision. Differences in native Select, autofill, form controls, font metrics, focus, and portal stacking are reviewed rather than hidden by a single-browser baseline.
8. **Human review:** an independent reviewer checks coherence, hierarchy, density, alignment, typography, state legibility, long-content behavior, and family consistency. The delegated chief architect records `APPROVE` or returns named corrections. Owner acceptance remains part of the final release milestone, not a prerequisite for each candidate iteration.
9. **Baseline:** only the approved packed revision becomes the visual baseline. Pixel snapshots supplement behavioral and computed-style assertions; they do not replace them.

Required evidence names the browser/OS, viewport, zoom, color mode, forced-colors and motion settings, font load result, package tarball hashes, candidate manifest hash, screenshot or trace paths, contrast output, reviewer decision, and every `UNTESTED` path.

## Implementation sequence

1. Generate the exact manifest API and validators without changing current control appearance.
2. Add owned identity/value/state hooks and private measurement translation to native controls and Base UI adapters; assert the part manifest in server and live-renderer tests.
3. Build shared structural and accessibility recipes, including visually hidden, focus, forced-color, reduced-motion, layer, and overlay constraints.
4. Propose default-skin values and render the full catalog boards; do not treat unreviewed numbers or colors as accepted architecture.
5. Correct the candidate within the visual-review budget, approve it, and produce the deterministic value sheet and default bundle.
6. Move the gallery to the packed CSS assets and run isolation, responsive, accessibility, multi-browser, server-render, hydration, and packed-consumer gates.
7. Delete the current implicit import, provider wrapper, `:root` values, generic tag/role/descendant selectors, raw visual literals, old classes used as recipes, and obsolete focus/style mechanisms. Prove the forbidden patterns are absent from built artifacts.

These steps are architecture order, not authorization to implement. Maestro packets remain bounded by the approved control contract, Base UI integration contract, this contract, and the package/gate contract.

## Primary comparison evidence

- [Base UI styling](https://base-ui.com/react/handbook/styling) and [animation](https://base-ui.com/react/handbook/animation) establish its unstyled parts, state attributes, variables, and presence phases; Foundry translates these rather than exposing them.
- [Radix Themes](https://www.radix-ui.com/themes/docs/theme/overview), [Fluent design tokens](https://fluent2.microsoft.design/design-tokens), and [Atlassian design tokens](https://atlassian.design/foundations/tokens/use-tokens-in-code) support a generated semantic-token contract with coherent scales and typed consumption.
- W3C guidance for [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), and [use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) supplies the measurable accessibility floor. Foundry applies the stricter two-color treatment and catalog-wide evidence above.
