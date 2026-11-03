# Batch notes: toolbar-slotfill-hocs

Package: `@wordpress/components` 43.0.0. 38 blocks built, 1 export skipped (`privateApis`).

## Built

Toolbar family (each block renders a `Toolbar` in the canvas and in the inspector):

- `Toolbar` -> `src/blocks/Toolbar`: label, variant, orientation; the pressed ToolbarButton persists in `pressed`.
- `ToolbarButton` -> `src/blocks/ToolbarButton`: icon, label, children text, isActive, disabled, isDestructive, showTooltip, subscript, click counter.
- `ToolbarGroup` -> `src/blocks/ToolbarGroup`: `controls` (flat and split sets), isCollapsed + title, children; active control persists.
- `ToolbarItem` -> `src/blocks/ToolbarItem`: headless item as render-prop child, `as="button"` and `as="input"`, plus a sibling for roving focus.
- `ToolbarDropdownMenu` -> `src/blocks/ToolbarDropdownMenu`: label, icon, `controls` vs `children` render prop; selected option persists.
- `__experimentalToolbarContext` -> `src/blocks/ToolbarContext`: child calling `useContext( ToolbarContext )` inside and outside a Toolbar, showing the store state.
- `__experimentalToolsPanel` -> `src/blocks/ToolsPanel`: label, headingLevel, hasInnerWrapper, shouldRenderPlaceholderItems; item values and the menu-enabled items (`enabledItems`, via `onShownChange` + `defaultShown`) persist. Rendered in canvas and inspector.
- `__experimentalToolsPanelItem` -> `src/blocks/ToolsPanelItem`: label, isShownByDefault, defaultShown, hasValue, onSelect/onDeselect/onShownChange counters.
- `__experimentalToolsPanelContext` -> `src/blocks/ToolsPanelContext`: reader child inside a ToolsPanel that dumps the context summary.

TreeGrid family (a row/cell/item block renders the minimal TreeGrid parent):

- `__experimentalTreeGrid` -> `src/blocks/TreeGrid`: 3-level data, expand/collapse persisted, onExpandRow/onCollapseRow/onFocusRow, applicationAriaLabel.
- `__experimentalTreeGridRow` -> `src/blocks/TreeGridRow`: level, positionInSet, setSize, isExpanded (undefined/true/false), className.
- `__experimentalTreeGridCell` -> `src/blocks/TreeGridCell`: `withoutGridItem` vs default (render-prop children).
- `__experimentalTreeGridItem` -> `src/blocks/TreeGridItem`: render-prop vs `as` component, several items in one cell.

Composite family:

- `Composite` -> `src/blocks/Composite`: orientation, focusLoop, focusWrap, focusShift, virtualFocus, rtl, disabled, activeId (persisted as `activeKey`); demo selector for Group/GroupLabel, Row, Hover, Typeahead; reads `Composite.Context`.
- `__unstableComposite` -> `src/blocks/UnstableComposite` (description uses the exact export name): legacy Composite + `useCompositeState`, role, disabled.
- `__unstableCompositeGroup` -> `src/blocks/UnstableCompositeGroup`: legacy group; `role="row"` switches to Composite.Row.
- `__unstableCompositeItem` -> `src/blocks/UnstableCompositeItem`: legacy item with disabled / focusable (accessibleWhenDisabled).
- `__unstableUseCompositeState` -> `src/blocks/UseCompositeState`: all hook options (orientation, loop, wrap, shift, unstable_virtual, rtl, currentId) and live `store.useState( 'activeId' )`.
- `__unstableDisclosureContent` -> `src/blocks/DisclosureContent`: `visible` toggle, in canvas and inspector.

Slot/Fill (every block renders its own `SlotFillProvider` in the canvas):

