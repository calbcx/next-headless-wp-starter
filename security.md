# Security

## Purpose

This document describes the security expectations and boundaries for this project.

This is a public codebase. The repository should be safe to share with contributors and other developers.

## Security Goals

- Keep secrets out of the repository.
- Keep private information out of the repository.
- Use safe WordPress development practices.
- Use safe frontend environment variable practices.
- Document security assumptions clearly.
- Keep the project suitable for public source control visibility.

## Public Repository Rules

Do not commit passwords, API keys, authentication tokens, private SSH keys, production `.env` files, production database exports, WordPress backup files, sensitive private data, private business notes, sensitive screenshots, legal documents, or sensitive private information.

Commit only example environment files such as:

```txt
.env.example
```

Do not commit:

```txt
.env
.env.local
.env.production
wp-config.php with real credentials
database.sql
backup.zip
```

## Environment Variables

Environment variables should be used for configuration that changes by environment.

Examples:

```txt
WORDPRESS_GRAPHQL_URL
NEXT_PUBLIC_SITE_URL
WORDPRESS_DB_NAME
WORDPRESS_DB_USER
WORDPRESS_DB_PASSWORD
```

Only variables that are safe for the browser should use the `NEXT_PUBLIC_` prefix.

Server-only secrets should not use `NEXT_PUBLIC_`.

## WordPress Security

### Admin Access

Use strong WordPress administrator credentials.

Recommended practices:

- Use a unique administrator username.
- Use a strong password.
- Enable two-factor authentication where available.
- Limit administrator accounts.
- Remove unused users.
- Remove unused themes and plugins.
- Keep WordPress core, themes, and plugins updated.

### Plugins

Use as few plugins as practical.

Suggested plugin categories:

- WPGraphQL
- ACF if custom fields are needed
- A security plugin if deployed publicly
- A backup plugin if appropriate for the hosting environment

Avoid installing plugins that are not needed for the project.

### Custom Plugin Security

The custom plugin should follow WordPress security practices.

When handling input:

- Sanitize incoming values.
- Validate expected data types.
- Check permissions for admin actions.
- Use nonces for custom admin forms if added.

When outputting data:

- Escape HTML output.
- Escape attributes.
- Escape URLs.
- Avoid rendering unsanitized user input.

Useful WordPress escaping functions:

```php
esc_html()
esc_attr()
esc_url()
wp_kses_post()
```

Useful WordPress sanitization functions:

```php
sanitize_text_field()
sanitize_title()
sanitize_email()
esc_url_raw()
```

### Custom Post Types

Custom post types exposed to the API should expose only content intended for public display.

Published project content may be public.

Drafts, private posts, and admin-only notes should not be rendered by the frontend.

## API Security

The frontend should fetch only the content needed to render public pages.

Public GraphQL requests should avoid exposing draft content, private content, internal notes, user emails, admin usernames, and unnecessary metadata.

WPGraphQL queries should request only required fields and avoid over-fetching.

## Next.js Security

### Environment Variables

Do not expose secrets through `NEXT_PUBLIC_` variables.

Safe public examples:

```txt
NEXT_PUBLIC_SITE_URL
```

Potentially unsafe examples:

```txt
NEXT_PUBLIC_API_SECRET
NEXT_PUBLIC_WORDPRESS_ADMIN_PASSWORD
```

### JavaScript API Handling

Frontend JavaScript should handle WordPress API responses defensively.

Recommended practices:

- Validate that API responses are arrays or objects before mapping them.
- Provide empty states for missing content.
- Avoid assuming optional fields are always present.
- Keep response normalization inside the WordPress helper module.
- Avoid exposing server-only values to client components.

### Rendering Content

Content from WordPress should be treated carefully.

If rendering HTML from WordPress content, use a deliberate rendering approach.

Do not pass arbitrary HTML into the frontend without understanding the source and sanitization behavior.

### Dependencies

Keep dependencies limited.

Run dependency checks periodically.

Suggested frontend commands:

```bash
npm audit
npm run lint
npm run build
```

## Docker and Local Development Security

The Docker setup is intended for local development.

Do not use local development credentials in production.

Local database passwords in `.env.example` are placeholders only.

Do not expose local database ports publicly.

Do not commit local database volumes or exports.

## Deployment Security

### WordPress Deployment

When deploying WordPress, use HTTPS, keep WordPress and plugins updated, use strong admin credentials, restrict admin access where practical, use backups appropriate to the hosting provider, remove unused themes and plugins, and avoid editing plugin/theme files directly in production.

### Next.js Deployment

When deploying Next.js, configure environment variables in the hosting provider, do not hardcode secrets, review build logs for accidental secret exposure, use HTTPS, and set the production WordPress GraphQL endpoint URL intentionally.

## Content Security

This project may include sample content or technical examples. Review all published content before deployment.

Do not publish private information, private credentials, confidential screenshots, internal emails, private contracts, sensitive analytics data, legal claims, or unverified performance metrics.

Use generalized descriptions whenever source material comes from private or restricted work.

## Git Hygiene

Before committing, check:

```bash
git status
```

Review staged changes:

```bash
git diff --staged
```

Search for common secret patterns before publishing:

```bash
grep -R "password" .
grep -R "secret" .
grep -R "api_key" .
grep -R "token" .
```

These searches are not complete security scans, but they are useful basic checks.

## Incident Response

If a secret is accidentally committed:

1. Remove the secret from the code.
2. Rotate the exposed credential.
3. Review the Git history exposure.
4. Consider rewriting Git history if the repository has not been widely cloned.
5. Review related services for unauthorized use.

Removing a secret from the latest commit alone may not remove it from Git history.

## Security Review Checklist

Before making the repository public:

- [ ] No `.env` files are committed.
- [ ] No API keys are committed.
- [ ] No passwords are committed.
- [ ] No private details are committed.
- [ ] No production database exports are committed.
- [ ] No backup archives are committed.
- [ ] `.gitignore` covers common local and secret files.
- [ ] WordPress plugin code sanitizes input where applicable.
- [ ] WordPress plugin code escapes output where applicable.
- [ ] Frontend environment variables are reviewed.
- [ ] Public content is safe to publish.
- [ ] Documentation does not include private notes.

## Scope

This document is not a full production security audit.

It is a practical security guide for a public headless WordPress project using Next.js, JavaScript, and local development tooling.
