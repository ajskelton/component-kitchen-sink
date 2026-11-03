# Block template

Every component exported by `@wordpress/components` and `@wordpress/block-editor` gets one test block in this plugin. This document is the contract each block follows. `src/blocks/Button` is the reference block: copy its shape.

The work list lives in [COMPONENTS.md](COMPONENTS.md). Regenerate it with `node scripts/inventory.mjs` after adding a block.

## Workflow

1. Pick a `todo` row in `docs/COMPONENTS.md`.
2. Scaffold the block:

   ```sh
   node scripts/scaffold-block.mjs <ExportName> [--package components|block-editor] [--experimental] [--dir <DirName>]
   ```

   - `<ExportName>` is the component name without a prefix: `HStack`, not `__experimentalHStack`.
   - `--package` defaults to `components`.
   - `--experimental` imports `__experimental<ExportName> as <ExportName>`. A prefixed name (`__experimentalHStack`, `__unstableMotion`) also works; the script strips the prefix and uses the alias import.
   - `--dir` sets the block directory and slug. You only need it for the few names that both packages export (`ColorPalette`, `FontSizePicker`, `Autocomplete`, `__experimentalUnitControl`). Use `--dir BlockEditor<Name>` for the block-editor one.
   - The script refuses to overwrite an existing directory, and it formats the new files with the project's Prettier config.
3. Fill in `edit.js` (and `block.json` attributes) until the block meets the rules below.
4. Run `npm run build` and `npm run lint:js`. Both must pass.
5. Insert the block in the editor at http://kitchen-sink.test, select it, use every control in the inspector, save, reload, and check the front end. Keep the browser console free of errors.
6. Run `node scripts/inventory.mjs`. The row flips to `done` automatically.

Blocks are discovered automatically. `plugin.php` registers every `build/blocks/*/block.json`, so PHP never needs editing.

Styles are served from two shared files. `npm run build` ends by running `scripts/combine-styles.mjs`, which concatenates every block's `index.css` and `style-index.css` into `build/editor.css` and `build/style.css`, and `plugin.php` points each block at those instead of its own files. That keeps the editor to two stylesheet requests instead of two per block. Keep `editor.scss` and `style.scss` scoped to `.wp-block-ajs-<slug>` so the combined files cannot clash. `npm start` does not run the script, so after `start` the plugin falls back to per-block files until the next `npm run build`.

## File conventions

The scaffold creates `src/blocks/<ExportName>/` with these files. The build copies them to `build/blocks/<ExportName>/`.

| File | Contents |
| --- | --- |
| `block.json` | `apiVersion` 3; `name` `ajs/<kebab-case of ExportName>`; `title` = ExportName; `category` `ajs-kitchen-sink`; `description` "Exercises the &lt;ExportName&gt; component from @wordpress/&lt;package&gt;"; `supports.html` false; `textdomain` `component-kitchen-sink`; `editorScript` `file:./index.js`, `editorStyle` `file:./index.css`, `style` `file:./style-index.css`, `render` `file:./render.php`; a single attribute `value` (string, default `""`). |
| `index.js` | `registerBlockType( metadata.name, { edit: Edit } )`. Blocks are dynamic, so there is no `save`. |
| `edit.js` | `<InspectorControls>` with a `PanelBody` titled ExportName that holds the component under test, plus a `useBlockProps()` wrapper in the canvas with an `<h3>` of the component name, a canvas demo, and `<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>`. |
| `render.php` | The block wrapper (`get_block_wrapper_attributes()`), the component name in an `<h3>`, and `wp_json_encode( $attributes )` in a `<pre>`, all escaped. |
| `editor.scss`, `style.scss` | A comment header only. |

The inventory script matches blocks to exports through the `description` string, so keep its exact wording.

The scaffolded `edit.js` has two marked regions:

- `{ /* TODO: exercise <ExportName> here */ }` … `{ /* END TODO … */ }` in the inspector. It already contains one minimal working use of the component when the scaffold knows a safe one (TextControl, SelectControl, ToggleControl, Spinner, AlignmentMatrixControl, and about 30 others). For any other component it holds a `TextControl` bound to `value` as a placeholder, with the import line to add in a comment.
- `{ /* TODO: canvas demo */ }` in the canvas.

The `value` attribute is only a placeholder. Rename it or replace it with attributes named after the props you exercise, as the Button block does.

## Rules every block must follow

a. **Exercise the main props and variants in the inspector.** Read the component's README in `node_modules/@wordpress/<package>/src/<component>/README.md` and add a control for each prop that changes behaviour or appearance: `variant`, `size`, `status`, `disabled`, `isDestructive`, `orientation`, `options`, and so on. Label each control with the prop name so testers can map the UI to the API.

b. **Persist at least one meaningful value in block attributes.** Wire `onChange` (or the equivalent) to `setAttributes`, so saving and reloading proves the value round-trips. Declare each attribute in `block.json` with a type and a default, and add an `enum` when the prop has a fixed set of values.

