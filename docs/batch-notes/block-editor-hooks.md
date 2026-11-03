# Batch notes: block-editor-hooks

Package: `@wordpress/block-editor` 19.0.0. Every block title and `block.json` description carries the exact export name (prefix included), so `scripts/inventory.mjs` matches it.

## Built

- `useBlockProps` → `UseBlockProps`: passes className, data attribute, color and outline style into the hook; prints the merged props.
- `useBlockEditContext` → `UseBlockEditContext`: prints the context, plus the Symbol-keyed entries JSON.stringify skips.
- `useBlockDisplayInformation` → `UseBlockDisplayInformation`: clientId argument picked from self, parent, first block or empty; prints the result.
- `useBlockEditingMode` → `UseBlockEditingMode`: reads the mode, and applies a chosen mode for a few seconds on demand (auto-reverts, so `disabled` cannot lock the block).
- `useSetting` → `UseSetting`: deprecated single-path settings lookup; prints the value.
- `useSettings` → `UseSettings`: comma-separated list of paths; prints a path-to-value map.
- `useStyleOverride` → `UseStyleOverride`: injects editable CSS into the editor canvas and styles a box with it.
- `useBlockCommands` → `UseBlockCommands`: mounts the hook (registers command-palette loaders); lists the transform items the commands come from.
- `useBlockBindingsUtils` → `UseBlockBindingsUtils`: buttons call `updateBlockBindings` and `removeAllBlockBindings`; prints `metadata.bindings`.
- `useBackgroundProps` → `UseBackgroundProps`: `background` block support (skip serialization) drives the hook; result applied to a box. Fallback inspector fields write `style.background`.
- `__experimentalUseBorderProps` → `UseBorderProps`: `__experimentalBorder` support drives the hook; result applied to a box.
- `__experimentalUseColorProps` → `UseColorProps`: `color` support (text, background, gradients) drives the hook; result applied to a box.
- `__experimentalUseCustomSides` → `UseCustomSides`: deprecated no-op; prints the return value (`undefined`) and the deprecation shows in the console.
- `__experimentalUseGradient` → `UseGradient`: `color` support with gradients plus a `GradientPicker` wired to the hook's `setGradient`; box uses `gradientValue` and `gradientClass`.
- `__experimentalUseMultipleOriginColorsAndGradients` → `UseMultipleOriginColorsAndGradients`: prints the origin-grouped palettes and shows swatches, filtered by origin.
- `__experimentalUseResizeCanvas` → `UseResizeCanvas`: deprecated no-op; prints the return value (`undefined`).
- `__experimentalUseBlockOverlayActive` → `UseBlockOverlayActive`: prints whether the overlay is active for self, parent and first block.
- `__unstableUseBlockSelectionClearer` → `UseBlockSelectionClearer`: ref on a dashed area; prints settings flag, direct clicks and a selection history.
- `__unstableUseClipboardHandler` → `UseClipboardHandler`: deprecated; mounts the hook on a focusable box only when the `enabled` toggle is on; counts copy events.
- `__unstableUseMouseMoveTypingReset` → `UseMouseMoveTypingReset`: ref on a box with start/stop typing buttons; prints the live `isTyping` flag.
- `__unstableUseTypewriter` → `UseTypewriter`: ref on a scroll container holding a contentEditable list; prints scrollTop.
- `__unstableUseTypingObserver` → `UseTypingObserver`: ref on a box with a text input; prints the live `isTyping` flag.
- `useCachedTruthy` → `UseCachedTruthy`: prints the value passed in next to the value returned (last truthy).
- `withColors` → `WithColors`: wraps Edit with `withColors( 'backgroundColor', { textColor: 'color' } )`; setters drive a `PanelColorSettings`.
- `withFontSizes` → `WithFontSizes`: wraps Edit with `withFontSizes( 'fontSize' )`; `setFontSize` drives a `FontSizePicker`.
- `withColorContext` → `WithColorContext`: wraps a `ColorPalette`; prints the injected `colors`, `disableCustomColors`, `hasColorsToChoose`; the caller can override the first two.
- `createCustomColorsHOC` → `CreateCustomColorsHOC`: HOC bound to a three-color brand palette, injecting `backgroundColor` and `borderColor`.

