# Batch notes: block-editor-controls

## Built

- AlignmentControl → AlignmentControl: text alignment dropdown in BlockControls (group block) plus inspector mirror; value, label, description, alignmentControls
- AlignmentToolbar → AlignmentToolbar: same as above rendered as a toolbar group; adds isCollapsed
- BlockAlignmentControl → BlockAlignmentControl: block alignment dropdown (none/left/center/right/wide/full); value, controls, label, description
- BlockAlignmentToolbar → BlockAlignmentToolbar: toolbar variant; adds isCollapsed
- __experimentalBlockAlignmentMatrixControl → BlockAlignmentMatrixControl: 3x3 content position dropdown; value, label, isDisabled
- BlockVerticalAlignmentControl → BlockVerticalAlignmentControl: vertical alignment dropdown; value, controls, label
- BlockVerticalAlignmentToolbar → BlockVerticalAlignmentToolbar: toolbar variant; adds isCollapsed
- __experimentalBlockFullHeightAligmentControl → BlockFullHeightAligmentControl: full height toggle button; isActive, label, isDisabled
- JustifyContentControl → JustifyContentControl: items justification dropdown; value, allowedControls, popoverProps
- JustifyToolbar → JustifyToolbar: toolbar variant; adds isCollapsed
- BlockControls → BlockControls: labelled ToolbarButton in a selectable group (default/block/other/inline), optional `controls` prop
- BlockFormatControls → BlockFormatControls: labelled ToolbarButton in the inline (format) toolbar group
- InspectorControls → InspectorControls: labelled TextControl rendered into a selectable inspector group
- InspectorAdvancedControls → InspectorAdvancedControls: labelled TextControl rendered into the Advanced panel
- __experimentalInspectorPopoverHeader → InspectorPopoverHeader: header with title, help, actions and close button, rendered in canvas and inspector
- __experimentalBorderRadiusControl → BorderRadiusControl: per-corner radius control; values, presets
- __experimentalColorGradientControl → ColorGradientControl: colour and gradient tabs; label, colors, gradients, showTitle, clearable, enableAlpha, disableCustom*, headingLevel
- __experimentalColorGradientSettingsDropdown → ColorGradientSettingsDropdown: text and background dropdowns inside a ToolsPanel; settings, clearable, enableAlpha, disableCustom*
- ColorPalette (block-editor) → BlockEditorColorPalette: palette from useSettings with fallback; clearable, enableAlpha, disableCustomColors, asButtons, headingLevel
- ColorPaletteControl → ColorPaletteControl: labelled single colour control; label, showTitle, clearable, enableAlpha, headingLevel
- PanelColorSettings → PanelColorSettings: text and background colour panel; title, showTitle, colorSettings, enableAlpha
- __experimentalPanelColorGradientSettings → PanelColorGradientSettings: colour and gradient panel; title, showTitle, settings, enableAlpha
- ContrastChecker → ContrastChecker: textColor/backgroundColor pickers feed the checker; fontSize, isLargeText, enableAlphaChecker, messageOverride
- __experimentalDuotoneControl → DuotoneControl: toolbar duotone dropdown plus inspector mirror; duotonePalette, colorPalette, disableCustom*
- DimensionControl → DimensionControl: linked unit and range control; label, placeholder, dimensionSizes
- HeightControl → HeightControl: deprecated height control; label
- __experimentalSpacingSizesControl → SpacingSizesControl: padding sides control; label, sides, showSideInLabel, useSelect, minimumCustomValue
- __experimentalUnitControl (block-editor) → BlockEditorUnitControl: settings-aware UnitControl; units, size, min, max, step, spinControls, disableUnits, isResetValueOnUnitChange
- __experimentalFontAppearanceControl → FontAppearanceControl: font style and weight select; hasFontStyles, hasFontWeights, fontFamilyFaces, size
- __experimentalFontFamilyControl → FontFamilyControl: font family select with fallback families; label, size, showSelectedHint, options
- __experimentalLetterSpacingControl → LetterSpacingControl: letter spacing unit control; size, __unstableInputWidth
- LineHeightControl → LineHeightControl: line height number control; size, __unstableInputWidth
- __experimentalTextDecorationControl → TextDecorationControl: decoration toggle group; value, className
- __experimentalTextTransformControl → TextTransformControl: transform toggle group; value, className
- __experimentalWritingModeControl → WritingModeControl: writing mode toggle group; value, className
- HeadingLevelDropdown → HeadingLevelDropdown: toolbar heading level dropdown plus inspector mirror; value, options
- __experimentalDateFormatPicker → DateFormatPicker: date format switch/select/custom input; format, defaultFormat
- __experimentalPublishDateTimePicker → PublishDateTimePicker: date and time picker with popover header; currentDate, is12Hour, title, showPopoverHeader, onClose
- ToolSelector → ToolSelector: smoke test only (deprecated, renders nothing)
- __experimentalPreviewOptions → PreviewOptions: smoke test only (deprecated, renders nothing)
- __experimentalResponsiveBlockControl → ResponsiveBlockControl: per-viewport range controls; title, property, toggleLabel, isResponsive, renderDefaultControl, viewports
- FontSizePicker (block-editor) → BlockEditorFontSizePicker: settings-driven font size picker; fallbackFontSize, size, withSlider, withReset, units
- BlockBindingsAttributeControl → BlockBindingsAttributeControl: binding row for a chosen attribute inside a ToolsPanel, plus useBlockBindingsUtils reset
- BlockBindingsSourceFieldsList → BlockBindingsSourceFieldsList: exercised through the attribute control's menu (needs its Menu.Root); see risks

