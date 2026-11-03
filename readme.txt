=== Component Kitchen Sink ===
Contributors:      Anthony Skelton
Tags:              block, components, block-editor, developer
Requires at least: 7.0
Tested up to:      7.1
Requires PHP:      7.4
Stable tag:        2.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Every @wordpress/components and @wordpress/block-editor export, exercised in a real editor.

== Description ==

One test block for every export of @wordpress/components and @wordpress/block-editor, 312 in all, each with a sidebar control for every prop and a live demo on the canvas. Around them:

* A Component post per export (/components/): when it was first exported, the first WordPress release that shipped it, deprecations, every core block that uses it, and its changelog history, followed by the test block.
* A Core Block post per WordPress core block (/core-blocks/): the components it imports, grouped by package and linked to their posts.
* Archives with search, filters and ordering, 24 cards per page.
* Nine test pages that put whole families of blocks on one screen, and a front page that links to all of it with a short guide.

Every test block links to its Component post, from the front end and from a panel in the editor sidebar.

= Try it in WordPress Playground =

Nothing to install:

https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ajskelton/component-kitchen-sink/main/playground/blueprint.json

The blueprint installs Twenty Twenty-Four and the plugin, imports the test pages, seeds the posts, menu and footer, and logs you in as admin on the front page. To run it against a local checkout instead, from the plugin folder:

`npx @wp-playground/cli@latest server --blueprint=playground/blueprint-local.json --mount=.:/wordpress/wp-content/plugins/component-kitchen-sink`

See docs/PLAYGROUND.md.

== Installation ==

1. Copy the plugin to `wp-content/plugins/component-kitchen-sink` (the build output and data files are committed, so no build step is needed) and activate it.
1. Seed the posts, menu, footer and rewrite rules with WP-CLI: `wp ajs setup`.
1. Import the test pages from `playground/test-pages.xml` with `wp import` or Tools → Import.

For development, `npm install` and `npm run build` rebuild the blocks, `npm run data` regenerates the JSON the posts render from, and `node scripts/scaffold-block.mjs <ExportName>` scaffolds a new test block. README.md and docs/ have the details.

== Frequently Asked Questions ==

= Is this plugin for a production website? =

No. It is for testing and exploring only.

= Why does a documented prop do nothing? =

The editor runs the @wordpress packages bundled with your WordPress release, not the versions in node_modules. Props added since that release are no-ops at runtime; docs/batch-notes/ lists the ones found.

= Where does the usage and history data come from? =

data/usage.json is scanned from the @wordpress/block-library source; data/history.json from every minor release of the packages on npm, the Gutenberg changelogs, and the package versions pinned by each WordPress release. See docs/COMPONENT-POSTS.md.

== Changelog ==

= 2.0.0 =
* 312 test blocks, one per @wordpress/components and @wordpress/block-editor export.
* Component and Core Block post types with generated usage and history data.
* Archives with search, filters and ordering; front page; navigation and footer.
* WordPress Playground blueprint and `wp ajs setup`.
