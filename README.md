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

## Stack

- WordPress
- MySQL
- PHP
- Custom WordPress plugin
- Next.js
- React
- JavaScript
- Docker
- WPGraphQL

## Project Structure

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

## Frontend Structure

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
- Next.js running from `apps/web`

Expected local URLs:

```txt
WordPress: http://localhost:8080
Next.js:   http://localhost:3000
```

Docker Compose binds WordPress to `127.0.0.1:8080` for local development so it is not exposed on the wider network by default.

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

4. Install and activate `WPGraphQL` in WordPress.

5. Develop custom plugins locally in `./wordpress/plugins`.

The Docker Compose setup mounts `./wordpress/plugins` into the container at `/var/www/html/wp-content/plugins`, so local plugin changes are available inside WordPress immediately.

### WordPress Plugin Dependencies

`WPGraphQL` is a third-party WordPress plugin required for this project's frontend GraphQL integration. It is not bundled in this repository. Install and activate it through WordPress admin or through the plugin management process for the target WordPress environment.

The repository includes only the custom `project-content` plugin. Third-party WordPress plugins are managed outside the repo so they can be updated through normal WordPress maintenance workflows.

### Frontend Setup

The Next.js app lives in `apps/web`. Copy the frontend environment example before running the app locally:

```bash
cp apps/web/.env.example apps/web/.env.local
```

The expected local configuration is:

```txt
WORDPRESS_GRAPHQL_URL=http://localhost:8080/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Install dependencies and start the frontend:

```bash
cd apps/web
npm install
npm run dev
```

Run validation before committing frontend changes:

```bash
npm run lint
npm run build
```

The frontend can build without `WORDPRESS_GRAPHQL_URL` configured. In that case, WordPress-backed sections render empty states until WPGraphQL is running and `apps/web/.env.local` is configured.

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

Repository foundation, local WordPress environment, custom content plugin, and initial Next.js frontend foundation are scaffolded.
