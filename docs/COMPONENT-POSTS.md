# Component posts

The `ajs_component` post type holds one post per `@wordpress/components` and
`@wordpress/block-editor` export that has a test block. Each post shows where
the component is used by core blocks, when it was added and how it changed
over time, followed by the component's test block.

Front end: `/components/` lists every post, `/components/<block-slug>/` shows
one, for example `/components/toggle-group-control/`. Admin: **Components**
in the sidebar, with Package and Kind filters and Export / Added / Core
blocks columns.

## How it fits together

| Piece | Role |
| --- | --- |
| `data/inventory.json` | One row per export: package, name, kind, status and the test block that covers it. Written by `scripts/inventory.mjs` together with `docs/COMPONENTS.md`. |
| `data/usage.json` | Which core blocks import each export, scanned from the `@wordpress/block-library` source in `node_modules`. Written by `scripts/component-usage.mjs`. |
| `data/history.json` | Per export: the package version and date that first exported it, the first WordPress release that shipped that version, when an experimental export was stabilised, any `deprecated()` notice, and the Gutenberg changelog entries that name it. Written by `scripts/component-history.mjs`. |
| `data/wordpress-releases.json` | WordPress release → pinned package versions, used to label versions with the release that shipped them. Also written by `scripts/component-history.mjs`. |
| `includes/data.php` | Reads the JSON files (once per request) and merges them for one component key, `"<package>:<export>"`. |
| `includes/post-type.php` | Registers the post type, the `ajs_package` and `ajs_component_kind` taxonomies, the `ajs_package` / `ajs_export_name` meta, and the admin columns and filters. |
| `src/blocks/ComponentInfo` | The `ajs/component-info` block. Its `render.php` prints the Added, Used by core blocks and History sections from the data files; in the editor it renders the same output through `ServerSideRender`. |
| `includes/cli.php` | `wp ajs components sync`, which creates or updates the posts. |

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
