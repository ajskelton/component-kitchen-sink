# Component Kitchen Sink

Every `@wordpress/components` and `@wordpress/block-editor` export, exercised in a real WordPress editor.

The plugin registers one test block per export, 312 in all, each with a sidebar control for every prop the component takes and a live demo on the canvas. Around them it builds a small site: a post per component with its history and usage, a post per core block with the components it imports, and nine test pages that put whole families of blocks on one screen.

## Try it in your browser

Nothing to install. WordPress Playground boots the plugin, seeds the posts and pages, and logs you in as admin:

**https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ajskelton/component-kitchen-sink/main/playground/blueprint.json**

It lands on the front page, logged in, with the admin bar. From there:

- open a **test page** from the list at the bottom (each has an Edit link), select a block and work through its settings in the sidebar;
- open a **Component post** to see when the export was added, how it changed, and which core blocks use it, with the test block underneath;
- open a **Core Block post** to see which components a block imports, each linked to its post.

The editor takes a few seconds to open with 300-odd block scripts; Playground is slower than a local site.

To run the same blueprint against a local copy of the repository (no GitHub fetch), from the plugin folder:

```bash
npx @wp-playground/cli@latest server --blueprint=playground/blueprint-local.json --mount=.:/wordpress/wp-content/plugins/component-kitchen-sink
```

See [docs/PLAYGROUND.md](docs/PLAYGROUND.md) for what the blueprint does and how to regenerate the test-page export.

## What's inside

| | |
| --- | --- |
| **312 test blocks** | One per export, generated from a scaffold and verified in the editor one family at a time. `docs/COMPONENTS.md` is the inventory; `docs/batch-notes/` records what each family found at runtime, including props that exist in the npm packages but not in the WordPress release that runs the editor. |
| **Component posts** (`/components/`) | One per export. Shows the package version and date that first exported it, the first WordPress release that shipped it, stabilisation and deprecation notes, every core block that imports it, and the Gutenberg changelog entries that name it, then the test block. |
| **Core Block posts** (`/core-blocks/`) | One per core block, from the `@wordpress/block-library` source. Shows the block's description, category and keywords, and the components it imports grouped by package, each linked to its Component post. |
| **Archives** | Card grids, 24 per page, with search, taxonomy filters and ordering: components by name, newest or oldest, most or least used; core blocks by name or by how many components they use. |
| **Test pages** | Nine pages, one per family (form controls, overlays and menus, colour and layout, editor internals, block editor controls, hooks, toolbar and SlotFill, content and media, plus a smoke page). |
| **Front page** | Live counts, filter links and the test pages, with a short guide to using them. |

Every test block links to its Component post: the heading on the front end, and a "Component post" panel in the editor sidebar.

## Where the data comes from

The posts render from JSON files under `data/`, regenerated with `npm run data`:

- `inventory.json`: every export, its kind (stable, experimental, unstable, hook or HOC) and the test block that covers it, from the installed packages.
- `usage.json`: which core blocks import each export, and the reverse, scanned from the `@wordpress/block-library` source.
- `history.json` and `wordpress-releases.json`: the first package version to export each name (from every minor release on npm, via unpkg), the Gutenberg changelogs, `deprecated()` calls in the package source, and the package versions pinned by each WordPress release since 5.0.

Details in [docs/COMPONENT-POSTS.md](docs/COMPONENT-POSTS.md).

## Local development

Requires Node 20+ and a WordPress site (the plugin was built against WordPress 7.1 on [Local](https://localwp.com/)).

```bash
npm install
npm run build
```

`build/` is committed, so a fresh clone works without building. Then, with WP-CLI, seed everything in one go:

```bash
wp ajs setup
```

It creates the Component and Core Block posts, the Primary navigation menu, a small footer template part, and flushes the rewrite rules. Import the test pages from `playground/test-pages.xml` with `wp import` or the Tools → Import screen.

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds every block and combines their styles into two shared stylesheets. |
| `npm run lint:js`, `npm run lint:css` | ESLint and stylelint over `src/`, `scripts/` and `assets/`. |
| `npm run data` | Regenerates the three JSON data sets (needs network access for history). |
| `node scripts/scaffold-block.mjs <ExportName> [--package block-editor] [--experimental]` | Scaffolds a new test block; see `docs/BLOCK-TEMPLATE.md`. |
| `wp ajs components sync`, `wp ajs core-blocks sync` | Re-seed one post type after the data changes (`--dry-run`, `--reset`). |

## Layout

```
assets/        kitchen-sink.svg, component-links.js (editor sidebar panel)
build/         compiled blocks and the combined stylesheets (committed)
data/          generated JSON the posts render from (committed)
docs/          block template, inventory, batch notes, post types, Playground
includes/      post types, data access, templates, archive tools, sync, setup, CLI
playground/    blueprints and the test-page export
scripts/       scaffold, inventory, usage and history generators, style combiner
src/blocks/    one folder per test block, plus the info, overview and tools blocks
```

## Caveats

- The editor runs the packages bundled with the WordPress release, not the versions in `node_modules`, so some documented props are no-ops at runtime. The batch notes list them.
- Usage is scanned from direct ES imports in the installed `@wordpress/block-library`, which is newer than the one bundled with WordPress; components reached through `privateApis` or shared helpers are not counted.
- This is a testing and exploration plugin. Don't run it on a production site.

## Licence

GPL-2.0-or-later.