- `Slot` -> `src/blocks/Slot`: name, bubblesVirtually, children placeholder function, fillProps, toggleable Fill.
- `Fill` -> `src/blocks/Fill`: name, node vs function children (fillProps), toggleable Fill, second always-on Fill, click counter.
- `SlotFillProvider` -> `src/blocks/SlotFillProvider`: nested provider with `passthrough`, outer/nested Fill toggles.
- `createSlotFill` -> `src/blocks/CreateSlotFill`: `createSlotFill( key )` memoised on the key; bound Slot/Fill, bubblesVirtually.
- `__experimentalUseSlot` -> `src/blocks/UseSlot`: reader child shows `ref` from `useSlot`, Slot mount and bubblesVirtually toggles.
- `__experimentalUseSlotFills` -> `src/blocks/UseSlotFills`: reader child shows `useSlotFills().length` for 0..5 Fills.

Other components:

- `KeyboardShortcuts` -> `src/blocks/KeyboardShortcuts`: shortcut, bindGlobal, eventName, children vs document binding; counter persists.
- `ScrollLock` -> `src/blocks/ScrollLock`: mounted toggle persists.
- `IsolatedEventContainer` -> `src/blocks/IsolatedEventContainer`: compares the outer mousedown count with and without the container.
- `FocusReturnProvider` -> `src/blocks/FocusReturnProvider`: deprecated pass-through; toggled around a TextControl (smoke test).

HOCs (each creates its HOC once at module level and wraps a small inner component):

- `withFocusReturn` -> `src/blocks/WithFocusReturn`: default form vs `{ onFocusReturn }` options form; open/return counters.
- `withFocusOutside` -> `src/blocks/WithFocusOutside`: class component with `handleFocusOutside`; outside count persists.
- `withConstrainedTabbing` -> `src/blocks/WithConstrainedTabbing`: toggle wrapping a small form.
- `withNotices` -> `src/blocks/WithNotices`: createNotice (status, content, isDismissible, actions), createErrorNotice, removeAllNotices, renders `noticeUI`.
- `withFilters` -> `src/blocks/WithFilters`: `addFilter` from `@wordpress/hooks` in a toggle (append a component, or override a prop); filtered output shown live.
- `withSpokenMessages` -> `src/blocks/WithSpokenMessages`: `speak` and `debouncedSpeak` buttons, politeness, message.
- `withFallbackStyles` -> `src/blocks/WithFallbackStyles`: measures a Button's computed colours with `mapNodeToProps`, persists the measured values.
- `navigateRegions` -> `src/blocks/NavigateRegions`: HOC with default or custom `shortcuts`, N regions.
- `__unstableUseNavigateRegions` -> `src/blocks/UseNavigateRegions`: the hook's `ref`/`className`/`onKeyDown` spread on a wrapper.

## Skipped

- `privateApis`: opt-in-locked private API registry (`__dangerousOptInToUnstableAPIsOnlyForCoreModules`); nothing renders or can be observed in a block.

## Runtime risks

