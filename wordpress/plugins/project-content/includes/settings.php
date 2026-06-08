<?php
/**
 * Site profile settings for the Project Content plugin.
 *
 * @package ProjectContent
 */

namespace ProjectContent\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const OPTION_CV_URL       = 'project_content_cv_url';
const OPTION_GITHUB_URL   = 'project_content_github_url';
const OPTION_LINKEDIN_URL = 'project_content_linkedin_url';
const OPTION_WEBSITE_URL  = 'project_content_website_url';
const CAPABILITY          = 'manage_options';
const SAVE_ACTION         = 'project_content_update_footer_profile_links';
const NONCE_ACTION        = 'project_content_profile_settings';
const NONCE_NAME          = 'project_content_profile_settings_nonce';

/**
 * Get the profile URL fields managed by this settings page.
 *
 * @return array<string,string>
 */
function footer_profile_link_fields() {
	return [
		OPTION_CV_URL       => __( 'CV / resume URL', 'project-content' ),
		OPTION_GITHUB_URL   => __( 'GitHub URL', 'project-content' ),
		OPTION_LINKEDIN_URL => __( 'LinkedIn URL', 'project-content' ),
		OPTION_WEBSITE_URL  => __( 'Personal website URL', 'project-content' ),
	];
}

/**
 * Add the settings page below the Projects menu.
 */
