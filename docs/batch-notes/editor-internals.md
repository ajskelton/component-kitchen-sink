# Batch notes: editor-internals (`@wordpress/block-editor`)

Pattern used by almost every block: a nested editor in the canvas. A small `createBlock` array lives in `useState`, wrapped in `<BlockEditorProvider value onInput onChange settings>` with a module-level (or memoised) `settings` object, and the component under test is rendered inside it. Most blocks key the nested editor on `blockCount` so changing the inspector range rebuilds it. `inspector` controls are labelled with prop names; "(not a prop)" marks helper controls.

## Built

32 blocks (all 32 requested exports).

- `BlockEditorProvider` -> `src/blocks/BlockEditorProvider`: controlled `value`, `onInput`/`onChange` counters (persisted), `settings.hasFixedToolbar`, `useSubRegistry`.
- `BlockList` -> `BlockList`: `className`, `layout` (default/constrained/flex), `renderAppender` (default/false/custom function), empty list at 0 blocks.
- `BlockCanvas` -> `BlockCanvas`: `height`, `styles` (injected colour rule), always iframed.
- `BlockTools` -> `BlockTools`: BlockTools + WritingFlow + BlockList, `className`, `hasFixedToolbar` setting.
- `BlockInspector` -> `BlockInspector`: nested list plus inspector, a nested block is pre-selected.
- `BlockToolbar` -> `BlockToolbar`: `hideDragHandle`, `variant`, wrapped in `NavigableToolbar`, first nested block pre-selected.
- `NavigableToolbar` -> `NavigableToolbar`: `orientation`, `aria-label`, `focusEditorOnEscape`, `shouldUseKeyboardFocusShortcut`, `__experimentalInitialIndex`, ToolbarButton children with click count (no nested editor needed).
- `BlockBreadcrumb` -> `BlockBreadcrumb`: `rootLabelText`, `className`; sample is group > paragraph, selection chosen from the inspector.
- `BlockNavigationDropdown` -> `BlockNavigationDropdown`: `isDisabled`; deprecated component.
- `__experimentalListView` -> `ListView`: `showBlockMovers`, `isExpanded`, `showAppender`, `showContentPopover`, `description`, next to a BlockList.
- `BlockMover` -> `BlockMover`: `clientIds` (start index and length), `hideDragHandle`, inside a Toolbar.
- `BlockSettingsMenu` -> `BlockSettingsMenu`: `clientIds`, `label`, render-prop `children` item with click count, `__experimentalSelectBlock`.
- `BlockSettingsMenuControls` -> `BlockSettingsMenuControls`: fill into the real block settings menu, MenuItem with click count.
- `__unstableBlockSettingsMenuFirstItem` -> `BlockSettingsMenuFirstItem`: fill, first item of the real settings menu, click count.
- `__unstableBlockToolbarLastItem` -> `BlockToolbarLastItem`: fill, star ToolbarButton at the end of the real block toolbar, click count.
- `BlockPopover` -> `BlockPopover`: `clientId`, `bottomClientId`, `shift`, popover text, anchored to nested blocks.
- `BlockEdit` -> `BlockEdit`: `name` select (paragraph, heading, separator, spacer), static attributes, `isSelected`, setAttributes call counter.
- `BlockContextProvider` -> `BlockContextProvider`: `value` with two keys, consumed by a client-only `ajs/context-probe` block (registered in this block's `index.js`, never on the server).
- `BlockSelectionClearer` -> `BlockSelectionClearer`: padded wrapper, live selected clientId, `clearBlockSelection` setting.
- `BlockEditorKeyboardShortcuts` -> `BlockEditorKeyboardShortcuts`: the null component plus `.Register`, nested BlockTools/WritingFlow so the duplicate shortcut works; shows the registered shortcut.
- `CopyHandler` -> `CopyHandler`: deprecated; wrapper div props (`className`, `onCopy` counted).
- `ObserveTyping` -> `ObserveTyping`: wrapped or unwrapped list, live `isTyping`.
- `Typewriter` -> `Typewriter`: scrolling container, wrapped or unwrapped list.
- `WritingFlow` -> `WritingFlow`: `aria-label` and `className` div props around a BlockList.
- `MultiSelectScrollIntoView` -> `MultiSelectScrollIntoView`: smoke test, deprecated and renders null.
- `SkipToSelectedBlock` -> `SkipToSelectedBlock`: no props in this version; first block pre-selected so the button renders.
- `RecursionProvider` -> `RecursionProvider`: recursive tree, `uniqueId` same/unique per level, `blockName`.
- `__experimentalRecursionProvider` -> `ExperimentalRecursionProvider`: same demo using the deprecated alias for the provider.
- `useHasRecursion` -> `UseHasRecursion`: hook result shown per level (title and description set to the export name).
- `__experimentalUseHasRecursion` -> `ExperimentalUseHasRecursion`: same demo using the deprecated alias for the hook (title and description set to the export name).
- `__unstableEditorStyles` -> `EditorStyles`: `styles` css, `scope` toggle and selector.
- `__unstableIframe` -> `Iframe`: `scale`, `frameSize`, `readonly`, `title`, `style.height`, nested BlockList inside the iframe.

## Skipped

None.

## Runtime risks

Nothing was run in an editor; check these first.

1. **Nested editors inside a block.** Every nested editor uses a sub-registry (default `useSubRegistry`) and `settings` of `{}`, so nested blocks have no theme or editor settings. If a nested `BlockList` crashes, look at `core/paragraph` / `core/heading` edit needing settings that are absent.
2. **`BlockEdit`** renders the real `edit` of core blocks without `BlockList`/`BlockListBlock`. `useBlockProps` inside the paragraph/heading edit may warn or fail because no list-block context exists; the block holds a real block of the same type in a nested store only so its clientId resolves.
3. **`BlockCanvas`, `Iframe`**: iframe in an editor that may itself be iframed; `Iframe` is given the real editor's `__unstableResolvedAssets` (read from the outer store) so it gets styles, which may fail if that setting is absent. `BlockCanvas` public wrapper takes only `height`, `styles`, `children`, so there is no `shouldIframe` toggle.
4. **`BlockInspector`, `BlockToolbar`, `BlockTools`, `BlockPopover`** use slots (`InspectorControls`, `BlockControls`, popover slot) that are shared with the real editor because the nested provider does not create a new `SlotFillProvider`. The nested inspector may show duplicates or none, and nested toolbars may render in the real editor's toolbar slots.
5. **Selection helpers** (`SelectBlock` etc.) call `selectBlock( clientId, null )` in an effect; if the nested store is empty on the first render the selector re-runs once blocks sync, which should still work.
6. **Fills into the real editor** (`BlockSettingsMenuControls`, `BlockSettingsMenuFirstItem`, `BlockToolbarLastItem`) only show while the block is present in the post and a block is selected. They draw nothing in the canvas by design. Verify by selecting any block and opening the three-dots menu / looking at the toolbar end.
7. **Deprecated components** (`BlockNavigationDropdown`, `CopyHandler`, `MultiSelectScrollIntoView`, `__experimentalRecursionProvider`, `__experimentalUseHasRecursion`) log console deprecation warnings by design; do not count those as errors. `MultiSelectScrollIntoView` renders nothing at all.
8. **`BlockContextProvider`** registers an extra client-only block `ajs/context-probe` from its `index.js`. If the editor logs about an unregistered/server-less block, that is why; it has `inserter: false` and is only created in the nested store.
9. **`NavigableToolbar`** is rendered directly in the outer editor's provider context (no nested editor). `shouldUseKeyboardFocusShortcut` defaults to false so it does not fight with the editor toolbar for Alt+F10.
10. **`EditorStyles`** with the scope toggle off applies the css unscoped to the whole editor document (`p` rule colours every paragraph). It also toggles `is-dark-theme` on the body based on the scope element's background.
11. **`BlockEditorProvider`** rebuilds on the block count and seed text (key bump), and `onInput`/`onChange` call the outer `setAttributes`, so typing in the nested editor adds outer undo steps.
12. **`BlockMover`/`BlockSettingsMenu`** look blocks up by index, so after reordering the control follows the position, not the block. `BlockMover` renders nothing when the targeted block is the only one at its level.
13. **`Typewriter`/`WritingFlow`/`ObserveTyping`** add key and selection listeners inside an outer block that already has its own writing flow; behaviour may be doubled and is only checkable by hand.
14. `BlockEditorKeyboardShortcuts.Register` re-registers shortcuts the editor already registered; this should be idempotent (no unregister on unmount).

## Verification

Test page: "Kitchen Sink: Editor internals", ID 30. Editor: http://kitchen-sink.test/wp-admin/post.php?post=30&action=edit, front end: http://kitchen-sink.test/?page_id=30. Checked in WordPress 7.1.4's bundled packages (not node_modules).

All 32 blocks were loaded, selected and given a changed attribute (some through the inspector, most through `updateBlockAttributes`, which the canvas `<pre>` JSON confirms). No block is invalid after saving and reloading, the editor console shows no errors, and the front end prints 32 headings plus 32 attribute `<pre>` blocks. Default attributes are not serialised, so the saved page comments are mostly empty.

### Fixes

- `BlockCanvas`: the nested iframe was 300x150 whatever `height` said (the wrapper sizing CSS lives in the block-editor package stylesheet, which is not loaded inside the editor canvas iframe) and had no theme/block styles (empty settings). Added scoped sizing rules in `editor.scss` and passed the real editor's `__unstableResolvedAssets` as settings, as the `Iframe` block already does.
- `BlockEdit`: choosing `core/separator` crashed (React error #130). The static attributes given to the edit function had no block defaults, so separator's `tagName` was undefined and it rendered an undefined element type. The edit function now starts from the attributes `createBlock` returns, which include defaults.
- `ExperimentalRecursionProvider`: the front-end heading read "RecursionProvider"; it now prints the directory name like the other prefixed blocks.

### Runtime risks, as observed

1. Nested editors: `core/paragraph`, `core/heading` and `core/group` render and edit with `settings` of `{}`. No crash. Typing in a nested paragraph works and fires `onChange`.
2. `BlockEdit`: paragraph, heading, separator and spacer all render. `useBlockProps` inside the rendered edit picks up the outer block's props (the `hr`/`h3` gets the outer block's `id`, `wp-block-ajs-block-edit` class and `draggable`), so the DOM has the outer block's id on it. Harmless, left as is.
3. `BlockCanvas`/`Iframe`: both render a nested iframe; see the `BlockCanvas` fix. Inside the nested iframes the theme font differs from the outer canvas (Times, no global-styles font); cosmetic. The nested `BlockCanvas` iframe also has `name="editor-canvas"`, which is only a problem for code that searches the outer iframe's document.
4. Slots: nested `BlockInspector` draws inline and does not add panels to the real sidebar (every block shows only its own panel plus Advanced). Nested `BlockToolbar`, `BlockTools` and `BlockPopover` render inside the canvas iframe, next to the nested blocks, not in the real editor's toolbar. Because the block-editor package CSS is not loaded in the canvas iframe, those nested toolbars and popovers are unstyled (stacked vertically, overlapping neighbouring text) while open. The real editor toolbar is unaffected. Not fixed: needs the package stylesheet inside the iframe.
5. Selection helpers: pre-selection works (`BlockInspector` shows the heading's settings, `SkipToSelectedBlock` button renders).
6. Fills: with one block selected, the real three-dots menu shows "First item from kitchen sink" first and "Kitchen sink menu control (<block name>)" near the end, and the star button sits at the end of the real toolbar. Clicking the first item and the star incremented their click counters. A nested `BlockSettingsMenu` also lists the fills plus its own child item.
7. Deprecation warnings appear for `BlockNavigationDropdown`, `CopyHandler`, `__experimentalRecursionProvider`, `__experimentalUseHasRecursion` and `MultiSelectScrollIntoView`, and only warn. Harmless.
8. `ajs/context-probe` renders two consumers with the provider values and produces no unregistered block message.
9. `NavigableToolbar` renders in the outer context; not exercised with Alt+F10.
10. `EditorStyles`: scope on colours only the dashed box. With scope off every paragraph in the editor canvas turns red italic. Turning scope back on reverts immediately. Removing the block was not tested separately (the same unmount path).
11. `BlockEditorProvider`: editing the nested paragraph sets `onChange` to 1; whether it adds outer undo steps was not checked.
12. `BlockMover` moved the second block down and the nested list reordered; `BlockSettingsMenu` opens.
13. `Typewriter`, `WritingFlow`, `ObserveTyping`: Enter in a nested Typewriter paragraph adds a block, `isTyping` turns true after a key press in ObserveTyping, and in the real editor typing, Enter and Cmd+Z behave normally with all 32 blocks on the page.
14. `BlockEditorKeyboardShortcuts.Register`: Shift+Cmd+D duplicates the block in the nested editor and does not touch the outer block list.

Also confirmed: `BlockBreadcrumb` follows nested selection (Nested document, Group, Paragraph), `BlockSelectionClearer` goes from a selected id to "none" when its padding is clicked, `ListView` and `BlockNavigationDropdown` open their popovers, and `BlockCanvas` `styles` colours the nested canvas paragraphs.

### Not exercised

Alt+F10 on `NavigableToolbar`, drag and drop (`BlockMover` drag handle, `ListView`), copy/cut/paste through `CopyHandler`, multi-select with Shift+arrow, and every inspector control on every block in the UI (many were set through the data API instead). Visual layout was only screenshot-checked for a few blocks in a narrow (800px) browser pane.

## Process notes

- The worktree was first created from the wrong commit; the coordinator reset it to 073149f. Everything here was built from that commit.
- `git checkout -- docs/COMPONENTS.md build/blocks/AlignmentMatrixControl build/blocks/Button` was run before each commit; `node scripts/inventory.mjs` was run once to confirm 32 `done` rows, then reverted.
- `scripts/scaffold-block.mjs` names the dir for prefixed exports without the prefix (`ListView`, `EditorStyles`, `Iframe`, `BlockSettingsMenuFirstItem`, `BlockToolbarLastItem`); `__experimentalRecursionProvider` was scaffolded with `--dir ExperimentalRecursionProvider` because its stripped name collides with `RecursionProvider`.
