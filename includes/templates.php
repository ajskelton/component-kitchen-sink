<?php
/**
 * Block templates for the Component and Core Block post types, and their
 * archive queries.
 *
 * The templates are registered from the plugin (WordPress 6.7+), so any
 * block theme gets the same single page and archive grid. They reuse the
 * active theme's header and footer template parts. Archives show 24 posts
 * per page; search, filters and ordering live in includes/archive-tools.php.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/**
 * The post types that get templates, with their taxonomies and summary block.
 *
 * @return array<string, array> Post type => { taxonomies: { taxonomy => label }, summary: block name, name: label }.
 */
function ajs_templated_post_types(): array {
	return array(
		AJS_COMPONENT_POST_TYPE  => array(
			'name'       => __( 'Components', 'component-kitchen-sink' ),
			'taxonomies' => array(
				AJS_COMPONENT_TAX_PACKAGE => __( 'Package', 'component-kitchen-sink' ),
				AJS_COMPONENT_TAX_KIND    => __( 'Kind', 'component-kitchen-sink' ),
			),
			'summary'    => 'ajs/component-info',
		),
		AJS_CORE_BLOCK_POST_TYPE => array(
			'name'       => __( 'Core Blocks', 'component-kitchen-sink' ),
			'taxonomies' => array(
				AJS_CORE_BLOCK_TAX_CATEGORY => __( 'Category', 'component-kitchen-sink' ),
			),
			'summary'    => 'ajs/core-block-info',
		),
	);
}

/**
 * Registers the single, archive and taxonomy templates for both post types.
 */
function ajs_component_register_templates(): void {
	if ( ! function_exists( 'register_block_template' ) ) {
		return;
	}

	foreach ( ajs_templated_post_types() as $post_type => $config ) {
		register_block_template(
			'component-kitchen-sink//single-' . $post_type,
			array(
				/* translators: %s: post type name. */
				'title'       => sprintf( __( 'Single %s', 'component-kitchen-sink' ), $config['name'] ),
				'description' => __( 'One post with a back link, term pills, the content and previous/next links.', 'component-kitchen-sink' ),
				'post_types'  => array( $post_type ),
				'content'     => ajs_component_single_template( $post_type, array_keys( $config['taxonomies'] ) ),
			)
		);

		$archive = ajs_component_archive_template( $post_type, $config['taxonomies'], $config['summary'] );

		register_block_template(
			'component-kitchen-sink//archive-' . $post_type,
			array(
				/* translators: %s: post type name. */
				'title'       => sprintf( __( '%s Archive', 'component-kitchen-sink' ), $config['name'] ),
				'description' => __( 'A grid of cards, 24 per page.', 'component-kitchen-sink' ),
				'content'     => $archive,
			)
		);

		foreach ( $config['taxonomies'] as $taxonomy => $label ) {
			register_block_template(
				'component-kitchen-sink//taxonomy-' . $taxonomy,
				array(
					/* translators: 1: post type name, 2: taxonomy label. */
					'title'       => sprintf( __( '%1$s by %2$s', 'component-kitchen-sink' ), $config['name'], $label ),
					'description' => __( 'The archive grid filtered by one term.', 'component-kitchen-sink' ),
					'content'     => $archive,
				)
			);
		}
	}
}

add_action( 'init', 'ajs_component_register_templates' );

/**
 * Registers the front page template: a short introduction and the
 * ajs/site-overview block.
 */
function ajs_component_register_front_page(): void {
	if ( ! function_exists( 'register_block_template' ) ) {
		return;
	}

	register_block_template(
		'component-kitchen-sink//front-page',
		array(
			'title'       => __( 'Kitchen Sink Front Page', 'component-kitchen-sink' ),
			'description' => __( 'Introduces the plugin and links to the component and core block archives and the test pages.', 'component-kitchen-sink' ),
			'content'     => ajs_component_front_page_template(),
		)
	);
}

add_action( 'init', 'ajs_component_register_front_page' );

/**
 * The front page template.
 *
 * @return string Block markup.
 */
function ajs_component_front_page_template(): string {
	$heading = esc_html__( 'Every @wordpress component, exercised in a real editor.', 'component-kitchen-sink' );
	$intro   = esc_html__( 'Component Kitchen Sink is a WordPress plugin with one test block for every export of @wordpress/components and @wordpress/block-editor. Each component has a post with its history and the core blocks that use it, each core block has a post with the components it uses, and the test pages put whole families of blocks on one screen.', 'component-kitchen-sink' );
	$art     = ajs_component_front_page_art();

	return <<<HTML
<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull">
	<!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|40"},"blockGap":{"left":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40)">
		<!-- wp:column {"verticalAlignment":"center","width":"58%","style":{"spacing":{"blockGap":"var:preset|spacing|30"}}} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%">
			<!-- wp:heading {"level":1,"fontSize":"xx-large","style":{"typography":{"lineHeight":"1.1"}}} -->
			<h1 class="wp-block-heading has-xx-large-font-size" style="line-height:1.1">{$heading}</h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"fontSize":"large"} -->
			<p class="has-large-font-size">{$intro}</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%">
			<!-- wp:html -->
			{$art}
			<!-- /wp:html -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

	<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignwide" style="padding-bottom:var(--wp--preset--spacing--60)">
		<!-- wp:ajs/site-overview {"align":"wide"} /-->
	</div>
	<!-- /wp:group -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
