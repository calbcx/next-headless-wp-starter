# WP-CLI WordPress Deployment

Use this guide when the WordPress host provides SSH access and WP-CLI.

WP-CLI is optional for this project. The same WordPress setup can also be done through WordPress admin, cPanel file tools, SFTP, or host-native deployment tooling.

## Requirements

- SSH access to the WordPress host.
- WP-CLI installed and available as `wp`.
- Access to the WordPress install directory.
- Permission to install and activate plugins.
- A backup or rollback path before changing a public site.

## Confirm the WordPress Install

SSH into the host and move to the WordPress install directory:

```bash
cd /path/to/wordpress
```

Confirm WP-CLI can read the site:

```bash
wp core version
wp option get home
wp plugin list
```

If WP-CLI reports that it cannot find WordPress, confirm the current directory contains the deployed WordPress install.

## Install WPGraphQL

Install and activate WPGraphQL from the WordPress plugin repository:

Use version 2.23.1 or newer, and keep it updated; see
[`security.md`](../../security.md).

```bash
wp plugin install wp-graphql --activate
```

If WPGraphQL is already installed, update or activate it:

```bash
wp plugin update wp-graphql
wp plugin activate wp-graphql
```

Confirm it is active:

```bash
wp plugin status wp-graphql
```

## Deploy the Custom Plugin

The custom plugin lives in this repository at:

```txt
wordpress/plugins/project-content
```

Package that folder from `wordpress/plugins`:

```bash
cd wordpress/plugins
zip -r project-content.zip project-content -x "*.DS_Store"
```

Copy `project-content.zip` to the WordPress host using the approved process for the environment, such as SFTP, SCP, cPanel file tools, or the host's deployment workflow.

From the WordPress install directory on the host, install or replace the plugin:

```bash
wp plugin install /path/to/project-content.zip --force --activate
```

Confirm the plugin is active:

```bash
wp plugin status project-content
```

## Refresh WordPress State

After deploying plugin changes, refresh rewrite rules:

```bash
wp rewrite flush
```

Then confirm the WordPress admin includes:

```txt
Projects
Projects -> Site Profile Settings
```

## Validate GraphQL

Confirm the public GraphQL endpoint responds:

```txt
https://<wordpress-host>/graphql
```

Use the GraphQL queries in [`post-deployment-validation.md`](./post-deployment-validation.md) to confirm published Projects and `projectContentSettings` are available.

## Operational Notes

- Do not run these commands against the wrong WordPress install. Confirm `wp option get home` before installing plugins.
- Do not store plugin zip files, database exports, credentials, or host backups in Git.
- Use `--force` only when intentionally replacing the deployed `project-content` plugin with the version from this repository.
- On shared hosting, WP-CLI may run under a different PHP version than the web server. If plugin activation fails in WP-CLI but not in WordPress admin, check the host PHP configuration.
