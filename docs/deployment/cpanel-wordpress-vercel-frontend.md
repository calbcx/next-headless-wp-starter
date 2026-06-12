# cPanel WordPress and Vercel Frontend

This guide uses cPanel for the WordPress CMS and Vercel for the Next.js frontend.

cPanel is used here as a WordPress hosting option. This guide does not assume cPanel is running the Next.js app.

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

If the cPanel account provides SSH and WP-CLI, [`wp-cli.md`](./wp-cli.md) can be used for the plugin installation and activation steps.

## Frontend on Vercel

1. Create a Vercel project from the repository.
2. Set the Vercel root directory to `apps/web`, or otherwise configure the project so commands run from `apps/web`.
3. Use the default install command or configure dependency installation for `apps/web`.
4. Configure the build command:

   ```bash
   npm run build
   ```

5. Configure environment variables:

   ```txt
   WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
   NEXT_PUBLIC_SITE_URL=<public-frontend-url>
   ```

6. Deploy the frontend.

## Validate

- Visit the Vercel frontend URL.
- Confirm `/projects` renders published WordPress Project entries.
- Confirm `/technologies` renders assigned Technology terms.
- Run the GraphQL query from the project README in the WordPress WPGraphQL IDE if content does not appear.