- Worktree base: the worktree branch was created from the old `main`, which lacked the scaffold, docs and Button block. It was fast-forwarded to `feature/component-test-blocks` (`--ff-only`, no merge commit) before any block was authored.
- Deprecation notices: `IsolatedEventContainer`, `FocusReturnProvider`, `__unstableComposite*` and `__unstableUseCompositeState` call `deprecated()`; expect console warnings (not errors).
- Legacy composite proxy: loading the legacy module mutates `Composite.displayName` to `__unstableComposite`, so the stable `Composite` shows that name in React devtools. Harmless.
- TreeGrid family: `TreeGridItem` throws if rendered outside a `TreeGrid` (every block wraps it). `useValidateTreeGridStructure` may log a warning if the DOM is not `table > tbody > tr > td`. The TreeGrid keyboard callbacks read `row.dataset.nodeId`.
- `Composite`: items use `Button` via `render`; item ids are `<clientId>-item-N` and only the suffix is stored, so check `activeId` restores after reload. `focusLoop`/`focusWrap` strings (`horizontal`, `vertical`, `both`) are passed straight through. `Composite.Typeahead` is applied through `render`, `Composite.Hover` wraps `Composite.Item` via `render`.
- `UseCompositeState`: `currentId` is only applied on first render, so changing it needs a reload (help text says so).
- `KeyboardShortcuts`: "no children" mode binds Mousetrap to the top-level `document`, not the canvas iframe, so keys pressed inside the iframe will not fire it; use the children mode to test. The shortcut options avoid Alt and Shift+Alt, which `useKeyboardShortcut` throws on for Apple OS.
- `ScrollLock`: a persisted `locked: true` re-applies the `lockscroll` class to the top-level document on every editor load; toggle it off if the editor page stops scrolling.
- `ToolsPanel` blocks render the panel in both the inspector and the canvas with distinct `panelId`s; `enabledItems` is written from `onShownChange`, which both copies fire. Check that optional items re-appear after reload (driven by `hasValue` and `defaultShown`).
- `ToolsPanelItem`: `isShownByDefault`/`defaultShown` are only read when an item registers, so the panels are remounted via `key` when those toggles change.
- `Slot` / `Fill` / `useSlot`: the Slot block switches between the children (non-virtual) and the portal (`bubblesVirtually`) implementation; flipping the toggle remounts the Slot. `useSlot().ref.current` is `null` on the first render and only filled by the next render.
- `SlotFillProvider` nested demo: without `passthrough` the nested Fill intentionally never appears (own registry).
- `withFilters`: the filter is registered globally in a `useEffect`; two `WithFilters` blocks on one page share the hook and namespace, so removing the filter in one removes it for both. `@wordpress/hooks` is not in `package.json`; an `import/no-extraneous-dependencies` exemption is in the file, and the build externalises it to `wp-hooks` (verified in `index.asset.php`).
- `withFallbackStyles` measures once until every value is truthy, then stops, so the demo uses `key={ variant }` to remount on change. Measured values are written back to attributes from an effect (guarded to avoid loops).
- `withNotices`: the HOC keeps notices in component state, so they are not persisted (only the `created` counter is).
- `navigateRegions` / `useNavigateRegions`: the default shortcuts (Ctrl+`, Ctrl+Shift+`, Alt+Shift+N/P) may be intercepted by the editor or the OS; the custom shortcuts are Ctrl+. and Ctrl+,.
- Toolbar family: `ToolbarItem as="input"` passes `value`/`onChange` through Ariakit's `ToolbarItem` render path and is the most likely to need a tweak. `ToolbarContext` shows `store.getState()` at render time, which is not reactive.

## Verification

Page: "Kitchen Sink: Toolbar, SlotFill and HOCs", ID 37. Editor: `http://kitchen-sink.test/wp-admin/post.php?post=37&action=edit`. Front end: `http://kitchen-sink.test/?page_id=37`. Checked against the bundled WordPress 7.1.4 packages.

All 38 blocks load without a block-error boundary or invalid-content notice, show their inspector panel, render the canvas demo, change attributes from their controls, and survive save and reload (page saved with `composite.activeKey` set; the saved page leaves `ScrollLock` off). The front end prints 38 headings and attribute dumps with no PHP notices; the PHP-FPM log has no new lines.

### Fixes (block -> fix)

- `Composite`: the demo is also rendered in the inspector ("keyboard demo" panel, item ids prefixed `inspector-`). In the canvas, WritingFlow handles arrow keys on non-text elements in a native listener that runs before React's delegated handlers, so arrow keys moved focus to the next block and the Ariakit composite never navigated. The inspector copy shares `activeKey` and works: `focusLoop` (`true` wraps from last to first), `focusWrap` (`true` in the grid layout wraps to the next row), `Composite.Typeahead` (typing `ch` focuses Cherry) and `Composite.Hover` (hover moves `activeId`) were verified there. `activeKey` restores after reload.
- `WithFocusReturn`: the panel used `autoFocus`, which React applies in the commit phase before `useFocusReturn`'s ref records the previously focused element, so the HOC remembered the input itself and focus ended on the body after closing. The panel now focuses from an effect; focus returns to "Open panel" and the `{ onFocusReturn }` form counts custom returns.
- `WithConstrainedTabbing`: added a sidebar copy of the form. In the canvas, WritingFlow's Tab handler moves focus to the next block from the last element before the HOC's trap element takes effect, so the trap only holds in the sidebar (verified there).
- `WithFilters`: the filter namespace is now per block (`.../<clientId>`). Before, `removeFilter( hook, namespace )` from one block removed the filter registered by every block (verified with two blocks). The hook itself is still global, so every `withFilters` block on a page shows the filtered output.
- `KeyboardShortcuts`: corrected the labels. Mousetrap does not skip editable fields that live inside the bound wrapper, so the text field inside the children wrapper fires the shortcut even without `bindGlobal` (verified: typing `j` fired it and typed the character).

