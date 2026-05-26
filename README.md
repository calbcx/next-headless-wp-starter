# Next.js Headless WordPress

A developer-focused headless WordPress reference project using WordPress as a content management system and Next.js as the public frontend.

This repository demonstrates modern WordPress development, custom content modeling, WPGraphQL-powered frontend integration, React and Next.js frontend development with JavaScript, local development workflow, and production-oriented documentation.

## Project Goals

- Use WordPress as a CMS.
- Use Next.js and React as the frontend.
- Use JavaScript for the frontend application.
- Use a custom WordPress plugin for example and case-study content types.
- Keep CMS functionality separate from frontend presentation.
- Provide a local development setup that another developer can run and extend.
- Document architecture and security decisions clearly.

## Planned Stack

- WordPress
- MySQL
- PHP
- Custom WordPress plugin
- Next.js
- React
- JavaScript
- Docker
- WPGraphQL

## Planned Structure

```txt
apps/
  web/
wordpress/
  plugins/
    project-content/
docs/
  architecture.md
plan.md
agents.md
security.md
README.md
docker-compose.yml
```

## Expected Frontend Structure

```txt
apps/
  web/
    app/
      layout.js
      page.js
      globals.css
      projects/
        page.js
        [slug]/
          page.js
      technologies/
        page.js
      writing/
        page.js
      reference/
        page.js
    components/
      Header.js
      Footer.js
      PageHeader.js
      ProjectCard.js
      TechnologyBadge.js
    lib/
      wordpress.js
    public/
    .env.example
    jsconfig.json
    next.config.mjs
    package.json
```

## Local Development

Local development uses:

- WordPress running in Docker
- MySQL running in Docker
- Next.js running from `apps/web` once the frontend is scaffolded

Expected local URLs:

```txt
WordPress: http://localhost:8080
Next.js:   http://localhost:3000
```

### Setup

1. Copy the root environment example:

   ```bash
   cp .env.example .env
   ```

2. Start WordPress and MySQL:

   ```bash
   docker compose up -d
   ```

3. Open WordPress at `http://localhost:8080` and complete the install flow.

4. Install and activate `WPGraphQL` in WordPress if you want the future frontend to use the documented GraphQL endpoint.

5. Develop custom plugins locally in `./wordpress/plugins`.

The Docker Compose setup mounts `./wordpress/plugins` into the container at `/var/www/html/wp-content/plugins`, so local plugin changes are available inside WordPress immediately.

### Frontend Environment

The Next.js app is not scaffolded yet, but a frontend env example is included at `apps/web/.env.example` for the expected local URL configuration:

```txt
WORDPRESS_GRAPHQL_URL=http://localhost:8080/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Once `apps/web` exists, copy it to `apps/web/.env.local` before running the frontend locally.

### Stop Services

```bash
docker compose down
```

## Documentation

- [`plan.md`](./plan.md): project phases, goals, and acceptance criteria
- [`agents.md`](./agents.md): engineering standards for AI agents and contributors
- [`security.md`](./security.md): security expectations for the public repository
- [`docs/architecture.md`](./docs/architecture.md): architecture overview and decisions

## Repository Safety

This repository is intended to be public.

Do not commit `.env` files, API keys, passwords, production database exports, private information, sensitive screenshots, or notes unrelated to the repository.

Use `.env.example` files for placeholder configuration only.

## Project Status

Repository foundation and local WordPress environment scaffolded.
