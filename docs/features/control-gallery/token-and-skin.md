# Token and skin contract

This is the visual authority for Core v1. It defines the values a skin must supply, the parts Foundry may style, the recipes Foundry owns, and the rendered evidence required before any skin or styling packet enters Maestro. It fixes non-aesthetic infrastructure values but does not approve default-skin aesthetic values or implement CSS.

## Outcome and boundary

Foundry owns one complete recipe set. A skin supplies the values used by those recipes. Consumers opt into both through documented CSS exports; importing `@foundry/react` never loads CSS, injects a stylesheet, or changes unrelated application markup.

The default skin is not approved from a token table alone. Its values become implementation input only after the complete control catalog has been rendered, measured, independently reviewed, and accepted under the protocol below. A future skin uses the same schema and recipes. It does not copy or replace component behavior.

Base UI has no public styling role. Its attributes, variables, classes, and DOM conveniences may be read only inside a private adapter and must be translated to the Foundry hooks in this contract.

## Three-layer model

| Layer | Owner | Contract |
| --- | --- | --- |
| Skin values | An approved Foundry skin | Supplies every required custom property for one exact skin name. Private authoring helpers may exist, but generated output contains only the semantic schema below. |
| Shared recipes | Foundry | Applies layout and visual treatment only to exact owned-part hooks. Recipes consume required tokens and private runtime measurements; they contain no unexplained visual constants. |
| Control markup | `@foundry/react` | Emits the owned part, skin, size, value, and state hooks that recipes require, including equivalent hooks on portaled parts. |

The logical CSS assets are a shared recipe sheet, one value sheet per approved skin, and a convenience default-skin bundle containing both in deterministic layer order. The package and executable-gate contract will fix their final export paths and built-file layout. JavaScript imports never imply any of these assets.

## Token schema

The source manifest is the authority. It produces CSS custom-property names, TypeScript names, validation metadata, and the documentation table from one record; those outputs may not be maintained separately.

Each entry has exactly `{ name, cssProperty, type, constraints, description }`. `FoundryTokenName` is the union of manifest names. `foundryTokenNames` and `foundryTokenDefinitions` are readonly generated values. There is no token lookup with a fallback value: a missing value must fail validation instead of silently changing the design.

Names use lower-case dot segments. Their CSS form prefixes `--foundry-` and replaces dots with hyphens; for example, `color.text.default` becomes `--foundry-color-text-default`. Renaming or removing a token is a breaking change. Adding one is also breaking for skin authors until every approved skin supplies it.

The source and generator boundary is exact:

```ts
type SkinName = string; // runtime value must match /^[a-z][a-z0-9-]{0,63}$/

type TokenConstraints =
  | { type: 'color'; alpha: 'forbid' | 'allow' }
  | { type: 'length'; unit: 'rem' | 'px' | 'zero'; min: number; max?: number }
  | { type: 'number'; min: number; max: number }
  | { type: 'time'; minMs: 0; integer: true }
  | { type: 'easing'; keywords: readonly ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']; cubicBezier: true }
  | { type: 'font-family'; genericFallback: true }
  | { type: 'font-weight'; min: 400; max: 700; integer: true }
  | { type: 'shadow'; maxLayers: 4; inset: false }
  | { type: 'layer'; min: 0; max: 2147483391; integer: true };

interface FoundryTokenDefinition {
  name: FoundryTokenName;
  cssProperty: `--foundry-${string}`;
  type: TokenConstraints['type'];
  constraints: TokenConstraints;
  description: string;
}

interface FoundrySkinTokenSource { name: string; value: string | number }
interface FoundrySkinSource {
  schemaVersion: 1;
  name: SkinName;
  tokens: readonly FoundrySkinTokenSource[];
}

type SkinIssueCode =
  | 'INVALID_SKIN_NAME' | 'MISSING_TOKEN' | 'DUPLICATE_TOKEN' | 'UNKNOWN_TOKEN'
  | 'INVALID_TOKEN_TYPE' | 'INVALID_TOKEN_VALUE' | 'TOKEN_CONSTRAINT'
  | 'CROSS_TOKEN_CONSTRAINT' | 'GENERATION_ERROR';
interface SkinIssue { code: SkinIssueCode; path: string; message: string }
type SkinBuildResult =
  | { ok: true; name: SkinName; css: string; sourceHash: string }
  | { ok: false; issues: readonly SkinIssue[] };
```

The array form deliberately preserves duplicate entries for validation. Input order has no output meaning. Generation orders declarations by `foundryTokenNames`, uses LF line endings and one terminal newline, emits the exact quoted skin selector, and reports the lower-case hexadecimal SHA-256 of UTF-8 JSON for normalized `{ schemaVersion, name, ordered tokens }`. The restricted `SkinName` grammar needs no CSS escaping and is enforced by provider runtime validation, the source validator, and the generator. A definition's `type` must equal `constraints.type`, and `cssProperty` must equal the mechanical name mapping; mismatches are generation errors.

The `@foundry/tokens` runtime-safe surface exports `defaultSkinName`, `foundryTokenNames`, `foundryTokenDefinitions`, and their exact public types. Build-only tooling accepts `FoundrySkinSource` and returns `SkinBuildResult`; its final package subpath and command belong to the package/gate contract. It throws only for programmer misuse of the tooling itself; candidate errors are returned together in deterministic token/path order.

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
| `shadow` | One through four valid non-inset box-shadow layers | Colors are concrete parseable CSS colors; alpha is allowed. Private palette helpers must resolve before this source boundary. |
| `layer` | A non-negative integer | Layer ordering must satisfy the inequalities below. |

### Required keys

Braced sets expand to every listed key. All keys are required; there are no optional Core v1 tokens.

| Category | Exact keys |
| --- | --- |
| Surfaces | `color.surface.{default,raised,sunken,overlay}` |
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

Unit and range assignment is also exact:

