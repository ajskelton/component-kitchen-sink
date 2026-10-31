# Batch notes: color-and-layout

Package: `@wordpress/components`. All blocks follow `docs/BLOCK-TEMPLATE.md`; `render.php`, `index.js` and the stylesheets are as scaffolded.

## Built

- `ColorIndicator` → `src/blocks/ColorIndicator`: `colorValue` text and picker, size via `style`.
- `ColorPalette` → `src/blocks/ColorPalette`: single or multiple palettes, clearable, alpha, presentation, headingLevel, loop, selectedSlug.
- `ColorPicker` → `src/blocks/ColorPicker`: `color`, `enableAlpha`, `copyFormat`.
- `CustomGradientPicker` → `src/blocks/CustomGradientPicker`: gradient string, `enableAlpha`, sidebar flag, null value.
- `GradientPicker` → `src/blocks/GradientPicker`: preset gradients (single or multiple origins), custom gradients, clearable, presentation, selectedSlug.
- `DuotonePicker` → `src/blocks/DuotonePicker`: colour and duotone palettes, unset/clear, custom colour and duotone toggles, presentation, selectedSlug.
- `DuotoneSwatch` → `src/blocks/DuotoneSwatch`: two colour values or the null placeholder.
- `__experimentalPaletteEdit` → `src/blocks/PaletteEdit`: colours, gradients or duotones mode, canReset, canOnlyChangeValues, labels, slugPrefix, emptyMessage.
- `FontSizePicker` → `src/blocks/FontSizePicker`: presets, custom sizes, slider, reset, valueMode, units, size.
- `Flex` → `src/blocks/Flex`: direction, align, justify, gap, wrap, expanded, child count; mixes FlexItem and FlexBlock children.
- `FlexBlock` → `src/blocks/FlexBlock`: `display`, grows between two FlexItems.
- `FlexItem` → `src/blocks/FlexItem`: `display`, `isBlock` between plain siblings.
- `__experimentalGrid` → `src/blocks/Grid`: columns, rows, gaps, align, justify, alignment, isInline, templateColumns/Rows, child count.
- `__experimentalHStack` → `src/blocks/HStack`: alignment, direction, spacing, justify, wrap, expanded, optional Spacer child.
- `__experimentalVStack` → `src/blocks/VStack`: alignment, direction, spacing, justify, wrap, expanded.
- `__experimentalZStack` → `src/blocks/ZStack`: isLayered, isReversed, offset, child count.
- `__experimentalSpacer` → `src/blocks/Spacer`: all 14 margin and padding props, tinted so padding is visible.
- `__experimentalDivider` → `src/blocks/Divider`: orientation and margins.
- `__experimentalSurface` → `src/blocks/Surface`: variant, backgroundSize, four borders.
- `__experimentalElevation` → `src/blocks/Elevation`: value, hover, focus, active, isInteractive, borderRadius, offset.
- `__experimentalView` → `src/blocks/View`: `as` element swap.
- `__experimentalHeading` → `src/blocks/Heading`: level, align, colour, weight, truncate, highlightWords and more.
- `__experimentalText` → `src/blocks/Text`: size, variant, align, weight, truncation, ellipsizeMode, limit, highlight options.
- `__experimentalTruncate` → `src/blocks/Truncate`: ellipsizeMode, limit, numberOfLines, ellipsis, container width.
- `__experimentalScrollable` → `src/blocks/Scrollable`: scrollDirection, smoothScroll, oversized content in a capped box.
- `__experimentalStyleProvider` → `src/blocks/StyleProvider`: wraps a Button with the canvas `ownerDocument` or `window.document`.
- `Card` → `src/blocks/Card`: size, variant, elevation, isBorderless, isRounded with header, body, footer.
- `CardBody` → `src/blocks/CardBody`: size, isShady, isScrollable.
- `CardDivider` → `src/blocks/CardDivider`: margin props between two bodies.
- `CardFooter` → `src/blocks/CardFooter`: size, isBorderless, isShady, justify, gap.
- `CardHeader` → `src/blocks/CardHeader`: size, isBorderless, isShady, justify, gap.
- `CardMedia` → `src/blocks/CardMedia`: image or colour child, height, position in the Card (it has no props of its own).
- `__experimentalItemGroup` → `src/blocks/ItemGroup`: isBordered, isRounded, isSeparated, size, item count.
- `__experimentalItem` → `src/blocks/Item`: size, clickable (onClick turns it into a button), click counter.
- `Panel` → `src/blocks/Panel`: header and number of PanelBody children.
- `PanelBody` → `src/blocks/PanelBody`: title, initialOpen, controlled `opened`, icon, scrollAfterOpen, onToggle counter.
- `PanelHeader` → `src/blocks/PanelHeader`: label and children.
- `PanelRow` → `src/blocks/PanelRow`: className and number of fields in the row.
- `Placeholder` → `src/blocks/Placeholder`: label, instructions, icon, isColumnLayout, withIllustration, notices, preview, children.
- `BlockQuotation` → `src/blocks/BlockQuotation`: quote text and `<cite>` child.
- `HorizontalRule` → `src/blocks/HorizontalRule`: colour, thickness, width through `style`.
- `ResponsiveWrapper` → `src/blocks/ResponsiveWrapper`: naturalWidth, naturalHeight, isInline, container width.
- `ResizableBox` → `src/blocks/ResizableBox`: size, min size, showHandle, lockAspectRatio, enabled handles, tooltip, persisted resize.
- `Icon` → `src/blocks/Icon`: 6 `@wordpress/icons` elements and 2 Dashicon names, size.
- `Dashicon` → `src/blocks/Dashicon`: 8 Dashicon names, size.
- `SvgPrimitives` (extra) → `src/blocks/SvgPrimitives`: SVG, Rect, Circle, G, Polygon, Path and Line in one drawing with stroke, fill, strokeWidth and size controls.

