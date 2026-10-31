# Batch notes: overlays-and-menus

Package: `@wordpress/components` 43.0.0. 44 blocks built, none skipped. `npm run build` and `npm run lint:js` pass.

## Built

- Modal → `src/blocks/Modal`: opens from a canvas button; title, size, isDismissible, isFullScreen, shouldCloseOnEsc, shouldCloseOnClickOutside, focusOnMount, headerActions; persists `timesOpened` and `lastClosedBy`.
- __experimentalConfirmDialog → `src/blocks/ConfirmDialog`: controlled mode; message, title, button texts, size, isBusy, `__experimentalHideHeader`; persists `timesOpened` and `result` (confirmed/cancelled).
- Popover → `src/blocks/Popover`: anchored to a canvas button via `anchor`; placement, offset, noArrow, animate, flip, shift, resize, variant, focusOnMount, expandOnMobile, headerTitle, inline; persists `timesOpened`.
- Dropdown → `src/blocks/Dropdown`: popoverProps placement and noArrow, expandOnMobile, headerTitle, focusOnMount, defaultOpen, contentClassName; persists `toggles` and `closes` from onToggle/onClose.
- __experimentalDropdownContentWrapper → `src/blocks/DropdownContentWrapper`: wrapper inside a Dropdown's renderContent; paddingSize.
- DropdownMenu → `src/blocks/DropdownMenu`: label, text, icon, noIcons, disableOpenOnArrowDown, popover placement, `controls` array versus `children` render prop; persists `activeControl` and `selections`.
- MenuGroup → `src/blocks/MenuGroup`: label, hideSeparator, className (stored as `groupClassName`); persists `lastClicked`.
- MenuItem → `src/blocks/MenuItem`: inside a MenuGroup; info, icon, iconPosition, isSelected, role, shortcut, suffix, isDestructive, disabled; persists `clicks`.
- MenuItemsChoice → `src/blocks/MenuItemsChoice`: three choices with info, shortcut and disabled variants; persists `value`; shows the onHover value.
- NavigableMenu → `src/blocks/NavigableMenu`: orientation, cycle; persists `lastIndex` from onNavigate.
- TabbableContainer → `src/blocks/TabbableContainer`: cycle, custom eventToOffset (arrow keys); persists `lastIndex`.
- Navigator → `src/blocks/Navigator`: two-screen navigator; initialPath, height; persists `navigations`.
- __experimentalNavigatorProvider → `src/blocks/NavigatorProvider`: legacy provider with legacy screen, button and back button; initialPath, height; persists `navigations`.
- __experimentalNavigatorScreen → `src/blocks/NavigatorScreen`: screen path pattern (`/child` or `/item/:id` with a param readout); persists `visits`.
- __experimentalNavigatorButton → `src/blocks/NavigatorButton`: path, attributeName, variant, disabled, text; persists `clicks`.
- __experimentalNavigatorBackButton → `src/blocks/NavigatorBackButton`: variant, icon, disabled, text; starts on the child screen; persists `clicks`.
- __experimentalNavigatorToParentButton → `src/blocks/NavigatorToParentButton`: same controls as the back button (deprecated alias); persists `clicks`.
- useNavigator → `src/blocks/UseNavigator`: child component calls the hook; shows `location.path` and `params`; goTo target, `replace`, `skipFocus` options, goBack; persists `calls`. Block title and description are the exact export name.
- __experimentalUseNavigator → `src/blocks/ExperimentalUseNavigator`: same demo through the alias import (`__experimentalUseNavigator as useNavigator`).
- Notice → `src/blocks/Notice`: status, isDismissible, politeness, spokenMessage, `__unstableHTML`, one action with variant; persists `dismissals` and `actionClicks`.
- NoticeList → `src/blocks/NoticeList`: notices array persisted in attributes; add from a canvas or inspector button; onRemove removes.
- Snackbar → `src/blocks/Snackbar`: explicitDismiss, icon, politeness, one action (label, url, openInNewTab); persists `shown`, `dismissals`, `actionClicks`.
- SnackbarList → `src/blocks/SnackbarList`: notices array persisted; add button; positioned stage in `editor.scss` (the list is `position: absolute`).
- Spinner → `src/blocks/Spinner`: width and height passthrough props; persists `size`.
- ProgressBar → `src/blocks/ProgressBar`: determinate `value` versus indeterminate.
- Tip → `src/blocks/Tip`: children text (deprecated component).
- Tooltip → `src/blocks/Tooltip`: text, shortcut, placement, delay, hideOnClick around a Button.
- Guide → `src/blocks/Guide`: `pages` prop (1 to 5 pages), contentLabel, button texts; persists `timesOpened` and `timesFinished`.
- GuidePage → `src/blocks/GuidePage`: Guide with GuidePage children (deprecated API); page count, text, className; persists counters.
- Animate → `src/blocks/Animate`: type (appear, slide-in, loading, none) and `options.origin`; replay button persists `replays` (deprecated component).
- __unstableAnimatePresence → `src/blocks/AnimatePresence`: add/remove a motion child with exit animation; initial, mode, duration; persists `isShown` and `toggles`.
- __unstableMotion → `src/blocks/Motion`: `Motion.div` with animate x/rotate/scale/opacity, transition duration and ease, whileHover; all persisted.
- TabPanel → `src/blocks/TabPanel`: orientation, selectOnMove, initialTabName, activeClass, disabled tab, icons; persists `selectedTab` from onSelect.
- ExternalLink → `src/blocks/ExternalLink`: href and children.
- ClipboardButton → `src/blocks/ClipboardButton`: text to copy, variant, onCopy/onFinishCopy feedback; persists `copies` (deprecated component).
- IconButton → `src/blocks/IconButton`: icon, label, tooltip, labelPosition, size; persists `clicks` (deprecated component).
- Disabled → `src/blocks/Disabled`: isDisabled, className (stored as `disabledClassName`) around a TextControl and Button.
- Draggable → `src/blocks/Draggable`: drag handle plus a plain drop target in the block; transferData payload, appendToOwnerDocument, cloneClassname, `__experimentalDragComponent`; persists `dragStarts`, `drops`, `lastDropped`.
- DropZone → `src/blocks/DropZone`: label, icon, isEligible, onHTMLDrop/onFilesDrop on or off; a native draggable text item; persists `drops`, `htmlDrops`, `fileDrops`, `lastDrop`.
- DropZoneProvider → `src/blocks/DropZoneProvider`: deprecated pass-through provider wrapping a DropZone; persists `drops`.
- TextHighlight → `src/blocks/TextHighlight`: text and highlight.
- VisuallyHidden → `src/blocks/VisuallyHidden`: children and `as`; a debug toggle prints the hidden text visibly.
- SandBox → `src/blocks/SandBox`: static html string and one inline CSS string, title, type, allowSameOrigin/allowPopups/allowForms; no `scripts`, no remote URLs.
- FocusableIframe → `src/blocks/FocusableIframe`: `srcDoc` with a static document, title, height, iframeRef focus button; persists `focusCount` (deprecated component).