- font sizes, letter spacing, nonzero spacing, density, radii, motion distance, and overlay geometry use `rem`; `space.0` alone has type `length`, unit `zero`, and value `0`;
- target minimum and all border widths use `px`; compared source groups therefore never mix units;
- `font.lineHeight.tight`, `.default`, and `.relaxed` respectively use inclusive ranges `1–1.4`, `1.3–1.7`, and `1.5–2` and must be strictly increasing;
- regular, medium, and semibold weights are integers in `400–500`, `500–600`, and `600–700` and must be non-decreasing;
- alpha is allowed only for `color.backdrop` and `color.selection.background`; every other `color` token forbids alpha;
- all nonzero lengths have `min: 0` with strict positivity checked cross-token; shadow, easing, family, time, and layer values use the type rules above.

The manifest enforces these cross-token constraints:

- `target.minimum` is at least 24px; `control.height.sm < control.height.md < control.height.lg`; rendered hit-area comparison with the px target belongs to the geometry gate, not source validation;
- `font.size.xs < font.size.sm <= font.size.md < font.size.lg` and `font.size.md >= 1rem`; all text-entry recipes use at least `font.size.md` even at control size `sm`;
- `space.0` equals zero; the remaining spacing keys are strictly increasing; padding, gap, icon size, surface padding, radius, and motion distance are non-decreasing within their declared rem scales;
- `border.width.focusInner + border.width.focusOuter` is at least two CSS pixels;
- infrastructure values are exactly `layer.popup=1000`, `layer.modal=2000`, and `layer.toast=3000` in every skin;
- overlay token dimensions are positive; comparison with live available width/height after viewport margin belongs to the rendered geometry gate; and
- the default-skin candidate must meet the contrast and focus requirements in rendered evidence. A parser-valid color is not an approved color.

## Scope and cascade

`FoundryProvider` stays DOM-free. Every recipe-bearing DOM element receives all three identity attributes directly:

```html
data-foundry-skin="default" data-control="button" data-part="root"
```

The skin value sheet defines variables only on `[data-foundry-skin="<exact name>"]`. The shared recipes target the same element with the exact `data-control` and `data-part`. Because portaled content retains React context and carries its own identity, it does not depend on a provider wrapper or application ancestry.

The nearest provider supplies the resolved skin. Updating it changes every still-mounted owned part, including portals and Toast viewports, without remounting, state callbacks, focus movement, timer reset, or announcement. A nested provider affects only its own React subtree and portal boundary.

No library selector may contain `:root`, `html`, `body`, `*`, an element name, a role, an ID, a class, a consumer attribute, a descendant/child/sibling combinator, or `:has()`. A recipe selector consists of one owned target compound, optional approved value/state hooks on that same target, and only the applicable `:hover`, `:active`, `:focus-visible`, `:autofill`, `::placeholder`, or `::selection`. Grouping exact target compounds is allowed. Required visual marks use declared parts rather than generated pseudo-element content. Reduced-motion, forced-color, pointer-capability, and responsive media queries do not relax this rule.

Consumer children, native `option`/`optgroup` children, and consumer-supplied action content are never given Foundry identity and are never selected by a recipe. Foundry may style an owned wrapper around that content, but not the content itself.

Shared recipes live in named cascade layers in this order: `foundry.structure`, `foundry.recipe`, `foundry.state`, `foundry.accessibility`. Skin value sheets only declare custom properties. Stable hooks are for Foundry recipes, approved skin tooling, and observation; per-instance consumer CSS overrides are unsupported.

## Owned parts

Part names are public styling and test contracts. DOM-free roots emit no part. Each listed part is required when its corresponding content exists; conditional parts are marked.

| Control | Exact `data-control` | Exact recipe-bearing parts |
| --- | --- | --- |
| Field | `field` | `root`, `label`, `required-marker` (required only), `description` (conditional), `error` (conditional) |
| Group | `group` | `root`, `legend` |
| Button | `button` | `root`, `loading-indicator` (loading only and hidden from assistive technology), `loading-announcer` (transient and visually hidden) |
| TextField | `text-field` | `root` |
| NativeSelect | `native-select` | `root`, `input`, `indicator` |
| Checkbox | `checkbox` | `root`, `input`, `indicator` |
| Switch | `switch` | `root`, `input`, `track`, `thumb` |
| RadioGroup | `radio-group` | `root`, `legend`, `option`, `input`, `indicator`, `label`, `description` (conditional per option) |
| SearchField | `search-field` | `root`, `input`, `clear` (non-empty editable value only) |
| StatusChip | `status-chip` | `root` |
| Banner | `banner` | `root`, `title`, `description`, `action` (conditional), `dismiss` (conditional), `announcer` (transient when announcement is requested) |
| EmptyState | `empty-state` | `root`, `title`, `description`, `action` (conditional) |
| LoadingSkeleton | `loading-skeleton` | `root`, `line` (one through six) |
| Card | `card` | `root`, `title`, `description` (conditional), `content` (conditional) |
| Dialog | `dialog` | `trigger` (conditional), `backdrop`, `viewport`, `content`, `title`, `description` (conditional), `close` (one system action plus any declared close parts) |
| Drawer | `drawer` | `trigger` (conditional), `backdrop`, `viewport`, `content`, `title`, `description` (conditional), `close` (one system action plus any declared close parts) |
| Popover | `popover` | `trigger`, `positioner`, `content`, `title`, `description` (conditional), `close` (zero or more) |
| Menu | `menu` | `trigger`, `positioner`, `content`, `group` (conditional), `group-label` (conditional), `item`, `separator` (conditional) |
| Tabs | `tabs` | `list`, `trigger`, `panel` |
| Toast | `toast` | `viewport`, `announcer`, `root`, `content`, `title`, `description` (conditional), `action` (conditional), `close` |

An internal portal node used only for mounting and an internal positioning node with no box or visual behavior are not parts. A node becomes a declared part as soon as a recipe gives it layout, size, paint, typography, motion, or hit-area behavior.

Native semantics and public refs do not move to the visual wrapper. `NativeSelect`, Checkbox, Switch, and SearchField forward their public props and refs to the documented native `select` or `input`; RadioGroup still forwards its ref to the `fieldset`. Their `root`, `indicator`, `track`, and `thumb` parts are private non-semantic presentation nodes, are hidden from the accessibility tree where appropriate, and cannot receive focus or events independently. The native input covers the hit area and remains the form, autofill, validation, reset, keyboard, focus, and accessibility authority. Button's visual loading indicator does not replace or hide its accessible name.

