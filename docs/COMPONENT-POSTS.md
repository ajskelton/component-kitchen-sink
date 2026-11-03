# Component and Core Block posts

The `ajs_component` post type holds one post per `@wordpress/components` and
`@wordpress/block-editor` export that has a test block. Each post shows where
the component is used by core blocks, when it was added and how it changed
over time, followed by the component's test block.

The `ajs_core_block` post type holds one post per WordPress core block (every
folder with a `block.json` in the `@wordpress/block-library` source). Each
post shows the block's description, category and keywords, and the
components it imports, grouped by package and linked to their Component
posts; the "Used by core blocks" chips on a Component post link back. Core
block posts live at `/core-blocks/<block>/` (for example
`/core-blocks/paragraph/`), with the archive at `/core-blocks/` and
`/core-blocks/category/<category>/`. Two slugs are suffixed because WordPress
reserves them: `/core-blocks/embed-block/` and `/core-blocks/rss-block/`.

Front end: `/components/` lists every post in a three-column grid, 24 per
page, ordered by export name without its `__experimental` / `__unstable`
prefix (the `ajs_sort_name` meta). `/components/package/<package>/` and
`/components/kind/<kind>/` filter it, and `/components/<block-slug>/` shows
one component, for example `/components/toggle-group-control/`. Admin:
**Components** in the sidebar, with Package and Kind filters and Export /
Added / Core blocks columns.

Each archive starts with the `ajs/archive-tools` block: a search box, one
select per taxonomy with term counts, and an ordering select, submitted as a
GET form to the archive. Search uses the `ajs_q` query var (not `s`, so the
archive template keeps rendering), ordering uses `ajs_orderby`, and the
taxonomy selects use the taxonomies' own query vars, so
`/components/?ajs_q=toggle&ajs_package=components&ajs_orderby=most-used` is
a shareable URL. Orderings: components by name, newest or oldest added, and
most or least used by core blocks; core blocks by name or by how many
components they use. The non-name orderings sort on meta written at sync
time (`ajs_added_date`, `ajs_usage_count`, `ajs_component_count`), so after
`npm run data` run the sync commands again to refresh them. All of this is
in `includes/archive-tools.php`.

The layouts come from block templates registered by `includes/templates.php`
(`single-ajs_component`, `archive-ajs_component`, `taxonomy-ajs_package`,
`taxonomy-ajs_component_kind`). They reuse the active theme's `header` and
`footer` template parts, so they work with any block theme and can be
customised in the Site Editor like theme templates. The archive cards use
the info block's **summary** variant (`"variant":"summary"`), a one-line
package / kind / added / usage strip.

## From a test block to its post

Every test block links to the Component post for its export. On the front
end the block's heading is the link (`render_block` filter in
`includes/component-links.php`, skipped on the Component post itself). In
the editor, every `ajs/*` block gets a "Component post" panel at the bottom
of its inspector with View and Edit buttons, added by
`assets/component-links.js` through the `editor.BlockEdit` filter; the
block-to-post map is printed inline by the same PHP file. Neither touches
the blocks' own source, so new blocks get the link as soon as their post
exists.

## Front page and navigation

