# Batch notes: content-links-media (@wordpress/block-editor)

All blocks live in `src/blocks/<Dir>` and build to `build/blocks/<Dir>`. Blocks that hold inner blocks (InnerBlocks, useInnerBlocksProps, the three appenders, Inserter) declare a `save` that returns `InnerBlocks.Content` so the inner blocks are serialized, and their `render.php` prints `$content`.

## Built

- RichText → `RichText`: tagName, placeholder, disableLineBreaks, allowedFormats, withoutInteractiveFormatting, preserveWhiteSpace; persists `content` (HTML string, no `source`).
- RichTextShortcut → `RichTextShortcut`: a custom format type (`format.js`) mounts the shortcut while the block's RichText is focused; character and modifier type from the inspector; counts uses and toggles a `<mark>` format.
- RichTextToolbarButton → `RichTextToolbarButton`: custom format type renders the button into the format toolbar ("More" menu or the `non-breaking-space` slot); title, icon, name, shortcut hint, click count.
- __unstableRichTextInputEvent → `RichTextInputEvent`: custom format type mounts the component for a chosen `inputType`; counts handled events.
- PlainText → `PlainText`: placeholder, disabled, readOnly, spellCheck, maxLength; persists `content`.
- Autocomplete (block-editor) → `BlockEditorAutocomplete`: contenteditable div driven by a hand-built rich text record, a fruit completer (triggerPrefix, isOptionDisabled, isDebounced, completion) plus a "#" colors completer added through the `editor.Autocomplete.completers` filter.
- InnerBlocks → `InnerBlocks`: allowedBlocks, template, templateLock, orientation, renderAppender.
- useInnerBlocksProps → `UseInnerBlocksProps`: merges block props and inner blocks props on one element; allowedBlocks, template, templateLock, orientation, renderAppender, defaultBlock, directInsert; `useInnerBlocksProps.save` in `save`.
- ButtonBlockAppender → `ButtonBlockAppender`: appender for this block's InnerBlocks; allowedBlocks (single type changes the label), className, onSelect count.
- ButtonBlockerAppender → `ButtonBlockerAppender`: same as above through the deprecated alias.
- DefaultBlockAppender → `DefaultBlockAppender`: appender with allowedBlocks and templateLock (locked root hides it).
- Inserter → `Inserter`: position, isAppender, __experimentalIsQuick, selectBlockOnInsert, showInserterHelpPanel, shouldDirectInsert, disabled, toggleProps.label, onSelectOrClose; inserts into this block's inner blocks.
- __unstableInserterMenuExtension → `InserterMenuExtension`: a Fill shown below the inserter search results; echoes the search term and stores the last search.
- __experimentalLibrary → `Library`: inside a nested BlockEditorProvider; initial tab, filter value, help panel, most-used, isAppender, shouldFocusBlock.
- LinkControl → `LinkControl`: settings (default/none/custom), showSuggestions, showInitialSuggestions, noDirectEntry, noURLSuggestion, hasTextControl, hasRichPreviews, handleEntities, createSuggestion, onRemove, forceIsEditingLink, searchInputPlaceholder, suggestionsQuery; persists url, title, opensInNewTab, noFollow.
- __experimentalLinkControl → `ExperimentalLinkControl`: same exercise through the deprecated alias (block title and description carry the full export name).
- __experimentalLinkControlSearchInput → `LinkControlSearchInput`: standalone search input with a static suggestion list.
- __experimentalLinkControlSearchItem → `LinkControlSearchItem`: one result row with editable suggestion (title, url, type, typeLabel, isFrontPage, isBlogHome), searchTerm, isURL, shouldShowType.
- __experimentalLinkControlSearchResults → `LinkControlSearchResults`: result list fed by fixed suggestions plus the "Create" row; selectedSuggestion, isLoading, isInitialSuggestions, withCreateSuggestion, createSuggestionButtonText, suggestionsQuery.
- URLInput → `URLInput`: label, placeholder, className, disableSuggestions, static or editor suggestions, initial suggestions, hideLabelFromVision, disabled, required.
- URLInputButton → `URLInputButton`: url and onChange, with the chosen suggestion title stored as link text.
- URLPopover → `URLPopover`: placement, focusOnMount, renderSettings, additionalControls, with `URLPopover.LinkEditor` and `LinkViewer` as content.
- MediaPlaceholder → `MediaPlaceholder`: allowedTypes, accept, multiple, isAppender, disableDropZone, dropZoneUIOnly, disableMediaButtons, labels, onSelectURL, mediaPreview; persists mediaId and mediaUrl.
- MediaReplaceFlow → `MediaReplaceFlow`: in BlockControls; allowedTypes, accept, name, variant, handleUpload, onSelectURL, onReset, children.
- MediaUpload → `MediaUpload`: Button opening the media library; allowedTypes, multiple, gallery, addToGallery, title, modalClass, mode, onClose count.
- MediaUploadCheck → `MediaUploadCheck`: wraps a MediaUpload button; a toggle renders it in a nested editor without `mediaUpload` so the `fallback` shows.
- __experimentalImageSizeControl → `ImageSizeControl`: slug/size options, width, height, imageWidth, imageHeight, isResizable, imageSizeHelp; a gray box shows the resulting size.
- __experimentalImageURLInputUI → `ImageURLInputUI`: toolbar link button; url, linkDestination, linkTarget, rel, linkClass, mediaUrl, mediaLink, mediaType, lightbox settings.
- __experimentalImageEditor → `ImageEditor`: pick an image, press "Edit image"; width, height, border props; toolbar gets crop, zoom, aspect, rotate.
- BlockIcon → `BlockIcon`: icon as element, Dashicon string or descriptor, showColors, className, context.
- BlockTitle → `BlockTitle`: shows the title of this block, its parent or the first block; maximumLength, context.
- BlockPreview → `BlockPreview`: presets built with createBlock; viewportWidth, minHeight, additionalStyles.
- __experimentalUseBlockPreview → `UseBlockPreview`: same presets rendered in place through the hook; layout, props.className.
- __experimentalBlockPatternsList → `BlockPatternsList`: three sample patterns; isDraggable, orientation, label, showTitlesAsTooltip, category, onClickPattern, onHover.
- __experimentalBlockPatternSetup → `BlockPatternSetup`: initialViewMode, showTitles, blockName or filterPatternsFn source, default replace behavior behind a toggle.
- __experimentalBlockVariationPicker → `BlockVariationPicker`: five variations (scope `block`) declared in block.json; label, instructions, allowSkip, icon.
- __experimentalBlockVariationTransforms → `BlockVariationTransforms`: three variations (scope `transform`, unique icons) declared in block.json that set `accent`.
- BlockStyles → `BlockStyles`: four styles declared in block.json; the Styles tools panel in the inspector, onSwitch and onHoverClassName counters.
- BlockColorsStyleSelector → `BlockColorsStyleSelector`: toolbar color button with hand-made TextColor and BackgroundColor wrappers.
- Warning → `Warning`: children, className, actions, secondaryActions.