Current `data-control="search"` migrates to `search-field`; current `Select` gains `native-select`; current root-only and ad hoc bar/clear hooks are replaced by this table. No compatibility selector ships in Core v1.

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

The recipe manifest is data and is the sole source of generated CSS. Its exact record is:

```ts
type RecipeLayer = 'structure' | 'recipe' | 'state' | 'accessibility';
type RecipeCondition =
  | { kind: 'value'; hook: 'size'; value: 'sm' | 'md' | 'lg' }
  | { kind: 'value'; hook: 'variant'; value: 'primary' | 'secondary' | 'destructive' | 'link' }
  | { kind: 'value'; hook: 'tone'; value: 'neutral' | 'success' | 'warning' | 'danger' }
  | { kind: 'value'; hook: 'orientation'; value: 'horizontal' | 'vertical' }
  | { kind: 'value'; hook: 'side'; value: 'top' | 'bottom' | 'left' | 'right' }
  | { kind: 'value'; hook: 'align'; value: 'start' | 'center' | 'end' }
  | { kind: 'presence'; hook: 'disabled' | 'readonly' | 'invalid' | 'loading' | 'checked' | 'indeterminate' | 'selected' | 'open' | 'focus-visible' | 'highlighted' | 'entering' | 'exiting' }
  | { kind: 'pseudo'; value: 'hover' | 'active' | 'focus-visible' | 'autofill' | 'placeholder' | 'selection' }
  | { kind: 'media'; value: 'reduced-motion' | 'forced-colors' | 'fine-pointer' | 'narrow' };
type RecipeValue =
  | { kind: 'token'; name: FoundryTokenName }
  | { kind: 'private'; name: FoundryPrivateVariable }
  | { kind: 'constant'; value: ApprovedRecipeConstant }
  | { kind: 'accessibility-constant'; value: ForcedColorConstant }
  | { kind: 'number'; value: -2 | -1 | 0 | 0.6 | 1 | 2 }
  | { kind: 'arithmetic'; operator: 'add' | 'subtract'; left: RecipeValue; right: RecipeValue }
  | { kind: 'multiply'; factor: -2 | -1 | 1 | 2; value: RecipeValue }
  | { kind: 'function'; name: 'min' | 'max' | 'translateX' | 'translateY' | 'scale' | 'rotate'; args: readonly RecipeValue[] }
  | { kind: 'keyframes'; name: FoundryKeyframeName }
  | { kind: 'list'; separator: 'space' | 'comma'; values: readonly RecipeValue[] };
interface CssRecipeRecord {
  id: string;
  control: FoundryControlName;
  part: FoundryPartName;
  conditions: readonly RecipeCondition[];
  layer: RecipeLayer;
  priority: number;
  property: RecipeProperty;
  value: RecipeValue;
}
interface NaRecipeRecord {
  id: string;
  control: FoundryControlName;
  part: FoundryPartName;
  conditions: readonly RecipeCondition[];
  naReason: string;
}
type RecipeRecord = CssRecipeRecord | NaRecipeRecord;

type RecipeBundleName =
  | 'hidden' | 'stack' | 'text' | 'button' | 'field-control'
  | 'choice-root' | 'choice-input' | 'choice-indicator' | 'switch-track' | 'switch-thumb'
  | 'surface' | 'overlay-backdrop' | 'overlay-viewport' | 'floating-positioner'
  | 'modal-surface' | 'popup-surface' | 'collection' | 'feedback' | 'skeleton-line' | 'spinner';
type RecipeTemplateValue = RecipeValue | { kind: 'parameter'; name: string };
interface RecipeTemplateRecord {
  id: string;
  layer: RecipeLayer;
  priority: number;
  property: RecipeProperty;
  value: RecipeTemplateValue;
}
interface RecipeBundleDefinition {
  name: RecipeBundleName;
  parameters: readonly { name: string; allowed: readonly RecipeValue[] }[];
  declarations: readonly RecipeTemplateRecord[];
}
interface RecipeBundleApplication {
  id: string;
  bundle: RecipeBundleName;
  control: FoundryControlName;
  part: FoundryPartName;
  conditions: readonly RecipeCondition[];
  parameters: readonly { name: string; value: RecipeValue }[];
}

type FoundryKeyframeName =
  | 'foundry-enter-top' | 'foundry-enter-right' | 'foundry-enter-bottom' | 'foundry-enter-left'
  | 'foundry-exit-top' | 'foundry-exit-right' | 'foundry-exit-bottom' | 'foundry-exit-left'
  | 'foundry-spin' | 'foundry-skeleton-pulse';
interface FoundryKeyframeRecord {
  name: FoundryKeyframeName;
  frames: readonly {
    offset: 0 | 1;
    declarations: readonly {
      property: 'opacity' | 'transform';
      value: RecipeValue;
    }[];
  }[];
}
interface FoundryRecipeManifest {
  schemaVersion: 1;
  bundleDefinitions: readonly RecipeBundleDefinition[];
  bundleApplications: readonly RecipeBundleApplication[];
  keyframes: readonly FoundryKeyframeRecord[];
  records: readonly RecipeRecord[];
}

type ApprovedRecipeConstant =
  | 'none' | 'auto' | 'normal' | 'hidden' | 'visible' | 'transparent' | 'currentColor'
  | '0' | '100%' | 'border-box' | 'absolute' | 'fixed' | 'relative'
  | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid'
  | 'center' | 'start' | 'end' | 'stretch' | 'row' | 'column' | 'pointer' | 'not-allowed'
  | 'solid' | 'nowrap' | 'break-word' | 'isolate' | 'linear' | 'infinite'
  | 'color' | 'opacity' | 'transform' | 'background-color' | 'border-color' | 'box-shadow'
  | '0s' | '1px' | '-1px' | '16px' | '0deg' | '45deg' | '90deg' | '180deg' | '360deg'
  | 'rect(0 0 0 0)' | 'inset(50%)';
type ForcedColorConstant =
  | 'Canvas' | 'CanvasText' | 'ButtonFace' | 'ButtonText'
  | 'Highlight' | 'HighlightText' | 'GrayText';
type FoundryPrivateVariable =
  | '--foundry-private-anchor-width' | '--foundry-private-anchor-height'
  | '--foundry-private-available-width' | '--foundry-private-available-height'
  | '--foundry-private-popup-width' | '--foundry-private-popup-height'
  | '--foundry-private-positioner-width' | '--foundry-private-positioner-height'
  | '--foundry-private-transform-origin'
  | '--foundry-private-layer-backdrop' | '--foundry-private-layer-content';

type RecipeIssueCode =
  | 'UNKNOWN_CONTROL' | 'UNKNOWN_PART' | 'UNKNOWN_HOOK' | 'UNKNOWN_PRIVATE_VARIABLE'
  | 'UNKNOWN_BUNDLE' | 'UNKNOWN_BUNDLE_PARAMETER' | 'MISSING_BUNDLE_PARAMETER'
  | 'DUPLICATE_BUNDLE_PARAMETER' | 'INVALID_KEYFRAME'
  | 'FORBIDDEN_PROPERTY' | 'FORBIDDEN_VALUE' | 'FORBIDDEN_SELECTOR'
  | 'INVALID_PRIORITY' | 'CONFLICTING_RECORD' | 'MISSING_COVERAGE'
  | 'INVALID_NA' | 'UNUSED_PART' | 'GENERATION_ERROR';
interface RecipeIssue { code: RecipeIssueCode; recordId?: string; path: string; message: string }
type RecipeBuildResult =
  | { ok: true; css: string; manifestHash: string }
  | { ok: false; issues: readonly RecipeIssue[] };
declare function buildFoundryRecipes(source: FoundryRecipeManifest): RecipeBuildResult;
```