The plugin registers a `front-page` block template (so it is used for the
site's home whatever the reading settings say) with a short introduction and
the `ajs/site-overview` block, which renders two cards linking to the
Component and Core Block archives with live counts and their taxonomy
filters, followed by every page that contains one of this plugin's blocks
(the test pages). The introduction can be edited in the Site Editor like
any template.

The header's Navigation block has no `ref`, so it shows the most recent
`wp_navigation` post. That post (ID 4 on the local site, "Primary") holds
Home, Components, Core Blocks and a Test pages submenu; edit it in the Site
Editor under Navigation. The starter content WordPress ships with (the
"Hello world!" post, its comment, the Sample Page and the Privacy Policy
draft) is in the trash.

## How it fits together

| Piece | Role |
| --- | --- |
| `data/inventory.json` | One row per export: package, name, kind, status and the test block that covers it. Written by `scripts/inventory.mjs` together with `docs/COMPONENTS.md`. |
| `data/usage.json` | Which core blocks import each export (`components`), and the same data inverted per block with each block's `block.json` metadata (`blocks`), scanned from the `@wordpress/block-library` source in `node_modules`. Written by `scripts/component-usage.mjs`. |
| `data/history.json` | Per export: the package version and date that first exported it, the first WordPress release that shipped that version, when an experimental export was stabilised, any `deprecated()` notice, and the Gutenberg changelog entries that name it. Written by `scripts/component-history.mjs`. |
| `data/wordpress-releases.json` | WordPress release → pinned package versions, used to label versions with the release that shipped them. Also written by `scripts/component-history.mjs`. |
| `includes/data.php` | Reads the JSON files (once per request) and merges them for one component key, `"<package>:<export>"`. |
| `includes/post-type.php` | Registers both post types: `ajs_component` with the `ajs_package` and `ajs_component_kind` taxonomies and the `ajs_package` / `ajs_export_name` / `ajs_sort_name` meta, and `ajs_core_block` with the `ajs_block_category` taxonomy and the `ajs_block_name` meta, plus admin columns and filters for each. |
| `src/blocks/ComponentInfo` | The `ajs/component-info` block. Its `render.php` prints the Added, Used by core blocks and History sections from the data files; in the editor it renders the same output through `ServerSideRender`. |
| `src/blocks/ArchiveTools` | The `ajs/archive-tools` block: the search, filter and order form at the top of each archive. |
| `src/blocks/SiteOverview` | The `ajs/site-overview` block used on the front page: archive cards with counts and filters, and the list of test pages. |
| `src/blocks/CoreBlockInfo` | The `ajs/core-block-info` block: block.json metadata and the components the block imports, linked to their posts. Both info blocks share `src/blocks/shared/_info.scss`. |
| `includes/component-links.php` and `assets/component-links.js` | The links from each test block to its Component post, on the front end and in the editor inspector. |
| `includes/sync.php` | The `AJS_Component_Sync` and `AJS_Core_Block_Sync` classes that create or update the posts; no WP-CLI dependency. |
| `includes/setup.php` | `ajs_site_setup()`: both syncs, the Primary navigation menu and a rewrite flush in one call. Used by `wp ajs setup` and by the Playground blueprint. |
| `includes/cli.php` | `wp ajs components sync`, `wp ajs core-blocks sync` and `wp ajs setup`, thin wrappers over the two files above. |
| `includes/templates.php` | The front page template and the single and archive block templates for both post types. |
| `includes/archive-tools.php` | Query vars, orderings and the `pre_get_posts` hook behind the archive tools: 24 per page, search, filters and ordering. |

Posts store only the package and export name. Everything else is looked up
from `data/` when the post renders, so regenerating the data never requires
touching the posts.

## Regenerating the data

```bash
npm run data
```

runs, in order, `npm run inventory`, `npm run data:usage` and
`npm run data:history`. The history script fetches from `registry.npmjs.org`,
`unpkg.com` and `raw.githubusercontent.com` and caches every response under
`.cache/history/` (git-ignored), so a rerun is quick; pass `--offline` to use
the cache only. Commit the regenerated `data/*.json`.

Run `npm run data` after adding a block, after updating the packages, or when
a new WordPress release should appear in the release mapping (add its branch
to the list in `scripts/component-history.mjs`).

## Creating the posts

```bash
bin/wp ajs components sync
```

Creates a post for every `data/inventory.json` row with status `done`, and
updates the title, slug, excerpt, meta and terms of posts that already exist
(matched by meta, so titles can change without duplicates). Content is seeded
for new posts only:

```html
<!-- wp:ajs/component-info /-->
<!-- wp:heading {"level":2} --><h2 class="wp-block-heading">Demo</h2><!-- /wp:heading -->
<!-- wp:ajs/<block-slug> /-->
```

Use `--reset` to rewrite the content of every post as well, and `--dry-run`
to see what would change. After the first sync run `bin/wp rewrite flush` so
`/components/` resolves.

```bash
bin/wp ajs core-blocks sync
```

does the same for core blocks from the `blocks` section of `data/usage.json`:
title and excerpt from `block.json`, the category as a term, the block name as
`ajs_block_name` meta, and `<!-- wp:ajs/core-block-info /-->` as the content
of new posts. It takes the same `--reset` and `--dry-run` flags.

On a fresh site, one command does all of it:

```bash
bin/wp ajs setup
```

It runs both syncs, creates the Primary navigation menu (or replaces a
default page list) and flushes the rewrite rules. See `docs/PLAYGROUND.md`
for running the whole thing in WordPress Playground.

## Caveats

- Usage is scanned from the `@wordpress/block-library` version installed in
  `node_modules`, which is newer than the one bundled with the WordPress
  release running the site. The block prints the version it was based on.
- Only direct ES imports count. A component reached through `privateApis`,
  `unlock()`, or re-exported from a shared helper shows up under "shared
  block-library code" or not at all.
- "Added" is the first `X.Y.0` release of the package whose `src/index.js`
  exports the name, so pre-1.0 Gutenberg plugin history is not covered, and a
  rename counts as a new component (the experimental name keeps its own row
  and the stable one records the stabilisation).
- The `@wordpress/block-editor` changelog rarely names components, so most
  block-editor posts show an empty History section.
