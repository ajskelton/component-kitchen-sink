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