`FoundryControlName` and each control-specific `FoundryPartName` come from the owned-parts table. `RecipeProperty` is the literal union of `display`, `position`, `inset`, `inset-block`, `inset-block-start`, `inset-block-end`, `inset-inline`, `inset-inline-start`, `inset-inline-end`, `box-sizing`, `inline-size`, `block-size`, `min-inline-size`, `max-inline-size`, `min-block-size`, `max-block-size`, `padding`, `padding-block`, `padding-inline`, `margin`, `gap`, `grid-area`, `grid-template-columns`, `grid-template-rows`, `grid-auto-flow`, `flex-direction`, `flex-wrap`, `align-items`, `align-self`, `justify-content`, `justify-self`, `overflow`, `overflow-x`, `overflow-y`, `overflow-wrap`, `pointer-events`, `cursor`, `appearance`, `opacity`, `visibility`, `color`, `background-color`, every border and outline longhand, `border-radius`, `box-shadow`, every font longhand, `letter-spacing`, `text-align`, `text-decoration`, `white-space`, `z-index`, `transform`, `transform-origin`, every transition and animation longhand, `clip`, `clip-path`, and `forced-color-adjust`. Shorthands are expanded before validation. A reviewed `N/A` record has no CSS property/value and names the otherwise required coverage cell.

Arithmetic is a typed AST, not an arbitrary CSS string. `add` and `subtract` require compatible lengths; `multiply` requires a length and one declared unitless factor. The serializer emits one outer `calc()` with explicit parentheses and canonical spaces. This expresses, for example, `availableWidth - 2*overlay.viewportMargin` and a signed motion distance without accepting raw `calc()` text. `min` and `max` require two or more compatible values; `translateX`/`translateY` require one length, `scale` one number, and `rotate` one declared angle constant. A `keyframes` value is valid only for `animation-name`. Direction uses the final physical `data-side`, so no logical-direction inference occurs in CSS.

Bundles are source data, not prose macros. `foundryRecipeBundleDefinitions`, `foundryRecipeBundleApplications`, `foundryKeyframes`, and direct `RecipeRecord` entries together form the one recipe manifest. Parameter arrays preserve duplicates for validation. Each application must supply every declared parameter exactly once with one of its definition's allowed values. The generator substitutes parameters and emits one `CssRecipeRecord` per template declaration with ID `<application id>.<template id>`; an unknown, missing, duplicate, unused, or out-of-domain parameter fails the whole build. No unexpanded bundle reaches CSS.

The following notation is normative: `S<n>` means `foundry.structure` priority `<n>` and `R<n>` means `foundry.recipe` priority `<n>`; semicolon-separated `property=value` pairs are separate template declarations. `$name` is a required typed application parameter. `token(name)` and `private(name)` are the corresponding `RecipeValue` nodes. These are the complete base declarations; a bundle emits no unlisted property.

