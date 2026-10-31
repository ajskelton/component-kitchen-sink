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
