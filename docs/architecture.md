# Architecture

## Overview

This project is a headless WordPress reference application built around an example-driven content model.

WordPress is used as the content management system. Next.js is used as the public frontend. The frontend uses JavaScript.

The goal is to document a practical architecture that separates content management from frontend presentation and keeps both sides easy to evolve independently.

## High-Level Architecture

```txt
Editor / Admin
    |
    v
WordPress CMS
    |
    v
WPGraphQL endpoint
    |
    v
Next.js Frontend
    |
    v
Visitors / Readers
```

## Main Components

### WordPress CMS

WordPress manages structured content.

Responsibilities:

- Admin editing interface
- Example entry content
- Technical writeup content
- Blog or writing content
- Technology taxonomy
- Media uploads
- Content publishing workflow

WordPress is not responsible for rendering the public frontend in the headless version of this project.

### Custom WordPress Plugin

The custom plugin contains content-model-specific CMS functionality.

Location:

```txt
wordpress/plugins/project-content/
```

Responsibilities:

- Register custom post types.
- Register custom taxonomies.
- Register small project-specific admin settings.
- Expose content to the API layer.
- Keep content modeling separate from presentation.

Initial content types:

- Project

Potential future content types:

- Case Study
- Skill
- Testimonial

Initial taxonomy:

- Technology

Potential future taxonomies:

- Project Type
- Skill Area

### Next.js Frontend

The frontend lives in:

```txt
apps/web/
```

Responsibilities:

- Public site rendering
- Page routing
- Fetching WordPress content
- Rendering example entries and technical content
- SEO metadata
- Responsive layout
- Frontend build and deployment

The frontend should use JavaScript files such as:

```txt
layout.js
page.js
wordpress.js
ProjectCard.js
```

Implemented initial routes:

```txt
/
 /projects
 /projects/[slug]
 /technologies
 /writing
 /reference
```

The initial frontend keeps WordPress data access in:

```txt
apps/web/lib/wordpress.js
```

That module reads `WORDPRESS_GRAPHQL_URL`, performs GraphQL requests, and normalizes WordPress project and technology data into simple JavaScript objects before passing it to components. An unconfigured endpoint produces empty WordPress-backed sections for local setup and CI, while a configured endpoint that cannot be reached or returns GraphQL errors raises a typed fetch error so builds and routes fail visibly. Logged WordPress request errors redact URL credentials, query strings, and hash fragments.

## Data Flow

### Project Content Flow

```txt
WordPress Admin
    |
    v
Project Custom Post Type
    |
    v
WPGraphQL endpoint
    |
    v
Next.js Fetching Layer
    |
    v
Project Pages
```

The local flow has been validated with a published WordPress `Project` entry and associated `Technology` terms. WPGraphQL returns the custom content model, and the Next.js frontend renders the project listing and detail route from the normalized GraphQL response.

### Site Profile Settings Flow

```txt
WordPress Admin
    |
    v
Project Content plugin options
    |
    v
projectContentSettings WPGraphQL root field
    |
    v
apps/web/lib/wordpress.js
    |
    v
Next.js Footer
```

The Project Content plugin provides a small `Site Profile Settings` admin page under the Projects menu. Administrators can manage the public CV, GitHub, LinkedIn, and personal website URLs there instead of hardcoding profile links in the frontend. The plugin stores those values as WordPress options, sanitizes them as HTTP(S) URLs, exposes them through WPGraphQL, and the Next.js footer renders only the links that are configured.

## API Strategy

This project uses WPGraphQL as the primary API layer between WordPress and Next.js.

Reasons for choosing WPGraphQL:

- Precise queries for structured content
- Cleaner frontend data fetching for list and detail routes
- Better fit for related content, filtering, and taxonomy data
- A consistent contract between the WordPress content model and the frontend

Tradeoffs:

- Adds a plugin dependency
- Requires GraphQL-specific configuration for custom content types
- Adds another concept to local setup and deployment

WPGraphQL is a required runtime dependency for the GraphQL integration, but it is not bundled in this repository. The custom `project-content` plugin is kept in source control because it defines project-specific content structure. Third-party WordPress plugins should be installed and updated through WordPress admin or the deployment environment's plugin management process.

## JavaScript Frontend Approach

The frontend should use modern JavaScript with clear structure.

Recommended practices:

- Keep API calls in `apps/web/lib/wordpress.js`.
- Normalize WordPress API responses before passing data to components.
- Keep components small and reusable.
- Use JSDoc comments where they improve clarity.
- Avoid unnecessary frontend dependencies.
- Avoid converting the project to TypeScript unless it is intentionally planned later.

## Content Model

### Project

The `Project` custom post type represents implementation examples or case-study style work.

Suggested fields:

- Title
- Slug
- Summary
- Main content
- Featured image
- Technology terms
- GitHub URL
- Live URL
- Role
- Problem
- Solution
- Outcome

Initial WordPress support:

```txt
title
editor
excerpt
thumbnail
revisions
```

### Technology

The `Technology` taxonomy groups projects by tools or skills.

Examples:

- WordPress
- PHP
- Next.js
- React
- JavaScript
- Docker
- MySQL
- AWS
- WPGraphQL

## Local Development Architecture

The local environment uses Docker for WordPress and MySQL.

Services:

```txt
wordpress
mysql
```

The Next.js app can run either directly on the host machine with `npm run dev` or inside Docker in a future phase.

Recommended first version:

```txt
WordPress + MySQL in Docker
Next.js running locally on the host machine
```

This keeps the setup simple while still demonstrating practical local infrastructure. The WordPress container pins the Docker Official Image `wordpress:7.1.2-php8.3-apache` for a reproducible local baseline on PHP 8.3. The image pin should be reviewed when WordPress security or maintenance releases ship. Existing WordPress files can persist in the container's data volume, so an image update must be followed by verification of the installed core version; see the local update instructions in `README.md`.