| Bundle | Required parameters | Exact emitted declarations |
| --- | --- | --- |
| `hidden` | none | S100 `position=absolute; inline-size=1px; block-size=1px; padding=0; margin=-1px; overflow=hidden; white-space=nowrap; border-width=0; clip=rect(0 0 0 0); clip-path=inset(50%)` |
| `stack` | `$gap`, `$align`, `$justify` | S100 `display=grid; gap=$gap; margin=0; min-inline-size=0; align-items=$align; justify-content=$justify` |
| `text` | `$size`, `$lineHeight`, `$weight`, `$letterSpacing`, `$color` | R100 `font-family=token(font.family.body); font-size=$size; line-height=$lineHeight; font-weight=$weight; letter-spacing=$letterSpacing; color=$color; min-inline-size=0; overflow-wrap=break-word` |
| `button` | `$height`, `$paddingInline`, `$paddingBlock`, `$gap`, `$fontSize`, `$foreground`, `$background`, `$border`, `$cursor` | S100 `display=inline-flex; box-sizing=border-box; align-items=center; justify-content=center; min-block-size=token(target.minimum); block-size=$height; padding-inline=$paddingInline; padding-block=$paddingBlock; gap=$gap`; R100 `font-family=token(font.family.body); font-size=$fontSize; line-height=token(font.lineHeight.default); font-weight=token(font.weight.semibold); color=$foreground; background-color=$background; border-style=solid; border-width=token(border.width.default); border-color=$border; border-radius=token(radius.control); cursor=$cursor; transition-property=color, background-color, border-color, box-shadow; transition-duration=token(motion.duration.fast); transition-timing-function=token(motion.easing.standard)` |
| `field-control` | `$height`, `$paddingInline`, `$paddingBlock`, `$fontSize` | S100 `box-sizing=border-box; inline-size=100%; min-block-size=token(target.minimum); block-size=$height; padding-inline=$paddingInline; padding-block=$paddingBlock`; R100 `font-family=token(font.family.body); font-size=$fontSize; line-height=token(font.lineHeight.default); color=token(color.field.foreground); background-color=token(color.field.background); border-style=solid; border-width=token(border.width.default); border-color=token(color.field.border); border-radius=token(radius.control); transition-property=color, background-color, border-color, box-shadow; transition-duration=token(motion.duration.fast); transition-timing-function=token(motion.easing.standard)` |
| `choice-root` | `$size` | S100 `display=inline-grid; position=relative; box-sizing=border-box; inline-size=$size; block-size=$size; min-inline-size=token(target.minimum); min-block-size=token(target.minimum); align-items=center; justify-content=center` |
| `choice-input` | none | S100 `position=absolute; inset=0; inline-size=100%; block-size=100%; margin=0; appearance=none; opacity=0; cursor=pointer` |
| `choice-indicator` | `$size`, `$radius` | S100 `display=grid; box-sizing=border-box; inline-size=$size; block-size=$size; align-items=center; justify-content=center; pointer-events=none`; R100 `color=token(color.field.foreground); background-color=token(color.field.background); border-style=solid; border-width=token(border.width.default); border-color=token(color.field.border); border-radius=$radius` |
| `switch-track` | `$inlineSize`, `$blockSize` | S100 `display=grid; position=relative; box-sizing=border-box; inline-size=$inlineSize; block-size=$blockSize; align-items=center; pointer-events=none`; R100 `background-color=token(color.field.background); border-style=solid; border-width=token(border.width.default); border-color=token(color.field.border); border-radius=token(radius.round)` |
| `switch-thumb` | `$size` | S100 `inline-size=$size; block-size=$size; pointer-events=none`; R100 `background-color=currentColor; border-radius=token(radius.round); transition-property=transform; transition-duration=token(motion.duration.fast); transition-timing-function=token(motion.easing.standard)` |
| `surface` | `$padding`, `$background`, `$foreground`, `$border`, `$elevation` | S100 `box-sizing=border-box; min-inline-size=0; padding=$padding; overflow-wrap=break-word`; R100 `color=$foreground; background-color=$background; border-style=solid; border-width=token(border.width.default); border-color=$border; border-radius=token(radius.surface); box-shadow=$elevation` |
| `overlay-backdrop` | none | S100 `position=fixed; inset=0; z-index=private(--foundry-private-layer-backdrop)`; R100 `background-color=token(color.backdrop)` |
| `overlay-viewport` | none | S100 `position=fixed; inset=0; display=grid; box-sizing=border-box; padding=token(overlay.viewportMargin); overflow=auto; z-index=private(--foundry-private-layer-content)` |
| `floating-positioner` | `$maxInlineSize`, `$maxBlockSize` | S100 `position=fixed; box-sizing=border-box; max-inline-size=$maxInlineSize; max-block-size=$maxBlockSize; visibility=hidden; z-index=private(--foundry-private-layer-content)` |
| `modal-surface` | `$padding`, `$maxInlineSize`, `$elevation` | S100 `box-sizing=border-box; max-inline-size=$maxInlineSize; max-block-size=100%; padding=$padding; overflow=auto`; R100 `color=token(color.text.default); background-color=token(color.surface.overlay); border-style=solid; border-width=token(border.width.default); border-color=token(color.border.default); border-radius=token(radius.surface); box-shadow=$elevation` |
| `popup-surface` | `$padding`, `$maxInlineSize`, `$maxBlockSize`, `$elevation` | S100 `box-sizing=border-box; max-inline-size=$maxInlineSize; max-block-size=$maxBlockSize; padding=$padding; overflow=auto; transform-origin=private(--foundry-private-transform-origin)`; R100 `color=token(color.text.default); background-color=token(color.surface.overlay); border-style=solid; border-width=token(border.width.default); border-color=token(color.border.default); border-radius=token(radius.surface); box-shadow=$elevation` |
| `collection` | `$gap`, `$padding`, `$flow` | S100 `display=flex; flex-direction=$flow; gap=$gap; min-inline-size=0; padding=$padding` |
| `feedback` | `$background`, `$foreground`, `$border`, `$elevation` | R200 `color=$foreground; background-color=$background; border-color=$border; box-shadow=$elevation` |
| `skeleton-line` | none | R100 `color=transparent; background-color=token(color.skeleton.base); animation-name=foundry-skeleton-pulse; animation-duration=token(motion.duration.slow); animation-timing-function=token(motion.easing.standard); animation-iteration-count=infinite` |
| `spinner` | `$size` | S100 `box-sizing=border-box; inline-size=$size; block-size=$size`; R100 `color=currentColor; border-style=solid; border-width=token(border.width.strong); border-color=currentColor; border-inline-end-color=transparent; border-radius=token(radius.round); animation-name=foundry-spin; animation-duration=token(motion.duration.medium); animation-timing-function=linear; animation-iteration-count=infinite` |

For constrained floating applications, `$maxInlineSize` and `$maxBlockSize` use `{ kind: 'function', name: 'min', args: [limit, { kind: 'arithmetic', operator: 'subtract', left: available, right: { kind: 'multiply', factor: 2, value: margin } }] }`; `limit`, `available`, and `margin` are the exact family token, matching private available-size variable, and `overlay.viewportMargin` token named in the application table below. The compact table text is not a raw-string exception. `infinite` and `linear` are permitted only as the exact animation constants shown. The validator rejects them in any other property.

The keyframe records are also exact. Every record contains offsets `0` and `1` once, in that order, and no other declaration:

