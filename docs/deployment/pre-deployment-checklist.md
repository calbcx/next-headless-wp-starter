# Pre-Deployment Checklist

Use this checklist before deploying a production or public test instance.

This project is not a full production operations template. The goal is to confirm the practical requirements for a headless WordPress CMS, WPGraphQL API, and JavaScript Next.js frontend.

## Repository Readiness

- Confirm no `.env`, `.env.local`, production exports, database dumps, uploads, backup archives, or credentials are committed.
- Confirm `apps/web/.env.example` documents the expected frontend variables without real values.
- Run frontend checks from `apps/web`:

  ```bash
  npm run lint
  npm run build
  ```

- Confirm the deployed branch contains the latest `wordpress/plugins/project-content` plugin code.
- Confirm the frontend still uses JavaScript files and the Next.js App Router.

## WordPress CMS Readiness

- Confirm the WordPress host supports HTTPS.
- Confirm WordPress core is installed and reachable at the intended CMS URL.
- Confirm administrator credentials are strong and not reused from local development.
- Enable two-factor authentication if the host or plugin stack supports it.
- Install and activate `WPGraphQL`.
- Deploy and activate the custom `Project Content` plugin from `wordpress/plugins/project-content`.
- Confirm the `Projects` admin menu appears.
- Confirm `Projects` -> `Site Profile Settings` appears if footer profile links are used.
- Publish at least one Project entry before validating the frontend.
- Assign Technology terms to Project entries if `/technologies` should show data.
- Avoid publishing draft, private, or internal-only content.

## WPGraphQL Readiness

- Confirm the GraphQL endpoint responds over HTTPS:

  ```txt
  https://<wordpress-host>/graphql
  ```

- Confirm the endpoint returns published Project content with the query documented in the root `README.md`.
- Confirm the `projectContentSettings` field resolves if footer profile links are configured.
- Check whether a security plugin, host firewall, CDN, or bot protection layer blocks POST requests to `/graphql`.

## Frontend Host Readiness

- Confirm the frontend host builds from `apps/web`.
- Confirm the install command is appropriate for the host, commonly:

  ```bash
  npm ci
  ```

- Confirm the build command is:

  ```bash
  npm run build
  ```

- Configure frontend environment variables in the host dashboard:

  ```txt
  WORDPRESS_GRAPHQL_URL=https://<wordpress-host>/graphql
  NEXT_PUBLIC_SITE_URL=https://<frontend-host>
  ```

- Confirm `WORDPRESS_GRAPHQL_URL` points to the WordPress CMS, not the frontend.
- Confirm `NEXT_PUBLIC_SITE_URL` points to the public frontend URL, not the WordPress admin URL.
- If deploying on AWS Amplify, confirm Amplify Hosting supports the Next.js version in `apps/web/package.json`.

## Launch Readiness

- Confirm the WordPress URL and frontend URL both use HTTPS.
- Confirm the frontend can reach the WordPress GraphQL endpoint from the hosting environment.
- Confirm the WordPress host allows the frontend host to make server-side requests to `/graphql`.
- Confirm backup expectations with the WordPress host before publishing important content.
- Confirm a rollback path for the frontend deployment, such as redeploying a previous successful build.
- Keep provider credentials, production database exports, and generated WordPress config files out of the repository.