The WordPress container publishes HTTP on `127.0.0.1:8080`, keeping the local CMS bound to the developer machine by default.

MySQL uses the Docker Official Image `mysql:8.4` and the `mysql84_data` named
volume. The tag tracks patch releases within the 8.4 LTS series. New accounts use
`caching_sha2_password`, and WordPress waits for MySQL's TCP health check before
starting. Database ports are available only on the Docker network.

Existing MySQL 8.0 installations need a logical export/import into the new volume.
The former `mysql_data` volume remains available for rollback until it is
explicitly removed. See [the local MySQL upgrade guide](./local-mysql-upgrade.md).

## Suggested Local URLs

```txt
WordPress: http://localhost:8080
Next.js:   http://localhost:3000
```

## Environment Variables

### WordPress

Example variables:

```txt
WORDPRESS_DB_HOST
WORDPRESS_DB_NAME
WORDPRESS_DB_USER
WORDPRESS_DB_PASSWORD
```

### Next.js

Example variables:

```txt
WORDPRESS_GRAPHQL_URL
NEXT_PUBLIC_SITE_URL
```

Do not commit real `.env` files.

Commit `.env.example` files instead.

For local integration, `apps/web/.env.local` should define:

```txt
WORDPRESS_GRAPHQL_URL=http://localhost:8080/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`apps/web/.env.local` is intentionally ignored by git.

## Local Validation

Current local validation commands:

```bash
docker compose up -d
cd apps/web
npm run lint
npm run build
npm run dev
```

Validated behavior:

- WordPress and MySQL start through Docker Compose.
- WordPress is reachable at `http://localhost:8080`.
- WPGraphQL is reachable at `http://localhost:8080/graphql`.
- The `Project` custom post type and `Technology` taxonomy are exposed through WPGraphQL.
- The Next.js frontend renders WordPress-managed project content when `WORDPRESS_GRAPHQL_URL` is configured.

Sample content is not committed to the repository. Local validation content lives in the developer's WordPress database and should not be exported into source control.

## Deployment Architecture

Recommended deployment approach:

```txt
WordPress CMS: managed WordPress hosting, cPanel hosting, a VPS, AWS, or another WordPress-capable host
Next.js frontend: Vercel, Netlify, AWS, or another Node.js-capable frontend host
Database: MySQL managed by the WordPress host or database provider
```

cPanel can host the WordPress side of the architecture well. It can host the Next.js side only when the account provides Node.js application support, environment variable configuration, dependency installation, and a compatible startup/runtime model. Static Next.js output is easier to place on traditional cPanel hosting than a server-rendered App Router deployment.

A production deployment must configure `WORDPRESS_GRAPHQL_URL` in the frontend host to point to the production WordPress GraphQL endpoint and `NEXT_PUBLIC_SITE_URL` to the public frontend URL.

Production environment values:

```txt
WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
NEXT_PUBLIC_SITE_URL=<public-frontend-url>
```

Production environment files, credentials, database exports, backups, and uploaded media should remain outside the repository.

Detailed deployment options live in `docs/deployment/`. Those guides cover cPanel WordPress with Vercel or AWS Amplify frontends, and AWS Lightsail WordPress with Vercel or AWS Amplify frontends.

## Production Flow

```txt
Content Editor
    |
    v
Production WordPress CMS
    |
    | HTTPS API request
    v
Production Next.js Frontend
    |
    v
Visitor
```

## Deployment Considerations

### WordPress

- Use HTTPS.
- Use strong admin credentials.
- Use two-factor authentication where available.
- Keep WordPress core, plugins, and themes updated.
- Limit installed plugins.
- Disable unused themes and plugins.
- Install and maintain WPGraphQL as a required runtime dependency rather than vendoring it in this repository.
- Avoid exposing private or draft content through frontend queries.

### Next.js

- Store GraphQL endpoint URLs in environment variables.
- Configure production build command.
- Configure metadata.
- Avoid leaking server-only environment variables to the browser.
- Use `NEXT_PUBLIC_` only for values that are safe to expose.

## Security Boundaries

### WordPress Admin

The WordPress admin is private and used for content management.

### Public API

The public GraphQL API should expose only published content required by the frontend.

### Next.js Frontend

The frontend is public and should not contain secrets.

## Repository Boundaries

The repository may contain source code, local development config, documentation, example environment files, and public-safe placeholder content.

The repository should not contain passwords, API keys, private data, production database dumps, private business notes, or sensitive documents.

## Architecture Decisions

### Decision: Use a Custom Plugin for Content Types

Custom post types and taxonomies belong in a plugin because they define content structure.

This keeps the content model available even if the theme or frontend changes.

### Decision: Use Next.js for the Frontend

Next.js provides a modern React-based frontend with routing, metadata support, static rendering, and deployment options.

This keeps the frontend implementation separate from WordPress theme concerns while still fitting a content-driven site.

### Decision: Use JavaScript for the First Version

The first version uses JavaScript because it reduces initial complexity and matches the repository's current frontend constraints.

TypeScript can be considered later, but it is not required for the first version.

### Decision: Keep First Version Simple

The first version should prioritize a working local development setup, a custom content model, and a frontend that renders WordPress content.

Advanced infrastructure can be added later.

## Future Architecture Improvements

Possible future improvements:

- Shared GraphQL query fragments
- Preview mode for draft content
- Revalidation webhooks from WordPress to Next.js
- Automated frontend tests
- Accessibility checks
- Image optimization strategy
- Deeper provider-specific deployment automation notes after a real deployment path is selected
- Optional TypeScript migration if useful later