| Keyframe | Offset 0 | Offset 1 |
| --- | --- | --- |
| `foundry-enter-top` | `opacity=0; transform=translateY(+motion.distance.short)` | `opacity=1; transform=translateY(0)` |
| `foundry-enter-right` | `opacity=0; transform=translateX(-motion.distance.short)` | `opacity=1; transform=translateX(0)` |
| `foundry-enter-bottom` | `opacity=0; transform=translateY(-motion.distance.short)` | `opacity=1; transform=translateY(0)` |
| `foundry-enter-left` | `opacity=0; transform=translateX(+motion.distance.short)` | `opacity=1; transform=translateX(0)` |
| `foundry-exit-top` | `opacity=1; transform=translateY(0)` | `opacity=0; transform=translateY(+motion.distance.short)` |
| `foundry-exit-right` | `opacity=1; transform=translateX(0)` | `opacity=0; transform=translateX(-motion.distance.short)` |
| `foundry-exit-bottom` | `opacity=1; transform=translateY(0)` | `opacity=0; transform=translateY(-motion.distance.short)` |
| `foundry-exit-left` | `opacity=1; transform=translateX(0)` | `opacity=0; transform=translateX(+motion.distance.short)` |
| `foundry-spin` | `transform=rotate(0deg)` | `transform=rotate(360deg)` |
| `foundry-skeleton-pulse` | `opacity=0.6` | `opacity=1` |

Popover/Menu select enter/exit keyframes from final physical `data-side`; Drawer uses its final physical side; Dialog and Toast use bottom; Banner uses top. Reduced motion replaces `animation-name` and `transition-property` with `none`, duration with `0s`, and emits no keyframe reference.

Recipe generation returns `RecipeBuildResult`, expands and validates bundles before direct records, validates every keyframe reference, orders issues by record ID/path/code, orders successful CSS by layer then priority then control/part/property/condition, orders keyframes by `FoundryKeyframeName`, uses the same LF policy, and hashes the normalized definitions, applications, keyframes, and direct records with SHA-256. It never emits partial CSS on failure.

Every part has the following bundle applications. Parts named in the owned-parts table but not listed separately inherit the row that names their role; no application is inferred from an HTML element or descendant.

| Controls and parts | Exact base applications |
| --- | --- |
| Field `root`; Group `root` | `stack(gap=size gap, align=stretch, justify=start)`; Group also `surface(default)`. |
| `label`, `legend`, `title`, `description`, `error`, `group-label`, `required-marker` | One `text(role)` application from the role table below. Announcers use `hidden`. |
| Button `root`; overlay triggers and closes; feedback actions and dismisses | `button(action=variant for Button, secondary otherwise, size)`. Search clear alone uses `button(action=link, size)`. Button loading indicator uses `spinner(size=control.iconSize.<size>)`; loading announcer uses `hidden`. |
| TextField `root`; NativeSelect `input`; SearchField `input` | `field-control(size)`. NativeSelect/Search roots use `stack(gap=space.0, align=stretch, justify=stretch)` plus direct `position=relative`; NativeSelect input adds direct `appearance=none`. NativeSelect indicator uses `choice-indicator(size=control.iconSize.<size>, radius=radius.round)` plus direct chevron-mark records. |
| Checkbox | root `choice-root`; input `choice-input`; indicator `choice-indicator(radius=radius.control)`. |
| Switch | root `choice-root`; input `choice-input`; track `switch-track`; thumb `switch-thumb`. |
| RadioGroup | root and each option `stack`; input `choice-input`; indicator `choice-indicator(radius=radius.round)`; option label/description use their text roles. |
| StatusChip | root `surface(default)` plus `feedback(tone)`; content uses the body text role. |
| Banner | root `surface(default)` plus `feedback(tone)` and `stack`; title/description use text roles; action/dismiss use secondary button. |
| EmptyState | root `surface(default)` plus `stack`; title/description use text roles; action uses secondary button. |
| LoadingSkeleton | root `surface(sunken)` plus `stack`; each line uses `skeleton-line`. |
| Card | root `surface(default)` plus `stack`; title/description use text roles; content uses `stack`. |
| Dialog/Drawer | backdrop `overlay-backdrop`; viewport `overlay-viewport`; Dialog content `modal-surface(padding=surface.padding.md, maxInlineSize=dialog.maxInlineSize, elevation=elevation.modal)`; Drawer content uses the same bundle with `maxInlineSize=drawer.inlineSize`; title/description text; close secondary button. Dialog viewport adds direct `align-items=center; justify-content=center`; Drawer viewport adds the physical-side alignment record selected by `data-side`. |
| Popover/Menu | Positioner and content receive the same width expression `min(token(<family>.maxInlineSize), private(--foundry-private-available-width) - 2*token(overlay.viewportMargin))` and height expression `min(token(overlay.maxBlockSize), private(--foundry-private-available-height) - 2*token(overlay.viewportMargin))`. Positioner uses `floating-positioner`; content uses `popup-surface(padding=surface.padding.md, elevation=elevation.popup)`. Each final `data-side` record sets positioner `visibility=visible`; absence of a current side keeps it hidden. Menu content/group also use `collection`; group label text; item uses a secondary button application with direct full-width and logical-justify records; separator uses direct strong border records. |
| Tabs | list `collection`; trigger secondary `button`; panel `surface(default, elevation=none)`. Selected indicator is a direct state record on trigger. |
| Toast | viewport direct fixed logical block-end/inline-end records plus `stack` and private toast-layer content value; root `surface(overlay, elevation.toast)` plus `feedback(tone)`; content `stack`; title/description text; action/close secondary button; announcer `hidden`. |

Size parameter expansion is mechanical. For `sm`, `md`, or `lg`, `$height`, `$paddingInline`, `$paddingBlock`, `$gap`, `$fontSize`, `$padding`, and `$size` respectively resolve to `control.height.<size>`, `control.paddingInline.<size>`, `control.paddingBlock.<size>`, `control.gap.<size>`, `font.size.<size>`, `surface.padding.<size>`, and `control.iconSize.<size>`. Text-entry and NativeSelect `$fontSize` is instead `max(token(font.size.md/md/lg), 16px)`; `16px` is permitted only as the second `max` argument for those native font-size records. StatusChip text is `font.size.xs/sm/md`. Switch `$blockSize` is `control.iconSize.<size>`, `$inlineSize` is exactly twice that token through `multiply`, and thumb `$size` is that token minus twice `border.width.default` through `subtract` plus `multiply`. Every three-size application expands to three records conditioned on the matching `data-size`; there is no runtime lookup or string construction.