HTML;
}

/**
 * The archive URL of a post type, as an escaped attribute.
 *
 * @param string $post_type Post type.
 * @return string URL.
 */
function ajs_component_archive_url( string $post_type ): string {
	return esc_url( get_post_type_archive_link( $post_type ) ?: home_url( '/' ) );
}

/**
 * Post-terms blocks for a list of taxonomies, as pills.
 *
 * @param string[] $taxonomies Taxonomy names.
 * @return string Block markup.
 */
function ajs_component_term_pills( array $taxonomies ): string {
	$blocks = array();

	foreach ( $taxonomies as $taxonomy ) {
		$blocks[] = sprintf( '<!-- wp:post-terms {"term":"%s","className":"is-style-pill"} /-->', esc_attr( $taxonomy ) );
	}

	return implode( "\n\t\t\t", $blocks );
}

/**
 * The single template for a post type.
 *
 * @param string   $post_type  Post type.
 * @param string[] $taxonomies Taxonomies shown as pills under the title.
 * @return string Block markup.
 */
function ajs_component_single_template( string $post_type, array $taxonomies ): string {
	$config = ajs_templated_post_types()[ $post_type ];
	$url    = ajs_component_archive_url( $post_type );
	/* translators: %s: post type name. */
	$all   = esc_html( sprintf( __( 'All %s', 'component-kitchen-sink' ), strtolower( $config['name'] ) ) );
	$pills = ajs_component_term_pills( $taxonomies );

	return <<<HTML
<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull">
	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50"},"margin":{"bottom":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
	<div class="wp-block-group" style="margin-bottom:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--50)">
		<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size"><a href="{$url}">&larr; {$all}</a></p><!-- /wp:paragraph -->

		<!-- wp:post-title {"level":1,"fontSize":"x-large"} /-->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
		<div class="wp-block-group">
			{$pills}
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:post-content {"lock":{"move":false,"remove":true},"align":"full","layout":{"type":"constrained"}} /-->

	<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"},"padding":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:separator {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"backgroundColor":"contrast-3","className":"is-style-wide"} -->
		<hr class="wp-block-separator has-text-color has-contrast-3-color has-alpha-channel-opacity has-contrast-3-background-color has-background is-style-wide" style="margin-bottom:var(--wp--preset--spacing--40)"/>
		<!-- /wp:separator -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
		<div class="wp-block-group">
			<!-- wp:post-navigation-link {"type":"previous","showTitle":true,"linkLabel":true,"arrow":"arrow"} /-->
			<!-- wp:post-navigation-link {"showTitle":true,"linkLabel":true,"arrow":"arrow"} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
HTML;
}

/**
 * The archive template for a post type, shared by its taxonomy archives.
 *
 * @param string                $post_type  Post type.
 * @param array<string, string> $taxonomies Taxonomy => filter label (used by the archive-tools block).
 * @param string                $summary    Block that renders the one-line card summary.
 * @return string Block markup.
 */
function ajs_component_archive_template( string $post_type, array $taxonomies, string $summary ): string {
	$per_page = AJS_COMPONENT_ARCHIVE_PER_PAGE;
	$summary  = esc_attr( $summary );

	return <<<HTML
<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull">
	<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--50)">
		<!-- wp:query-title {"type":"archive","showPrefix":false,"align":"wide","style":{"typography":{"lineHeight":"1"}}} /-->

		<!-- wp:term-description {"align":"wide"} /-->

		<!-- wp:ajs/archive-tools {"postType":"{$post_type}","align":"wide"} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:query {"query":{"perPage":{$per_page},"pages":0,"offset":0,"postType":"{$post_type}","order":"asc","orderBy":"title","inherit":true},"align":"wide","layout":{"type":"default"}} -->
	<div class="wp-block-query alignwide">
		<!-- wp:query-no-results -->
		<!-- wp:paragraph --><p>Nothing found.</p><!-- /wp:paragraph -->
		<!-- /wp:query-no-results -->

		<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
		<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--50)">
			<!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:group {"className":"ajs-info-card","style":{"border":{"width":"1px","radius":"8px"},"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|10"},"dimensions":{"minHeight":"100%"}},"borderColor":"contrast-3","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group ajs-info-card has-border-color has-contrast-3-border-color" style="border-width:1px;border-radius:8px;min-height:100%;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:post-title {"isLink":true,"level":2,"fontSize":"medium"} /-->
				<!-- wp:{$summary} {"variant":"summary"} /-->
			</div>
			<!-- /wp:group -->
			<!-- /wp:post-template -->

			<!-- wp:spacer {"height":"var:preset|spacing|40"} -->
			<div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
			<!-- /wp:spacer -->

			<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"space-between"}} -->
			<!-- wp:query-pagination-previous /-->
			<!-- wp:query-pagination-numbers /-->
			<!-- wp:query-pagination-next /-->
			<!-- /wp:query-pagination -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:query -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
HTML;
}

/**
 * The kitchen sink illustration shown beside the front page introduction.
 *
 * Inlined from assets/kitchen-sink.svg so it takes the theme's text colour.
 *
 * @return string SVG markup, or an empty string when the file is missing.
 */
function ajs_component_front_page_art(): string {
	$path = dirname( __DIR__ ) . '/assets/kitchen-sink.svg';

	return is_readable( $path ) ? trim( (string) file_get_contents( $path ) ) : '';
}