## Skipped

None.

## Runtime risks

The editor loads `wp.components` from the site (WordPress 7.1.4), not from `node_modules` (43.0.0). Props I read from the 43.0.0 source may not exist at runtime.

- `PaletteEdit` with `duotones`: the WordPress 7.1.4 bundle has no `duotones` handling (the string does not appear in `components.js`). Switching the `colors / gradients / duotones` control to `duotones` probably shows only the empty message. Colours and gradients modes should work.
- `DuotonePicker`, `ColorPalette`, `GradientPicker`: `presentation` and `selectedSlug` are in the runtime bundle, but check that the listbox, toggle-buttons and command-buttons presentations actually behave differently.
- `Elevation`, `Scrollable`, `ResponsiveWrapper` call `deprecated()` in 43.0.0. Expect console deprecation warnings (not errors). If the runtime copy is not deprecated, nothing changes visually.
- `StyleProvider`: needs a real `Document`. The block waits for the canvas `ownerDocument` via a ref callback and renders a placeholder paragraph until then. With the "document" toggle off it uses `window.document`. If `registerDocument` is missing in the runtime, the block throws on render.
- `Dashicon` and `Icon` (dashicon names): the iframed editor canvas may not load the `dashicons` font, so the glyph can be blank even though the span has the right classes. The template forbids extra stylesheets, so this was left alone.
- `Card`/`CardHeader`/`CardFooter` `size="none"|"xSmall"`: these values come from 43.0.0 types. Older runtimes only know `extraSmall|small|medium|large`; an unknown size just falls back to default padding.
- `FontSizePicker` `valueMode="slug"` and `ColorPalette` `selectedSlug` are newer props. If absent at runtime the toggle has no effect.
- `ResizableBox` uses the `toggleSelection` prop of the block edit function. If it is `undefined` the call is skipped (`?.`), which only means the block can be dragged while resizing.
- `Spacer` / `Divider` / `CardDivider` take margins as numbers (4px multiples) or CSS strings; the block converts numeric strings to numbers. Typing `10px` should give a 10px margin.
- `PanelBody` in the canvas: styled for the sidebar. The block wraps it in a `Panel` but its spacing in the canvas may look off.
- `Text`/`Heading` `highlightWords` splits on commas; an empty trailing word (for example `fox,`) highlights nothing.
- The inventory (`node scripts/inventory.mjs`) leaves `SVG`, `Path`, `Circle`, `G`, `Rect`, `Polygon` and `Line` as `todo` with the note "cover in one SvgPrimitives block". It flips only rows whose description matches an export name, so these seven rows stay `todo` even though `SvgPrimitives` uses all of them. The block description is the exact string requested.