Text roles are exact: title is `lg/tight/semibold/normal/default text`; label and legend are `sm/default/semibold/label/default text`; description is `md/default/regular/normal/muted text`; error and required marker are `md/default/medium/normal/danger foreground`; group label is `sm/default/semibold/label/subtle text`; ordinary content is the size-resolved body size with `default/regular/normal/default text`.

Action and surface parameters are exact. Primary, secondary, and destructive Button variants select the same-named `color.action.*` foreground/background/border group; Link and Search clear use link foreground with transparent background and border. All other button-shaped parts use secondary. Every base button cursor is `pointer`; disabled direct records replace it with `not-allowed`. Tone-bearing controls map to `color.status.<tone>.{background,foreground,border}` with `box-shadow=none`, except Toast uses `elevation.toast`. `surface(default)` uses default surface/text/border and `box-shadow=none`; `surface(sunken)` substitutes the sunken surface; `surface(overlay)` uses overlay surface/default text/default border. Popup and modal applications use `elevation.popup` and `.modal`; ordinary raised Card use is not part of Core v1 unless a later public variant adds it.

State paint mapping is exact: action hover/active use their group's `backgroundHover`/`backgroundActive`; field hover uses `color.field.backgroundHover` and `borderHover`; read-only uses `backgroundReadOnly`; invalid uses `borderInvalid`; disabled fields use the three field disabled tokens and other disabled parts use `color.surface.sunken`, `color.text.disabled`, and `color.border.disabled`. Checked/indeterminate choices use primary background/foreground/border; selected Tabs use primary foreground plus a strong-width primary-border indicator; highlighted Menu items use sunken surface plus a strong non-color outline; open triggers use raised surface and strong border. Focus uses concentric `focusInner`/`focusOuter` colors with their exact width tokens and no layout shift. Enter/exit use the family elevation, opacity, `motion.distance.short`, matching enter/exit easing, and medium duration; ordinary hover/active transitions use fast/standard. Skeleton uses base/highlight colors with slow/standard motion.

State records follow this increasing priority: base `100`; size/orientation/side/align/variant/tone `200`; hover/autofill `300`; active/open/checked/indeterminate/selected/highlighted `400`; entering `410`; exiting `420`; read-only `500`; invalid `550`; loading `600`; disabled `700`; focus-visible `800`; reduced-motion `900`; forced-colors `1000`. Equal priority is a validation error for the same control/part/property/condition specificity.

Compound states resolve as follows:

- disabled suppresses hover/active paint and wins foreground/background/border/cursor, while checked/indeterminate/selected geometry remains visible; a highlighted disabled Menu item retains a non-color discovery outline;
- loading suppresses hover/active and uses disabled paint without adding native `disabled`; focus-visible remains visible because loading Button stays focusable;
- invalid wins the ordinary and read-only border; disabled paint wins an invalid control's boundary while its invalid semantics and error content remain;
- selected, checked, indeterminate, highlighted, and open geometry survives tone/variant paint; focus-visible always wins focus properties only;
- entering and exiting are mutually exclusive; if an adapter violation presents both, exiting wins and reports an internal contract error;
- autofill replaces ordinary field foreground/background, then invalid, disabled, and focus rules apply; and
- reduced motion overrides only motion declarations, while forced colors replaces color, border, shadow, mark, and focus paint without changing geometry, state, or timing.

### Private runtime variables

Only these private variables may cross from a Base UI renderer or layer registry into a recipe:

| Foundry variable | Type | Writer and source | Consumer and clearing rule |
| --- | --- | --- | --- |
| `--foundry-private-anchor-width` / `-height` | CSS length | Floating adapter aliases Base `--anchor-width` / `--anchor-height`. | Positioner/content sizing; unset on close, anchor loss, portal move, or unmount. |
| `--foundry-private-available-width` / `-height` | CSS length | Floating adapter aliases Base `--available-width` / `--available-height`. | Popup max size; content remains hidden until both are current, then unset on the same stale paths. |
| `--foundry-private-popup-width` / `-height` | CSS length | Floating adapter aliases Base `--popup-width` / `--popup-height`. | Collision/motion evidence only; unset with the positioner. |
| `--foundry-private-positioner-width` / `-height` | CSS length | Floating adapter aliases Base `--positioner-width` / `--positioner-height`. | Collision/motion evidence only; unset with the positioner. |
| `--foundry-private-transform-origin` | CSS position | Floating adapter aliases Base `--transform-origin`. | Popup transform origin; unset with the positioner. |
| `--foundry-private-layer-backdrop` / `-content` | integer | Document layer registry writes final z-index values. | Backdrop/viewport/content/positioner/Toast viewport; removed only after exit or unmount. |

The adapter creates aliases on the exact owned positioner/content element; a recipe never reads Base UI's variable directly. Values are refreshed on placement, resize, scroll, portal migration, and anchor reconnection. A connected floating surface remains `visibility:hidden` and inert until current available size and placement exist. Disconnection clears the aliases before the documented hide/close path, so last coordinates or measurements are never presented as current.

Rendered geometry has exact formulas. Every interactive public element's `getBoundingClientRect()` must be at least `target.minimum` in both axes; for visual-host controls the absolute native input must equal the root rectangle. Dialog/Drawer viewport inline and block availability is the viewport minus twice `overlay.viewportMargin`. Popover/Menu content uses `min(<family>.maxInlineSize, availableWidth - 2*overlay.viewportMargin)` and `min(overlay.maxBlockSize, availableHeight - 2*overlay.viewportMargin)`; a non-positive result keeps content hidden and reports a placement failure. Toast viewport inline size is `min(toast.inlineSize, 100vw - 2*overlay.viewportMargin)`.

Every packed browser board asserts `parseFloat(getComputedStyle(element).fontSize) >= 16` for the native `input` in TextField and SearchField and the native `select` in NativeSelect at `sm`, `md`, and `lg`. The assertion runs once under the normal application root and once inside an isolated fixture with root `font-size: 12px`; it covers default, disabled, invalid, and read-only where supported. A value below 16px fails the board even when the source token satisfies `font.size.md >= 1rem`. These are live browser assertions, not source-token comparisons.

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