## Skipped

None. All 40 requested exports have a block.

## Runtime risks

- Three RichText blocks (RichTextShortcut, RichTextToolbarButton, RichTextInputEvent) register a global format type in `format.js` (`ajs/rich-text-*-demo`). Its `edit` returns null unless the selected block is the matching ajs block, so other blocks are untouched, but the format still appears in the allowed formats of every RichText. Check that the shortcut, the "More" menu button and the `input` event handler actually fire; RichTextInputEvent listens to `input` events, so `formatBold` may not be delivered in every browser. The three `format.js` files import `@wordpress/rich-text`, which is not a direct dependency (eslint exemption comment, build externalizes it to `wp.richText`).
- BlockEditorAutocomplete builds the rich text record from a plain contenteditable by hand; the popover anchor and caret restore after a completion are the likeliest things to misbehave. It also imports `@wordpress/hooks` and `@wordpress/rich-text` (transitive, externalized).
- ButtonBlockerAppender, ExperimentalLinkControl, LinkControlSearchInput/Item/Results, ImageEditor and BlockColorsStyleSelector are deprecated exports; each logs a deprecation notice in the console on purpose.
- InnerBlocks and UseInnerBlocksProps: `template` is applied as a prop, so changing it after the area has content may not rebuild the inner blocks. Inner blocks only reach the front end if `save` serializes them; verify a save and reload keeps them and that `render.php` prints them.
- Inserter, Library, LinkControl (and friends) rely on editor settings: link suggestions need the editor's `__experimentalFetchLinkSuggestions` (the Search* and URLInput blocks default to a static list), Library needs patterns/media in settings, MediaUpload needs the `editor.MediaUpload` filter from the post editor.
- Library and MediaUploadCheck wrap content in a nested `BlockEditorProvider` that reuses the outer editor settings; Library may look cramped inside its fixed-height frame, and focus handling in the nested editor is untested.
- BlockPatternSetup returns null when no patterns are allowed; with the "default onBlockPatternSelect" toggle on it replaces (deletes) the test block.
- MediaReplaceFlow and ImageURLInputUI render in BlockControls: select the block to see them. ImageEditor needs a real attachment id (it saves through the REST API) and a loaded `<img>` for the natural size.
- BlockVariationTransforms: Gutenberg's own inspector also shows transform variations for this block, so the buttons can appear more than once. Only the ToggleGroup path (unique icons) is exercised; the dropdown and button-row paths need a different variation set.
- BlockStyles renders its own ToolsPanel in the inspector (not in the canvas). The `is-style-*` rules are scoped in `style.scss`.
- BlockPreview and BlockPatternsList render iframes; with many previews the editor may be slow. UseBlockPreview renders in place, without an iframe.
- Worktree note: the worktree branch started from an older commit than `feature/component-test-blocks`; it was fast-forwarded to 073149f so the docs and scripts exist.
