# Deployment Troubleshooting

Use this checklist when the deployed frontend cannot render WordPress content.

## Frontend Shows Empty States

Check:

- `WORDPRESS_GRAPHQL_URL` is configured in the frontend host.
- The value points to the production WordPress GraphQL endpoint.
- `WPGraphQL` is installed and active in WordPress.
- `Project Content` is active in WordPress.
- At least one Project entry is published.
- Technology terms are assigned if `/technologies` is expected to show entries.

## GraphQL Endpoint Does Not Respond

Check:

- WordPress is available over HTTPS.
- The URL ends with `/graphql`.
- Security plugins, firewall rules, or host-level settings are not blocking GraphQL requests.
- WPGraphQL is active and compatible with the WordPress version.

## Build Fails on Frontend Host

Check:

- The host builds from `apps/web`.
- Dependencies are installed with `npm ci` or `npm install`.
- The build command is `npm run build`.
- The app is deployed as a JavaScript Next.js app.
- Required environment variables are set in the frontend host.
- If using AWS Amplify, the provider currently supports the Next.js version declared in `apps/web/package.json`.
- If using AWS Amplify for a server-rendered Next.js deployment, the build artifact directory is configured as `.next`.

## cPanel Notes

cPanel is a good WordPress CMS hosting option for this architecture.

Do not assume cPanel can run the Next.js frontend unless the account provides Node.js application support or the frontend is deployed as static output that the account can serve.

## Content or Routes Are Missing

Check:

- Project entries are published, not drafts.
- Project slugs are present.
- Technology terms are assigned to Project entries.
- The frontend was rebuilt or revalidated after content changes if the deployed host caches static output.

## Security Checks

- Do not commit production `.env` files.
- Do not commit WordPress database exports.
- Do not commit uploaded media or backup archives.
- Do not expose private or draft WordPress content through frontend queries.