27 blocks.

## Skipped

- `privateApis` → the export is the locked private-API registry (`__dangerousOptInToUnstableAPIsOnlyForCoreModules`); it has no render-time value to show, and opting in is reserved for core modules.

Two exports the brief listed as likely skips were built instead because they do have an observable effect in a block: `useCachedTruthy` (returned value is visibly different from the input) and `createCustomColorsHOC` (a custom palette HOC works exactly like `withColors`).

## Runtime risks

- **Worktree setup.** The worktree was first created from a stale commit and reset by the coordinator; all work is on the corrected base (073149f). Nothing was copied from the main checkout.
- **`UseBlockCommands`** calls `useBlockCommands()`, which registers command loaders under the same names (`core/block-editor/blockTransforms`, `core/block-editor/blockQuickActions`) the editor registers itself. Unmounting the block (toggle off, or deleting the block) unregisters them, so Transform/Duplicate/Group/Delete commands may disappear from the palette until the editor reloads. Check Cmd/Ctrl+K with the block selected.
- **`UseClipboardHandler`** attaches copy/cut/paste/drop listeners on the whole document, duplicating the editor's own. It is off by default; with it on, a block paste may be inserted twice. The hook is deprecated and logs a notice.
- **`UseBlockEditingMode`** applies the chosen mode only while the "Apply" timer runs. `disabled` makes the block unselectable (the inspector disappears); it reverts after the configured seconds. The mode is never persisted.
- **`UseBlockSelectionClearer`**: the block wrapper re-selects the block on focus right after the area clears the selection, so the visible effect may be a brief flicker. The selection history in the `<pre>` is the evidence. `settings.clearBlockSelection` must be true for the hook to do anything.
- **`UseTypingObserver` / `UseMouseMoveTypingReset`**: the editor already runs its own observer, so `isTyping` flips regardless; verify the flag clears after moving the mouse over the canvas (mouse listeners live in the canvas iframe document, not the sidebar).
- **`UseTypewriter`**: the effect (scroll adjustment while typing) is subtle; with 30 lines in a 140px box, press Enter or arrow keys inside the box and watch `scrollTop`.
- **`UseBackgroundProps`**: the Background panel only appears when the theme enables `settings.background.backgroundImage`; the fallback fields in the inspector write `style.background` directly.
- **`UseGradient`**: the hook reads the `gradient` (slug) and `customGradient` attributes, but the Color panel stores a custom (non-preset) gradient under `style.color.gradient`, which the hook ignores. Use the `GradientPicker` in the inspector for custom values.
- **`UseSetting`**, **`UseCustomSides`**, **`UseResizeCanvas`**, **`UseClipboardHandler`** are deprecated and log console warnings by design (not errors).
- **`UseSettings`** remounts its reader component whenever the path list changes (the hook's dependency array length must stay constant); typing in the paths field re-reads on each keystroke.
- **`UseBlockBindingsUtils`** writes `metadata.bindings` to this block for an arbitrary attribute (`value`); the editor only acts on bindings for core blocks, so nothing else should change.
- **`WithColors` / `WithFontSizes` / `CreateCustomColorsHOC`** rely on the theme providing palettes/font sizes. With none, only custom values work (stored in `customBackgroundColor`, `customFontSize`, etc.).
- **`UseStyleOverride`** injects arbitrary CSS into the editor canvas; the default CSS is scoped to this block's class.
- Every `<pre>` is capped at 20em with scroll, via a rule scoped to the block's own class in `editor.scss`.

## Verification

- Test page: ID 12, "Kitchen Sink: Block editor hooks", http://kitchen-sink.test/?page_id=12 (editor: http://kitchen-sink.test/wp-admin/post.php?post=12&action=edit). Runtime: WordPress 7.1.4.
- Blocks checked: all 27 (CreateCustomColorsHOC, UseBackgroundProps, UseBlockBindingsUtils, UseBlockCommands, UseBlockDisplayInformation, UseBlockEditContext, UseBlockEditingMode, UseBlockOverlayActive, UseBlockProps, UseBlockSelectionClearer, UseBorderProps, UseCachedTruthy, UseClipboardHandler, UseColorProps, UseCustomSides, UseGradient, UseMouseMoveTypingReset, UseMultipleOriginColorsAndGradients, UseResizeCanvas, UseSetting, UseSettings, UseStyleOverride, UseTypewriter, UseTypingObserver, WithColorContext, WithColors, WithFontSizes). Each one validates, renders its heading and `<pre>`, and shows an inspector panel titled after the export. Saved attributes (colors, border, gradient, background, font size, sample text, class name) survive a save and reload with no invalid blocks, and the front end prints the heading and attribute JSON for every block with no PHP notices (no PHP error log was created).

### Fixed

- `UseBackgroundProps` crashed the block (`useBackgroundProps is not a function`): the `wp.blockEditor` bundle in WordPress 7.1.4 does not export the hook, although the npm package (19.0.0) does. `edit.js` now uses a namespace import and uses the real hook when the runtime has it, otherwise a local copy of its logic (same `className`/`style` output). The `<pre>` has a `source` field that says which one ran.
- `UseBlockCommands` removed the editor's own commands: `useBlockCommands()` registers loaders under fixed names (`core/block-editor/blockTransforms`, `core/block-editor/blockQuickActions`), and deleting the block left the Duplicate/Add before/Add after/Group/Delete commands out of the palette (confirmed: `blockQuickActions` was gone). The names are hard-coded in the hook, so they cannot be namespaced. The registrar now remembers the registered loaders after each render and re-registers them in an effect cleanup that runs after the hook's own. After deleting the block (and after toggling `registerLoader` off), both loaders are still registered and the palette lists Duplicate, Add before, Add after, Group, Delete, Hide.

### Behaviour confirmed

- `UseBlockBindingsUtils`: `updateBlockBindings` writes `metadata.bindings`, "Unbind attribute" and `removeAllBlockBindings` clear it. The editor ignores the binding on this block, as expected.
- `UseBlockEditingMode`: `contentOnly` and `disabled` apply for the configured seconds and revert; the block stays selectable and the inspector stays visible.
- `UseClipboardHandler`: with `enabled` on, a copy event puts block markup on the clipboard and bumps the counter; a paste event inserts the block once (no double paste seen).
- `UseBlockSelectionClearer`: a click on the dashed area clears the selection, then the block re-selects itself; the history shows `none` between.
- `UseTypingObserver` and `UseMouseMoveTypingReset`: `isTyping` goes true on key presses / `startTyping()` and false after the mouse moves.
- `UseTypewriter`: the box scrolls (scrollTop 501 after 20 Down presses).
- `UseBlockEditContext`, `UseBlockDisplayInformation`, `UseBlockOverlayActive`, `UseBlockProps`, `UseCachedTruthy`, `UseSetting`, `UseSettings`, `UseStyleOverride`, `UseMultipleOriginColorsAndGradients`, `WithColorContext`, `WithColors`, `CreateCustomColorsHOC`: controls change the `<pre>` as described above.
- `UseBorderProps`, `UseColorProps`, `UseGradient`: checked by setting `style.border`, `backgroundColor`/`style.color.text`, and `gradient`/`customGradient` (the Styles panel hides most tools behind its menu); the hook output and the box update. The GradientPicker's angle control and Clear button work.

### Remains as is (not bugs in the blocks)

- `UseMultipleOriginColorsAndGradients` with origin `default` returns empty lists: the active theme sets `color.defaultPalette` to false.
- `WithFontSizes`: picking a preset in the picker stores `customFontSize` (for example `1.38rem`), not the slug. `withFontSizes` compares the picked size to presets with `Number()`, so rem-based theme presets never match. Editing `fontSize` directly (saved as `large`) renders correctly.
- `UseBackgroundProps`: the theme does not enable background images, so the Background panel is absent and the fallback inspector fields are the way to set it.

### Console messages judged harmless

- Deprecations: `__experimentalUseCustomSides` (6.3), `useResizeCanvas` (7.1, hook is a no-op), `useSetting` (6.5).
- `Blocked attempt to show a 'beforeunload' confirmation panel` after a reload with unsaved changes (test harness reloads).
- From other families or core: the API version 2 warning for `ajs/alignment-matrix-control`, and `global-styles-css-custom-properties-inline-css was added to the iframe incorrectly`.
