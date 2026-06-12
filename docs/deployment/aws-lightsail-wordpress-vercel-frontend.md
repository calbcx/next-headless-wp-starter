# AWS Lightsail WordPress and Vercel Frontend

This guide uses AWS Lightsail as a practical AWS option for hosting WordPress and Vercel for the Next.js frontend.

Lightsail hosts the WordPress CMS. Vercel hosts the JavaScript Next.js frontend.

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
- Confirm the Lightsail WordPress site can serve `https://<wordpress-host>/graphql`.
