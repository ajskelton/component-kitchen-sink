# Try it in WordPress Playground

[WordPress Playground](https://playground.wordpress.net/) runs WordPress in
the browser. `playground/blueprint.json` tells it how to set this plugin up,
so anyone can open the editor with every test block, the Component and Core
Block posts and the test pages, without installing anything:

```
https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ajskelton/component-kitchen-sink/main/playground/blueprint.json
```

The repository must be public (or the
`installPlugin` step pointed at a zip URL that allows cross-origin requests)
for Playground to fetch it.

## What the blueprint does

1. Sets the site title, tagline and `/%postname%/` permalinks.
2. Installs and activates Twenty Twenty-Four, the theme the plugin's
   templates and the local site are styled against (Playground would
   otherwise use the current default theme, with different fonts).
3. Installs the plugin from the GitHub repository (`git:directory`
   resource) and activates it. `build/` and `data/` are committed, so no
   build step is needed.
4. Imports `playground/test-pages.xml`, a WordPress export of the nine test
   pages. Regenerate it after changing them:

   ```bash
   bin/wp export --post_type=page --post_status=publish --dir=playground --filename_format=test-pages.xml --skip_comments
   ```

5. Calls `ajs_site_setup()` (`includes/setup.php`), which seeds the
   Component and Core Block posts, creates the Primary navigation menu
   (Home, Components, Core Blocks, Test pages), saves a small Footer
   template part in place of the theme's demo footer and flushes the
   rewrite rules. The same function backs `wp ajs setup` for a local site.
6. Logs in as `admin` and lands on the Components list in wp-admin.

Playground is slower than a local site: with 300-odd block scripts the
editor takes a few seconds to open.

## Testing the blueprint locally

The Playground CLI runs a blueprint against a local copy of the plugin
without GitHub:

```bash
npx @wp-playground/cli@latest server --blueprint=playground/blueprint-local.json --mount=.:/wordpress/wp-content/plugins/component-kitchen-sink
```

`playground/blueprint-local.json` is the same blueprint with the
`installPlugin` step replaced by an `activatePlugin` step for the mounted
folder.
