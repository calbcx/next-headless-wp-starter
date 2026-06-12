# Migration Notes

Use these notes when moving the project from local Docker WordPress to a hosted WordPress CMS, or when moving between supported hosting patterns.

This document does not add a new hosting provider. It describes the practical migration concerns shared by the documented cPanel, AWS Lightsail, Vercel, and AWS Amplify deployment paths.

## What Moves

WordPress-managed data lives outside the Git repository:

- Project posts
- Technology terms
- Media uploads
- WordPress users and roles
- WordPress options
- Site Profile Settings values used by the footer
- WPGraphQL plugin settings, if changed from defaults

Source-controlled code lives in the repository:

- `apps/web`
- `wordpress/plugins/project-content`
- Documentation
- Example environment files

## What Not to Commit

Do not commit:

- Production database exports
- Local or production `.env` files
- `wp-config.php` with real credentials
- Uploaded media files
- WordPress backup archives
- Provider export files that contain secrets

If a database export is needed for a migration, transfer it outside Git using the host's migration tooling or another controlled process.

## Local to Hosted WordPress

1. Create or choose the hosted WordPress install.
2. Install and activate `WPGraphQL`.
3. Upload or deploy `wordpress/plugins/project-content` as the `project-content` plugin folder under `wp-content/plugins`, or upload a zip that expands to that folder.
4. Activate `Project Content`.
5. Recreate or migrate Project entries and Technology terms.
6. Recreate Site Profile Settings values under `Projects` -> `Site Profile Settings`.
7. Upload any required media through WordPress admin.
8. Confirm `https://<wordpress-host>/graphql` responds.
9. Configure the frontend host with the hosted GraphQL endpoint.

Manual recreation is practical only for small sample datasets. For non-trivial content, use the host's migration tooling, WordPress export/import, or a controlled database and media migration process outside Git.

The local Docker database is a development artifact. Do not assume it is safe or appropriate to publish directly.

## WordPress Host Changes

When moving WordPress between hosts:

- Confirm the new host supports HTTPS before pointing the frontend at it.
- Confirm permalinks are saved in WordPress after migration.
- Confirm media URLs point to the new WordPress host or an intentional media host.
- Confirm Project slugs did not change.
- Re-enter Site Profile Settings values if options were not migrated.
- Run [`post-deployment-validation.md`](./post-deployment-validation.md) before switching traffic or relying on the new host.

After the WordPress URL changes, update the frontend host:

```txt
WORDPRESS_GRAPHQL_URL=https://<new-wordpress-host>/graphql
```

Then rebuild or redeploy the frontend.

## Frontend Host Changes

When moving the Next.js frontend between documented frontend hosts:

- Keep the app root set to `apps/web`.
- Keep the build command as `npm run build`.
- Set `WORDPRESS_GRAPHQL_URL` to the active WordPress GraphQL endpoint.
- Set `NEXT_PUBLIC_SITE_URL` to the new public frontend URL.
- Confirm the new host supports the Next.js version in `apps/web/package.json`.
- Rebuild and validate `/projects` and a project detail page.

After the frontend URL changes, update:

```txt
NEXT_PUBLIC_SITE_URL=https://<new-frontend-host>
```

## Content Migration Checks

After moving content, run the public route and GraphQL checks in [`post-deployment-validation.md`](./post-deployment-validation.md). Pay particular attention to Project counts, slugs, Technology terms, media URLs, and Site Profile Settings values because those are the most likely migration drift points.

## Rollback Notes

Keep rollback simple:

- Preserve the previous WordPress host until the new one is validated.
- Preserve the previous frontend deployment until the new one renders WordPress content.
- Do not delete local Docker data until hosted content has been verified.
- Record which WordPress URL and frontend deployment were last known good.

Rollback planning depends on the selected host. Use host-native backup and deployment history features where available.