c. **Show the component in the canvas when it is visual.** Render it inside the `useBlockProps()` wrapper with the same props as the inspector copy. Build the props once and spread them in both places. Non-visual components (providers, slot/fill plumbing, hooks) can leave the canvas demo empty, but say why in a comment.

d. **Echo attributes in `render.php`.** Keep the scaffolded `<pre>` with the `wp_json_encode` output. Escape everything with `esc_html()` or `esc_attr()`.

e. **Register no new global styles.** Keep `editor.scss` and `style.scss` empty or scoped to `.wp-block-ajs-<slug>`. Don't enqueue extra stylesheets, don't add theme.json or global-styles changes, and don't style `.components-*` classes globally.

Also:

- Import experimental and unstable APIs only through the alias form (`__experimentalX as X`), and wrap that import in `/* eslint-disable @wordpress/no-unsafe-wp-apis */` … `/* eslint-enable … */`. The scaffold does this when it generates a working use. This plugin exists to exercise those APIs, but the exemption should stay narrow.
- Wrap user-visible strings in `__( '…', 'component-kitchen-sink' )`. Prop names used as labels (`variant`, `size`) can stay untranslated.
- Pass icons from `@wordpress/icons`. Store the icon's key in the attribute, not the icon element.
- Add no new npm dependencies.

## Worked example: Button

### 1. Scaffold

```sh
$ node scripts/scaffold-block.mjs Button
Created src/blocks/Button/
  block.json
  index.js
  edit.js
  render.php
  editor.scss
  style.scss
Block ajs/button imports Button from @wordpress/components. Run npm run build.
```

Button is in the scaffold's list of known uses, so the generated inspector already renders a working `<Button variant="secondary">` that writes a timestamp to `value`.

### 2. Attributes

Replace the placeholder `value` attribute in `block.json` with one attribute per exercised prop:

```json
"attributes": {
	"text": { "type": "string", "default": "Button" },
	"variant": { "type": "string", "enum": [ "primary", "secondary", "tertiary", "link" ], "default": "primary" },
	"size": { "type": "string", "enum": [ "default", "compact", "small" ], "default": "default" },
	"isDestructive": { "type": "boolean", "default": false },
	"disabled": { "type": "boolean", "default": false },
	"icon": { "type": "string", "default": "" },
	"iconPosition": { "type": "string", "enum": [ "left", "right" ], "default": "left" },
	"clicks": { "type": "number", "default": 0 }
}
```

### 3. edit.js

The full file is `src/blocks/Button/edit.js`. Its key moves:

```jsx
import { check, cog, external, plus, starFilled, trash } from '@wordpress/icons';

const ICONS = { plus, cog, check, trash, external, starFilled };

export default function Edit( { attributes, setAttributes } ) {
	const { text, variant, size, isDestructive, disabled, icon, iconPosition, clicks } =
		attributes;

	// Build the props once; the inspector preview and the canvas share them.
	const buttonProps = {
		variant,
		size,
		isDestructive,
		disabled,
		accessibleWhenDisabled: disabled,
		icon: ICONS[ icon ] ?? undefined,
		iconPosition,
		text,
		label: text ? undefined : __( 'Icon button', 'component-kitchen-sink' ),
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Button', 'component-kitchen-sink' ) }>
					{ /* Preview: the component itself, inside the inspector. */ }
					<BaseControl id="ajs-button-preview" label={ __( 'Preview', 'component-kitchen-sink' ) }>
						<div>
							<Button id="ajs-button-preview" { ...buttonProps } />
						</div>
					</BaseControl>
					{ /* One control per prop, labelled with the prop name. */ }
					<TextControl label="text" value={ text } onChange={ ( next ) => setAttributes( { text: next } ) } />
					<SelectControl label="variant" value={ variant } options={ VARIANT_OPTIONS } onChange={ ( next ) => setAttributes( { variant: next } ) } />
					<SelectControl label="size" value={ size } options={ SIZE_OPTIONS } onChange={ ( next ) => setAttributes( { size: next } ) } />
					<ToggleControl label="isDestructive" checked={ isDestructive } onChange={ ( next ) => setAttributes( { isDestructive: next } ) } />
					<ToggleControl label="disabled" checked={ disabled } onChange={ ( next ) => setAttributes( { disabled: next } ) } />
					<SelectControl label="icon" value={ icon } options={ ICON_OPTIONS } onChange={ ( next ) => setAttributes( { icon: next } ) } />
					<SelectControl label="iconPosition" value={ iconPosition } options={ ICON_POSITION_OPTIONS } disabled={ ! icon } onChange={ ( next ) => setAttributes( { iconPosition: next } ) } />
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Button</h3>
				<Button { ...buttonProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
```

The snippet is condensed; the real file is Prettier-formatted and also has a "Reset clicks" button.

### 4. render.php, styles, index.js

These stay exactly as scaffolded. The front end shows the heading and the attribute JSON, and neither stylesheet adds any rules.

### 5. Check it

```sh
npm run build && npm run lint:js
node scripts/inventory.mjs   # Button row becomes done → src/blocks/Button
```

In the editor, every inspector control changes both Button copies, a click on either Button increments `clicks`, and after a save the front end prints the saved attributes.
