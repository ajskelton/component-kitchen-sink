# Batch notes: form-controls

Package: `@wordpress/components`. Blocks were authored by reading component source and READMEs; nothing was run in the editor.

## Built

- `AnglePickerControl` -> `src/blocks/AnglePickerControl`: angle value and label.
- `Autocomplete` -> `src/blocks/Autocomplete`: contenteditable div wired to a hand-built record, one completer (`~` trigger, fruit list); trigger prefix and `isDebounced` in the inspector.
- `BaseControl` -> `src/blocks/BaseControl`: label, help, hideLabelFromVision, className, `BaseControl.VisualLabel`, wrapping a bare input.
- `useBaseControlProps` -> `src/blocks/UseBaseControlProps`: custom textarea built with the hook; the returned `baseControlProps` / `controlProps` are echoed in the canvas.
- `BorderBoxControl` -> `src/blocks/BorderBoxControl`: flat or split border value, colours, popover placement and offset, live preview box.
- `BorderControl` -> `src/blocks/BorderControl`: border value with slider, compact, units, style and colour toggles.
- `BoxControl` -> `src/blocks/BoxControl`: sides, splitOnAxis, units, presets, allowReset, padding preview.
- `CheckboxControl` -> `src/blocks/CheckboxControl`: checked, indeterminate, heading, help, disabled.
- `ComboboxControl` -> `src/blocks/ComboboxControl`: static options, allowReset, expandOnFocus, isLoading, filter callback.
- `CustomSelectControl` -> `src/blocks/CustomSelectControl`: styled options with hints, size, showSelectedHint.
- `DatePicker` -> `src/blocks/DatePicker`: ISO string, startOfWeek, isInvalidDate, events, onMonthPreviewed.
- `DateTimePicker` -> `src/blocks/DateTimePicker`: ISO string, is12Hour, dateOrder, startOfWeek, isInvalidDate, events.
- `TimePicker` -> `src/blocks/TimePicker`: ISO string, is12Hour, dateOrder, hideLabelFromVision.
- `FocalPointPicker` -> `src/blocks/FocalPointPicker`: x/y over an inline SVG data URL placeholder, resolvePoint snapping, drag callbacks.
- `FormFileUpload` -> `src/blocks/FormFileUpload`: persists chosen file names only; accept, multiple, icon, render prop.
- `FormToggle` -> `src/blocks/FormToggle`: checked, disabled.
- `FormTokenField` -> `src/blocks/FormTokenField`: tokens, suggestions and the experimental props.
- `__experimentalInputControl` -> `src/blocks/InputControl`: type, size, labelPosition, drag props, prefix/suffix wrappers.
- `__experimentalInputControlPrefixWrapper` -> `src/blocks/InputControlPrefixWrapper`: wrapper as the prefix of an InputControl; size, variant, children.
- `__experimentalInputControlSuffixWrapper` -> `src/blocks/InputControlSuffixWrapper`: same as above for the suffix.
- `__experimentalNumberControl` -> `src/blocks/NumberControl`: min/max/step/shiftStep, spinControls, size, drag.
- `__experimentalUnitControl` -> `src/blocks/UnitControl`: units via the custom units hook, disableUnits, reset on unit change, onUnitChange.
- `__experimentalUseCustomUnits` -> `src/blocks/UseCustomUnits`: availableUnits and defaultValues; returned units shown as JSON and fed to a UnitControl.
- `QueryControls` -> `src/blocks/QueryControls`: static author and category arrays; single (TreeSelect) and multiple (FormTokenField) category modes.
- `RadioControl` -> `src/blocks/RadioControl`: options with descriptions and a disabled option.
- `__experimentalRadio` -> `src/blocks/Radio`: one configurable Radio inside a minimal RadioGroup.
- `__experimentalRadioGroup` -> `src/blocks/RadioGroup`: group with three Radios, label, checked, disabled.
- `RangeControl` -> `src/blocks/RangeControl`: nearly every prop (marks, tooltip, icons, colours, stepper type, reset).
- `SearchControl` -> `src/blocks/SearchControl`: size, placeholder, onClose.
- `SelectControl` -> `src/blocks/SelectControl`: single and multiple, size, variant, labelPosition, prefix, suffix.
- `TextControl` -> `src/blocks/TextControl`: all `type` values, help, className.
- `TextareaControl` -> `src/blocks/TextareaControl`: rows, help, label.
- `ToggleControl` -> `src/blocks/ToggleControl`: help as string or function of checked.
- `__experimentalToggleGroupControl` -> `src/blocks/ToggleGroupControl`: isBlock, isAdaptiveWidth, isDeselectable, size, disabled.
- `__experimentalToggleGroupControlOption` -> `src/blocks/ToggleGroupControlOption`: one configurable option inside a minimal group.
- `__experimentalToggleGroupControlOptionIcon` -> `src/blocks/ToggleGroupControlOptionIcon`: one configurable icon option inside a minimal group.
- `TreeSelect` -> `src/blocks/TreeSelect`: static tree, noOptionLabel, size, disabled.
- `__unstableUseAutocompleteProps` -> `src/blocks/UseAutocompleteProps`: contenteditable div that spreads the hook's `ref` and ARIA props and renders the returned popover next to it.

## Skipped

None.

## Runtime risks

- `Autocomplete` and `UseAutocompleteProps`: the caret/record plumbing is hand-written (plain contenteditable div, `new Array( text.length )` for `formats` and `replacements`, no `@wordpress/rich-text` import). If the popover never opens, check `getCaretOffset`, that `record.start` is a number, and that the popover anchors (it uses rich-text `useAnchor` on the div). Enter and arrow keys inside the block wrapper may also be grabbed by the editor's writing flow.
- `UseAutocompleteProps` renders the hook's `children` (the popover) next to the editable div rather than inside it; spreading it inside a contenteditable would let React fight the browser over the text.
- `RadioGroup` / `Radio`: both log a `wp.components.__experimentalRadioGroup` deprecation notice (since 6.8); expected. `Radio` relies on the group's context.
- `FocalPointPicker`: uses an inline `data:image/svg+xml` URL as the placeholder image. If the picker shows no image, switch to a static hosted URL.
- `FormFileUpload`: the file itself is lost on save; only names persist.
- `BoxControl` / `QueryControls`: remounted through a `key` when `sides`, `units`, presets or category mode change, because these controls keep internal state. Preset tokens (`var:preset|spacing|slug`) are resolved by a local helper for the preview only.
- `BorderBoxControl` / `BorderControl`: attribute `border` is a free-form object (`type: object`); a split value has `top/right/bottom/left` keys. The `popoverPlacement` enum values have not been tried one by one.
- `DatePicker` / `DateTimePicker` / `TimePicker`: values are ISO strings; the displayed time may shift near midnight depending on the site timezone setting.
- `UseCustomUnits`: with every unit toggled off the hook returns `[]` and `UnitControl` gets an empty `units` list; this has not been checked against the component.
- `useBaseControlProps`, `__experimentalUseCustomUnits`, `__unstableUseAutocompleteProps`: `block.json` `title` and `description` carry the exact export name so the inventory matches them.
