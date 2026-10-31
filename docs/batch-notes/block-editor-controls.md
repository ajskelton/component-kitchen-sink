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

## Skipped

## Runtime risks

- BlockAlignmentControl / BlockAlignmentToolbar return null when the parent layout offers no alignments (flex/grid parents, themes without alignWide).
- BlockFormatControls and BlockControls group=inline: the inline toolbar slot may only render for blocks the toolbar treats as text-editable; if the star/bold button is missing, check there first.
- InspectorControls with a non-default group renders in the Styles tab (or Advanced panel), not the Settings tab.
