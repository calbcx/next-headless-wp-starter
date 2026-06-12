# Deployment Overview

This project is designed to deploy WordPress and Next.js as separate applications.

WordPress is the CMS. Next.js is the public frontend. WPGraphQL is the primary API layer between them.

## Deployment Contract

The frontend reads WordPress content through:

```txt
WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
```

The public frontend URL is configured with:

```txt
NEXT_PUBLIC_SITE_URL=<public-frontend-url>
```

Do not commit production `.env` files, credentials, database exports, backups, or uploaded media.

## Common Deployment Shape

```txt
WordPress CMS
  - Hosts content editing
  - Runs WPGraphQL
  - Runs the Project Content plugin

Next.js frontend
  - Runs the JavaScript frontend in apps/web
  - Fetches published content from WORDPRESS_GRAPHQL_URL
  - Serves public pages
```

## Documented Hosting Patterns

- cPanel WordPress CMS with Vercel frontend
- cPanel WordPress CMS with AWS Amplify frontend
- AWS Lightsail WordPress CMS with Vercel frontend
- AWS Lightsail WordPress CMS with AWS Amplify frontend

cPanel is documented primarily as a WordPress CMS hosting option. Hosting the Next.js frontend on cPanel depends on Node.js application support or static export compatibility and is not assumed in these guides.

AWS Amplify is documented as a frontend hosting option, but its Next.js runtime support should be checked against the version in `apps/web/package.json` before deployment.

## Shared Deployment Guides

- [`pre-deployment-checklist.md`](./pre-deployment-checklist.md): readiness checks before deploying WordPress and the frontend.
- [`post-deployment-validation.md`](./post-deployment-validation.md): validation steps after the CMS and frontend are live.
- [`migration-notes.md`](./migration-notes.md): notes for moving local WordPress data or changing documented hosts.
- [`operations.md`](./operations.md): lightweight support and maintenance tasks after deployment.
- [`wp-cli.md`](./wp-cli.md): optional WP-CLI commands for installing and updating WordPress plugins.
- [`environment-variables.md`](./environment-variables.md): required deployment environment variables.
- [`troubleshooting.md`](./troubleshooting.md): common deployment and content rendering issues.

## Provider Pair Guides

- [`cpanel-wordpress-vercel-frontend.md`](./cpanel-wordpress-vercel-frontend.md)
- [`cpanel-wordpress-aws-amplify-frontend.md`](./cpanel-wordpress-aws-amplify-frontend.md)
- [`aws-lightsail-wordpress-vercel-frontend.md`](./aws-lightsail-wordpress-vercel-frontend.md)
- [`aws-lightsail-wordpress-aws-amplify-frontend.md`](./aws-lightsail-wordpress-aws-amplify-frontend.md)

## Quick Deployment Checklist

- Choose a documented WordPress host and frontend host pairing.
- Run [`pre-deployment-checklist.md`](./pre-deployment-checklist.md) before launch.
- Run [`post-deployment-validation.md`](./post-deployment-validation.md) after the CMS and frontend are live.
- Keep secrets, database exports, uploads, and provider backup files out of the repository.
