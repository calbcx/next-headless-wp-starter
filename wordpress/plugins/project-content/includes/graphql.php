<?php
/**
 * WPGraphQL fields for Project Content settings.
 *
 * @package ProjectContent
 */

namespace ProjectContent\GraphQL;

use ProjectContent\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom GraphQL fields when WPGraphQL builds its schema.
 */
function register_fields() {
	if ( ! function_exists( 'register_graphql_object_type' ) || ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_object_type(
		'ProjectContentSettings',
		[
			'description' => __( 'Public profile settings managed by the Project Content plugin.', 'project-content' ),
			'fields'      => [
				'cvUrl'       => [
					'type'        => 'String',
					'description' => __( 'CV or resume URL.', 'project-content' ),
				],
				'githubUrl'   => [
					'type'        => 'String',
					'description' => __( 'GitHub profile URL.', 'project-content' ),
				],
				'linkedinUrl' => [
					'type'        => 'String',
					'description' => __( 'LinkedIn profile URL.', 'project-content' ),
				],
				'websiteUrl'  => [
					'type'        => 'String',
					'description' => __( 'Personal website URL.', 'project-content' ),
				],
			],
		]
	);

	register_graphql_field(
		'RootQuery',
		'projectContentSettings',
		[
			'type'        => 'ProjectContentSettings',
			'description' => __( 'Public profile settings for the headless frontend.', 'project-content' ),
			'resolve'     => function () {
				return Settings\get_footer_profile_links();
			},
		]
	);
}
add_action( 'graphql_register_types', __NAMESPACE__ . '\register_fields' );
