# AWS Lightsail WordPress and AWS Amplify Frontend

This guide uses AWS Lightsail for WordPress and AWS Amplify for the Next.js frontend.

Lightsail hosts the WordPress CMS. Amplify hosts the JavaScript Next.js frontend.

## WordPress on AWS Lightsail

1. Create a Lightsail WordPress instance.
2. Configure DNS and HTTPS for the WordPress site.
3. Install and activate `WPGraphQL`.
4. Upload or deploy the custom plugin from `wordpress/plugins/project-content`.
5. Activate `Project Content` in WordPress.
6. Publish Project entries and assign Technology terms as needed.
7. Confirm the GraphQL endpoint responds:

   ```txt
   https://<wordpress-host>/graphql
   ```

If the Lightsail instance provides SSH and WP-CLI, [`wp-cli.md`](./wp-cli.md) can be used for the plugin installation and activation steps.

## Frontend on AWS Amplify

1. Create an Amplify app connected to the repository.
2. Confirm Amplify Hosting supports the Next.js version declared in `apps/web/package.json`.
3. Configure the app to build from the monorepo app root `apps/web`.
4. Use the JavaScript frontend commands from `apps/web`:

   ```bash
   npm ci
   npm run build
   ```

5. For a server-rendered Next.js deployment, confirm the Amplify build settings use `.next` as the build artifact directory.
6. Configure environment variables:

   ```txt
   WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
   NEXT_PUBLIC_SITE_URL=<public-frontend-url>
   ```

7. Deploy the frontend.

## Validate

- Visit the Amplify frontend URL.
- Confirm `/projects` renders published WordPress Project entries.
- Confirm `/technologies` renders assigned Technology terms.
- Confirm the Lightsail WordPress site can serve `https://<wordpress-host>/graphql`.