### Runtime differences (not rewritten)

- `ToolsPanelItem` `onShownChange` and `defaultShown` do not exist in WordPress 7.1.4's `components` package (they are in 43.0.0). Optional items shown from the panel menu are therefore not remembered: `enabledItems` stays `[]` and the `onShownChange` readout stays false. Items with a value re-appear after reload through `hasValue`, `onSelect` fires, and `onDeselect` only fires when hiding an item that has a value. The two ToolsPanel copies (inspector and canvas) have independent menus and do not fight over `enabledItems`.
- `ToolbarButton` `subscript` reaches the DOM as a plain `subscript` attribute at runtime (43.0.0 maps it to `data-subscript`).
- `TreeGrid` keyboard navigation reads the global `document.activeElement`, so it only works in the main document (inspector copy: Up/Down/Left/Right, `onFocusRow` verified). In the canvas iframe it does nothing; the canvas copy still handles expand/collapse by click.
- Arrow-key navigation of the legacy `__unstableComposite*` blocks (canvas only, no sidebar copy) is expected to hit the same WritingFlow interception as `Composite`; click behaviour, `role`, `disabled`/`focusable` and the `useCompositeState` options were verified, keyboard navigation was not. The same applies to roving focus in the Toolbar canvas copies (the Toolbar blocks also render in the inspector; arrow-key roving there was not exercised).
- Default `navigateRegions` shortcuts (Ctrl+`) also trigger the editor's own region navigation, so focus ends outside the demo. The custom shortcuts work: Ctrl+. and Ctrl+, move between regions for both `navigateRegions` and `useNavigateRegions`.
- `ScrollLock` with a persisted `locked: true` adds `lockscroll` to the top document on load, but the editor canvas and sidebar still scroll (verified with wheel scroll after reload). The saved page has it off.

### Verified without changes

`Toolbar` (variant, orientation, label, pressed persists), `ToolbarButton`, `ToolbarGroup` (controls, split, collapsed), `ToolbarItem` (all three `as` forms; typing into `as="input"` updates `text`), `ToolbarDropdownMenu` (controls and children modes), `ToolbarContext`, `ToolsPanel` (both copies have distinct panel ids, reset all), `ToolsPanelItem`, `ToolsPanelContext`, `TreeGrid` family, `DisclosureContent`, `Slot` (both `bubblesVirtually` modes keep the fill), `Fill`, `SlotFillProvider` (nested provider hides the nested fill without `passthrough`, shows both with it), `createSlotFill`, `useSlot`, `useSlotFills` (0 to 5 fills), `KeyboardShortcuts` (children mode fires; no-children mode fires on the top document only), `IsolatedEventContainer` (outer mousedown count stays 0 when isolated), `FocusReturnProvider`, `withFocusOutside`, `withNotices`, `withSpokenMessages` (live regions updated), `withFallbackStyles` (measured values written once per variant, no render loop), `navigateRegions`, `useNavigateRegions`.

### Console

Only deprecation warnings from this page: `__unstableUseCompositeState`, `__unstableComposite`, `__unstableCompositeItem`, `__unstableCompositeGroup`, `IsolatedEventContainer`, `FocusReturnProvider`. No TreeGrid structure warning. The shared console buffer also held React error #130 and a `components.min.js` "reading '0'" TypeError from other families' blocks; neither appeared on this page.

### Not exercised

Real hardware-style Tab/arrow behaviour for `withConstrainedTabbing` and the legacy composites inside the canvas (see above); Cmd-based `mod+j` (tested with the plain `j` option); the `WithFocusReturn` default form with a mouse click (tested with keyboard Enter).
