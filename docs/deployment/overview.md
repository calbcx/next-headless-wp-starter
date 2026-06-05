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

## Deployment Checklist

- WordPress is reachable over HTTPS.
- WPGraphQL is installed and active.
- `Project Content` is active from `wordpress/plugins/project-content`.
- Published Project entries exist in WordPress.
- The frontend host has `WORDPRESS_GRAPHQL_URL` configured.
- The frontend host has `NEXT_PUBLIC_SITE_URL` configured.
- `npm run lint` passes in `apps/web`.
- `npm run build` passes in `apps/web`.
- No secrets or production exports are committed.
