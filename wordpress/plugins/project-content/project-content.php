<?php
/**
 * Plugin Name: Project Content
 * Description: Registers project content types and taxonomies for the headless WordPress frontend.
 * Version: 0.1.0
 * Author: nextjs-headless-wordpress
 * License: GPL-2.0-or-later
 * Text Domain: project-content
 *
 * @package ProjectContent
 */

namespace ProjectContent;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PROJECT_POST_TYPE = 'project';
const TECHNOLOGY_TAXONOMY = 'technology';

/**
 * Register content types when WordPress initializes.
 *
 * The init hook is the standard point for registering custom post types and
 * taxonomies so WordPress can build admin menus, rewrite rules, and API schemas.
 */
function register_content_types() {
	register_project_post_type();
	register_technology_taxonomy();
}
add_action( 'init', __NAMESPACE__ . '\register_content_types' );

/**
 * Register the Project custom post type.
 */
function register_project_post_type() {
	$labels = [
		'name'                  => _x( 'Projects', 'Post type general name', 'project-content' ),
		'singular_name'         => _x( 'Project', 'Post type singular name', 'project-content' ),
		'menu_name'             => _x( 'Projects', 'Admin menu text', 'project-content' ),
		'name_admin_bar'        => _x( 'Project', 'Add new on toolbar', 'project-content' ),
		'add_new'               => __( 'Add New', 'project-content' ),
		'add_new_item'          => __( 'Add New Project', 'project-content' ),
		'new_item'              => __( 'New Project', 'project-content' ),
		'edit_item'             => __( 'Edit Project', 'project-content' ),
		'view_item'             => __( 'View Project', 'project-content' ),
		'all_items'             => __( 'All Projects', 'project-content' ),
		'search_items'          => __( 'Search Projects', 'project-content' ),
		'parent_item_colon'     => __( 'Parent Projects:', 'project-content' ),
		'not_found'             => __( 'No projects found.', 'project-content' ),
		'not_found_in_trash'    => __( 'No projects found in Trash.', 'project-content' ),
		'featured_image'        => _x( 'Project featured image', 'Overrides the Featured Image phrase', 'project-content' ),
		'set_featured_image'    => _x( 'Set project featured image', 'Overrides the Set featured image phrase', 'project-content' ),
		'remove_featured_image' => _x( 'Remove project featured image', 'Overrides the Remove featured image phrase', 'project-content' ),
		'use_featured_image'    => _x( 'Use as project featured image', 'Overrides the Use as featured image phrase', 'project-content' ),
		'archives'              => _x( 'Project archives', 'The post type archive label', 'project-content' ),
		'insert_into_item'      => _x( 'Insert into project', 'Overrides the Insert into post phrase', 'project-content' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this project', 'Overrides the Uploaded to this post phrase', 'project-content' ),
		'filter_items_list'     => _x( 'Filter projects list', 'Screen reader text for the filter links heading', 'project-content' ),
		'items_list_navigation' => _x( 'Projects list navigation', 'Screen reader text for pagination', 'project-content' ),
		'items_list'            => _x( 'Projects list', 'Screen reader text for the items list', 'project-content' ),
	];

	$args = [
		'labels'              => $labels,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_icon'           => 'dashicons-portfolio',
		'has_archive'         => true,
		'rewrite'             => [
			'slug' => PROJECT_POST_TYPE,
		],
		'supports'            => [
			'title',
			'editor',
			'excerpt',
			'thumbnail',
			'revisions',
		],
		'show_in_graphql'     => true,
		'graphql_single_name' => 'Project',
		'graphql_plural_name' => 'Projects',
	];

	register_post_type( PROJECT_POST_TYPE, $args );
}

/**
 * Register the Technology taxonomy for Projects.
 */
function register_technology_taxonomy() {
	$labels = [
		'name'                       => _x( 'Technologies', 'Taxonomy general name', 'project-content' ),
		'singular_name'              => _x( 'Technology', 'Taxonomy singular name', 'project-content' ),
		'search_items'               => __( 'Search Technologies', 'project-content' ),
		'popular_items'              => __( 'Popular Technologies', 'project-content' ),
		'all_items'                  => __( 'All Technologies', 'project-content' ),
		'parent_item'                => __( 'Parent Technology', 'project-content' ),
		'parent_item_colon'          => __( 'Parent Technology:', 'project-content' ),
		'edit_item'                  => __( 'Edit Technology', 'project-content' ),
		'view_item'                  => __( 'View Technology', 'project-content' ),
		'update_item'                => __( 'Update Technology', 'project-content' ),
		'add_new_item'               => __( 'Add New Technology', 'project-content' ),
		'new_item_name'              => __( 'New Technology Name', 'project-content' ),
		'separate_items_with_commas' => __( 'Separate technologies with commas', 'project-content' ),
		'add_or_remove_items'        => __( 'Add or remove technologies', 'project-content' ),
		'choose_from_most_used'      => __( 'Choose from the most used technologies', 'project-content' ),
		'not_found'                  => __( 'No technologies found.', 'project-content' ),
		'no_terms'                   => __( 'No technologies', 'project-content' ),
		'filter_by_item'             => __( 'Filter by technology', 'project-content' ),
		'items_list_navigation'      => __( 'Technologies list navigation', 'project-content' ),
		'items_list'                 => __( 'Technologies list', 'project-content' ),
		'most_used'                  => _x( 'Most Used', 'Technology taxonomy most used label', 'project-content' ),
		'back_to_items'              => __( '&larr; Go to Technologies', 'project-content' ),
		'menu_name'                  => __( 'Technologies', 'project-content' ),
	];

	$args = [
		'labels'              => $labels,
		'public'              => true,
		'show_ui'             => true,
		'show_admin_column'   => true,
		'show_in_menu'        => true,
		'hierarchical'        => false,
		'rewrite'             => [
			'slug' => TECHNOLOGY_TAXONOMY,
		],
		'show_in_graphql'     => true,
		'graphql_single_name' => 'Technology',
		'graphql_plural_name' => 'Technologies',
	];

	register_taxonomy( TECHNOLOGY_TAXONOMY, [ PROJECT_POST_TYPE ], $args );
}

/**
 * Register rewrite rules before flushing them on plugin activation.
 */
function activate() {
	register_content_types();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, __NAMESPACE__ . '\activate' );

/**
 * Flush rewrite rules when the plugin is deactivated.
 */
function deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\deactivate' );