## Skipped

None: all 44 requested exports have a block. ToolSelector and PreviewOptions are smoke tests (deprecated components that render nothing), and BlockBindingsSourceFieldsList is exercised indirectly.

## Runtime risks

- BlockAlignmentControl / BlockAlignmentToolbar return null when the parent layout offers no alignments (flex/grid parents, themes without alignWide).
- BlockFormatControls and BlockControls group=inline: the inline toolbar slot may only render for blocks the toolbar treats as text-editable; if the star/bold button is missing, check there first.
- Colour blocks pass `colors`/`gradients` from `useSettings( 'color.palette' )` and fall back to a static palette when the setting is empty; if a picker shows no swatches check the palette shape (flat array vs origin object, handled by `toList`).
- ColorGradientSettingsDropdown is wrapped in a components ToolsPanel; without it the ToolsPanelItem would not render.
- FontFamilyControl renders nothing without font families, so it receives a static fallback list.
- SpacingSizesControl is remounted via `key` when `sides` changes because its view is initial state.
- InspectorControls with a non-default group renders in the Styles tab (or Advanced panel), not the Settings tab.
- ToolSelector and PreviewOptions log a deprecation warning when mounted; the toggle defaults to off so the console stays clean until the verifier turns it on.
- BlockBindingsSourceFieldsList needs the Menu.Root of @wordpress/ui. This plugin bundles its own copy of @wordpress/ui (it is a bundled package, not an external), so a Menu.Root rendered from the plugin would not share React context with the copy inside wp-block-editor. The block therefore renders the list only through BlockBindingsAttributeControl's menu.
- BlockBindingsAttributeControl is read-only (shows "No sources available" or a disabled menu) when `canUpdateBlockBindings` is false or no registered source offers a string field for the attribute in the current context. Both bindings blocks render a components ToolsPanel because the control renders a ToolsPanelItem.
- DateFormatPicker reads `window.wp.date` for the canvas example and falls back to toLocaleDateString if it is missing.
- ColorGradientControl, ColorGradientSettingsDropdown, PanelColorGradientSettings and DuotoneControl store cleared values as an empty string, so a cleared swatch returns to its default.
- BlockEditorFontSizePicker: the block-editor FontSizePicker takes font sizes from `typography.fontSizes`; with a theme that defines none only the custom input appears.
- HeadingLevelDropdown with the "with paragraph" options passes 0 as a level; the canvas renders a `p` for it.
