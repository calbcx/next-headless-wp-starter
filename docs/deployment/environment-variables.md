# Deployment Environment Variables

This project uses environment variables to keep deployment-specific values out of source code.

## Frontend Variables

Set these in the frontend hosting provider.

```txt
WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
NEXT_PUBLIC_SITE_URL=<public-frontend-url>
```

### `WORDPRESS_GRAPHQL_URL`

Server-side frontend code uses this value to query WPGraphQL.

Expected shape:

```txt
https://<wordpress-host>/graphql
```

This value should point to the production WordPress GraphQL endpoint. Do not hardcode it in frontend modules.

### `NEXT_PUBLIC_SITE_URL`

Next.js uses this value as the metadata base for public site metadata and URL generation.

Expected shape:

```txt
https://<frontend-host>
```

Only use the `NEXT_PUBLIC_` prefix for values that are safe to expose to browsers.

## WordPress Variables

WordPress hosting providers usually manage database configuration through their own control panel, generated `wp-config.php`, or managed service settings.

For local Docker development, the root `.env.example` documents:

```txt
WORDPRESS_DB_HOST
WORDPRESS_DB_NAME
WORDPRESS_DB_USER
WORDPRESS_DB_PASSWORD
WORDPRESS_DB_ROOT_PASSWORD
```

Do not reuse local placeholder credentials in production.

## Safety Rules

- Commit `.env.example` files only.
- Do not commit `.env`, `.env.local`, `.env.production`, provider exports, or generated WordPress config with real credentials.
- Rotate any credential that is accidentally committed.