## Skipped

None.

## Runtime risks

- Deprecation warnings are expected in the console, not bugs: Animate, Tip (since 7.2), ClipboardButton, IconButton, DropZoneProvider, FocusableIframe, GuidePage, NavigatorToParentButton (calls Navigator.BackButton), and `useNavigator().goToParent` (not called). The verifier should not count these as errors.
- Draggable and DropZone rely on native HTML drag events. The block editor has its own document-level drag handlers and canvas drop zones (iframed canvas), so a drop may also be intercepted by the editor (Draggable calls `stopPropagation` on its own drop target). Check that dragging does not insert blocks or throw, and that `useDropZone` activates inside the iframe document.
- Draggable clones the element by id (`ajs-draggable-<clientId>`). If the clone appears offset in the iframed canvas, try `appendToOwnerDocument`.
- Popover, Dropdown, DropdownMenu, Tooltip, Modal, ConfirmDialog, Guide render through portals or the editor popover slot; confirm they appear above the editor chrome and that focus returns to the trigger. Modal and Guide keydown events bubble through the React tree into the block, so check Escape and arrow keys do not also act on the block.
- Popover `inline` renders in place and ignores the slot; `placement="overlay"` covers the anchor.
- Navigator family: `initialPath` is only read on mount (the block remounts the navigator with a `key`). Navigator.Screen moves focus on navigation, which may steal focus from the inspector when a button inside the canvas is clicked.
- Navigator.Screen animations need the Navigator to have a height; blocks set `style.height`, but the legacy `NavigatorProvider` forwards `style` through its View, which should be verified.
- SnackbarList (`position: absolute`) depends on the scoped rule in `src/blocks/SnackbarList/editor.scss`. Snackbars without `explicitDismiss` call `onRemove` after 6 seconds, which rewrites the persisted `notices` array (adds an undo step).
- Snackbar and Notice call `speak()` from `@wordpress/a11y` on mount; harmless but may produce live-region noise.
- TextHighlight uses `createInterpolateElement` on the text, so text containing `<` or `>` can throw. Keep test text plain.
- ExternalLink renders a real anchor (`target="_blank"`); clicking it in the editor opens the URL in a new tab. The block never loads the URL itself.
- AnimatePresence `mode="popLayout"` needs a positioned parent; it is only a visual quirk if not.
- Attribute names `title`, `type` (SandBox) and `size` are plain attributes; `className` is deliberately avoided (renamed `groupClassName`, `disabledClassName`).
- The worktree for this batch was created from `main`, which lacks the template, scripts, Button reference and docs. I fast-forwarded this branch to `feature/component-test-blocks` (commit 073149f) before starting, so the branch history now includes that commit.
