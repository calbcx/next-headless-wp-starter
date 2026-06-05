# cPanel WordPress and AWS Amplify Frontend

This guide uses cPanel for the WordPress CMS and AWS Amplify for the Next.js frontend.

cPanel is used here as a WordPress hosting option. The Next.js runtime is handled by AWS Amplify.

## WordPress on cPanel

1. Create or choose a WordPress install in cPanel.
2. Ensure the WordPress site is available over HTTPS.
3. Install and activate `WPGraphQL`.
4. Upload or deploy the custom plugin from `wordpress/plugins/project-content`.
5. Activate `Project Content` in WordPress.
6. Publish Project entries and assign Technology terms as needed.
7. Confirm the GraphQL endpoint responds:

   ```txt
   https://<wordpress-host>/graphql
   ```

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
- Check Amplify build logs if the frontend renders empty states unexpectedly.