System colors are accessibility constants, not skin tokens or raw values. They are valid only in `foundry.accessibility` records with `media=forced-colors`: backgrounds use `Canvas`, `ButtonFace`, or `Highlight`; foregrounds use `CanvasText`, `ButtonText`, `HighlightText`, or `GrayText`; borders/marks use `ButtonText`, `Highlight`, or `GrayText`; and the two focus edges use `Canvas` plus `Highlight`. `transparent` and `currentColor` remain the general approved constants above. `forced-color-adjust:none` is limited to Checkbox indicator, RadioGroup indicator, and Switch track/thumb records and requires a matching browser assertion. Any system color elsewhere fails recipe validation.

### Motion and layering

Only opacity and transform may animate for entry, exit, and lightweight feedback. Layout, focus, scroll position, and anchor coordinates never animate. Exit presence remains mounted until its recipe completes. In `prefers-reduced-motion: reduce`, animation and transition are removed, movement is zero, exit completes immediately, and state, focus, queue, and announcement timing remain unchanged.

Layer tokens are infrastructure, not aesthetic choices: every valid skin supplies `layer.popup=1000`, `layer.modal=2000`, and `layer.toast=3000`. The source validator refuses any other values. This keeps layers comparable across different skins and nested providers.

Each document owns one private allocator per band. Provider boundaries retain independent ownership namespaces for cleanup, but parent and nested providers in the same document share the allocator and therefore one total order. Every record stores immutable `recordId`, provider owner, band, monotonic `createdSequence`, and optional `owningModalRecordId`. Backdrop and content share one record. Popup records use only the content value and leave their paired backdrop value unused.

Popup and toast bands are ordered by `createdSequence`. The modal band is an ordered forest: top-level Dialog/Drawer records are roots ordered by `createdSequence`; a promoted Popover/Menu is a child of the nearest owning modal record; siblings are ordered by `createdSequence`. Preorder traversal assigns ordinals `0–127`, visiting a modal record before all of its promoted descendants and visiting the next modal root only after the previous root's complete subtree. The backdrop value is `base + 2*ordinal`; content is `base + 2*ordinal + 1`.

This traversal defines the non-top-modal path exactly. A Popover/Menu opened by parent-controlled state while its owning modal is below a later modal is inserted at the end of its owner's subtree, which shifts later modal-root ordinals upward while preserving their relative order. The promoted surface therefore stays above its owner and below the later modal's backdrop. The modal manager marks that promoted portal subtree inert and hidden from the accessibility tree while its owner is not topmost; its logical open state, record, and callbacks are unchanged. User activation cannot originate from the inactive modal. When later modals close, the existing promoted surface is remeasured and becomes interactive after current placement exists, without remount, open callback, focus theft, or a new record. If its owner closes first, the promoted child follows its normal accepted close/exit path and both records are released after exit.

Removal after exit or unmount recomputes preorder ordinals and compacts holes without changing record identity or relative order. Inserting a promoted descendant may likewise change later numeric ordinals; adapters update both private layer variables in one layout commit before paint. Portal migration within the same document retains record identity, owner, parent relation, and `createdSequence`; migration to another document releases the old record and preflights a new document allocation before moving content.

Dialog/Drawer allocate as modal roots, ordinary Popover/Menu in popup, modal-owned Popover/Menu as promoted modal descendants, and Toast viewports in toast. Nested providers inherit the nearest modal ownership context. The 129th simultaneous record in one band reports `FOUNDRY_LAYER_CAPACITY`; parent-driven open renders no portal content and user-driven preflight refuses before an open callback. Closing or unmounting a record and retrying is recovery. No recipe uses `z-index` outside the two private layer variables.

## Skin lifecycle and failure behavior

- `SkinName` must match `/^[a-z][a-z0-9-]{0,63}$/`. Invalid provider input throws `FOUNDRY_SKIN_NAME_INVALID` during render before owned markup or listeners exist. The restricted value is written literally to every owned part and safely serialized by the generator as a quoted attribute-selector string.
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

## Production sequence

This is the same canonical production order used by the control and Base UI contracts:

1. Generate the exact token, part, recipe, and skin schemas plus validators without changing control appearance.
2. Add the exact Base UI dependency, private adapter boundary, state bridge, direction resolver, provider, portal lifecycle, document layer allocator, owned-hook infrastructure, and explicit public exports.
3. Correct native fields, actions, names, visual hosts, and hooks, including Button content, `NativeSelect`, `SearchField`, state unions, reset recovery, and system labels; do not route them through Base UI.
4. Rebase Dialog and Drawer on the shared modal adapter and emit their exact owned parts, hooks, and layer variables.
5. Add the shared positioner/measurement policy, then rebase Popover and Menu; remove `MenuClose` and add the approved structure and translated private variables.
6. Rebase Tabs with the private composition and recovery registry plus its owned parts and hooks.
7. Replace static Toast with the Foundry queue over Base UI Toast parts, correct feedback heading/live semantics, and emit its owned parts and hooks.
8. Generate shared recipes, propose and render default-skin values, correct the candidate through independent visual review, and approve the deterministic value sheet and default bundle.
9. Build the packed package, move the gallery to packed public and CSS imports, delete every superseded styling mechanism, and run the complete cross-family release evidence. Compatibility aliases may exist only inside one migration branch; none ship in Core v1.

Step 9 deletes the current implicit import, provider wrapper, `:root` values, generic tag/role/descendant selectors, raw visual literals, old classes used as recipes, and obsolete focus/style mechanisms, then proves those forbidden patterns absent from built artifacts. The sequence is architecture order, not authorization to implement. Maestro packets remain bounded by all four approved contracts.

## Primary comparison evidence

- [Base UI styling](https://base-ui.com/react/handbook/styling) and [animation](https://base-ui.com/react/handbook/animation) establish its unstyled parts, state attributes, variables, and presence phases; Foundry translates these rather than exposing them.
- [Radix Themes](https://www.radix-ui.com/themes/docs/theme/overview), [Fluent design tokens](https://fluent2.microsoft.design/design-tokens), and [Atlassian design tokens](https://atlassian.design/foundations/tokens/use-tokens-in-code) support a generated semantic-token contract with coherent scales and typed consumption.
- W3C guidance for [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), and [use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) supplies the measurable accessibility floor. Foundry applies the stricter two-color treatment and catalog-wide evidence above.
