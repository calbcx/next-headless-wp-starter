# Deployment Troubleshooting

Use this checklist when the deployed frontend cannot render WordPress content.

## Frontend Shows Empty States

Check:

- Run the environment, WordPress, and GraphQL checks in [`post-deployment-validation.md`](./post-deployment-validation.md).
- The frontend host is not serving an old deployment built before the environment variables were added.
- Technology terms are assigned if `/technologies` is expected to show entries.

## GraphQL Endpoint Does Not Respond

Check:

- WordPress is available over HTTPS.
- The URL ends with `/graphql`.
- Security plugins, firewall rules, or host-level settings are not blocking GraphQL requests.
- WPGraphQL is active and compatible with the WordPress version.
- The endpoint accepts POST requests, not only browser GET requests.
- Any CDN or proxy in front of WordPress is not redirecting `/graphql` to a login, challenge, or maintenance page.

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
- The WordPress migration did not change expected slugs.
- The frontend detail URL uses the current WordPress slug.

## Footer Profile Links Are Missing

Check:

- Values are saved in WordPress under `Projects` -> `Site Profile Settings`.
- The `projectContentSettings` query returns values in WPGraphQL.
- The URLs are valid `http` or `https` links.
- The frontend was rebuilt or revalidated after the values changed.
- The footer renders only configured links, so empty settings are expected to be hidden.

## Migration Issues

Check:

- Run the content migration checks in [`migration-notes.md`](./migration-notes.md), then validate with [`post-deployment-validation.md`](./post-deployment-validation.md).
- `WORDPRESS_GRAPHQL_URL` was updated in the frontend host after changing the WordPress URL.

## Security Checks

- Do not commit production `.env` files.
- Do not commit WordPress database exports.
- Do not commit uploaded media or backup archives.
- Do not expose private or draft WordPress content through frontend queries.