function add_footer_profile_links_screen() {
	$settings_page = add_submenu_page(
		'edit.php?post_type=' . \ProjectContent\PROJECT_POST_TYPE,
		__( 'Site Profile Settings', 'project-content' ),
		__( 'Site Profile Settings', 'project-content' ),
		CAPABILITY,
		'project-content-settings',
		__NAMESPACE__ . '\show_footer_profile_links_screen'
	);

	if ( $settings_page ) {
		add_action( 'admin_head-' . $settings_page, __NAMESPACE__ . '\print_footer_profile_links_css' );
	}
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_footer_profile_links_screen' );

/**
 * Add small admin-only styles for the custom settings layout.
 */
function print_footer_profile_links_css() {
	?>
	<style>
		.project-content-settings-page__fields {
			max-width: 680px;
			margin-top: 24px;
		}

		.project-content-settings-page__field {
			margin-bottom: 22px;
		}

		.project-content-settings-page__label {
			display: block;
			margin-bottom: 6px;
			font-weight: 600;
		}
	</style>
	<?php
}

/**
 * Save profile URL options from the settings page.
 */
function handle_footer_profile_links_update() {
	if ( ! current_user_can( CAPABILITY ) ) {
		wp_die( esc_html__( 'You do not have permission to manage these settings.', 'project-content' ) );
	}

	check_admin_referer( NONCE_ACTION, NONCE_NAME );

	$footer_links = footer_profile_links_from_request();

	update_option( OPTION_CV_URL, $footer_links[ OPTION_CV_URL ] );
	update_option( OPTION_GITHUB_URL, $footer_links[ OPTION_GITHUB_URL ] );
	update_option( OPTION_LINKEDIN_URL, $footer_links[ OPTION_LINKEDIN_URL ] );
	update_option( OPTION_WEBSITE_URL, $footer_links[ OPTION_WEBSITE_URL ] );

	wp_safe_redirect( footer_profile_links_screen_url( 'saved' ) );
	exit;
}
add_action( 'admin_post_' . SAVE_ACTION, __NAMESPACE__ . '\handle_footer_profile_links_update' );

/**
 * Build the admin URL for returning to the footer profile links screen.
 *
 * @param string $status Optional save status.
 * @return string
 */
function footer_profile_links_screen_url( $status = '' ) {
	$query_args = [
		'post_type' => \ProjectContent\PROJECT_POST_TYPE,
		'page'      => 'project-content-settings',
	];

	if ( '' !== $status ) {
		$query_args['project_content_settings'] = $status;
	}

	return add_query_arg( $query_args, admin_url( 'edit.php' ) );
}

/**
 * Collect submitted profile URLs in the same shape used by the stored options.
 *
 * @return array<string,string>
 */
function footer_profile_links_from_request() {
	$submitted_urls = [];

	foreach ( footer_profile_link_fields() as $option => $label ) {
		$submitted_urls[ $option ] = clean_footer_profile_link( posted_profile_link_text( $option ) );
	}

	return $submitted_urls;
}

/**
 * Read a profile link field from the current settings request.
 *
 * @param string $option Option name.
 * @return string
 */
function posted_profile_link_text( $option ) {
	$field_value = filter_input( INPUT_POST, $option, FILTER_UNSAFE_RAW );

	return is_string( $field_value ) ? $field_value : '';
}

/**
 * Prepare a profile link for storage.
 *
 * @param string $value Submitted URL.
 * @return string
 */
function clean_footer_profile_link( $value ) {
	if ( ! current_user_can( CAPABILITY ) ) {
		return '';
	}

	$profile_link = trim( (string) $value );

	if ( '' === $profile_link ) {
		return '';
	}

	if ( false === strpos( $profile_link, '://' ) ) {
		$profile_link = 'https://' . $profile_link;
	}

	$profile_link = esc_url_raw( $profile_link, [ 'http', 'https' ] );

	if ( ! wp_http_validate_url( $profile_link ) ) {
		return '';
	}

	return $profile_link;
}

/**
 * Get the saved site profile settings.
 *
 * @return array<string,string>
 */
function get_footer_profile_links() {
	return [
		'cvUrl'       => (string) get_option( OPTION_CV_URL, '' ),
		'githubUrl'   => (string) get_option( OPTION_GITHUB_URL, '' ),
		'linkedinUrl' => (string) get_option( OPTION_LINKEDIN_URL, '' ),
		'websiteUrl'  => (string) get_option( OPTION_WEBSITE_URL, '' ),
	];
}

/**
 * Render the profile URL settings page.
 */
function show_footer_profile_links_screen() {
	if ( ! current_user_can( CAPABILITY ) ) {
		wp_die( esc_html__( 'You do not have permission to manage these settings.', 'project-content' ) );
	}

	?>
	<div class="wrap project-content-settings-page">
		<h1><?php echo esc_html__( 'Site Profile Settings', 'project-content' ); ?></h1>
		<?php if ( 'saved' === filter_input( INPUT_GET, 'project_content_settings', FILTER_SANITIZE_SPECIAL_CHARS ) ) : ?>
			<div class="notice notice-success is-dismissible">
				<p><?php echo esc_html__( 'Site profile settings saved.', 'project-content' ); ?></p>
			</div>
		<?php endif; ?>
		<p>
			<?php echo esc_html__( 'Manage the public profile links rendered by the Next.js footer.', 'project-content' ); ?>
		</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="<?php echo esc_attr( SAVE_ACTION ); ?>" />
			<?php wp_nonce_field( NONCE_ACTION, NONCE_NAME ); ?>
			<div class="project-content-settings-page__fields">
				<?php
				foreach ( footer_profile_link_fields() as $option => $label ) {
					print_footer_profile_link_control( $option, $label );
				}
				?>
			</div>
			<p>
				<button type="submit" class="button button-primary">
					<?php echo esc_html__( 'Save profile links', 'project-content' ); ?>
				</button>
			</p>
		</form>
	</div>
	<?php
}

/**
 * Render one profile URL field.
 *
 * @param string $option Option name.
 * @param string $label Field label.
 */
function print_footer_profile_link_control( $option, $label ) {
	$description_id = $option . '_description';
	?>
	<div class="project-content-settings-page__field">
		<label class="project-content-settings-page__label" for="<?php echo esc_attr( $option ); ?>">
			<?php echo esc_html( $label ); ?>
		</label>
		<input
			type="text"
			inputmode="url"
			class="regular-text"
			id="<?php echo esc_attr( $option ); ?>"
			name="<?php echo esc_attr( $option ); ?>"
			value="<?php echo esc_attr( get_option( $option, '' ) ); ?>"
			placeholder="https://example.com"
			aria-describedby="<?php echo esc_attr( $description_id ); ?>"
		/>
		<p class="description" id="<?php echo esc_attr( $description_id ); ?>">
			<?php echo esc_html__( 'Enter a full URL or a domain. Domains are saved with https://.', 'project-content' ); ?>
		</p>
	</div>
	<?php
}
