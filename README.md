# Next.js Headless WordPress

A developer-focused headless WordPress reference project using WordPress as the CMS and Next.js as the public frontend.

This repository is intended to demonstrate practical WordPress content modeling, WPGraphQL-based data access, React and Next.js frontend development with JavaScript, local development workflow, and deployment-aware documentation.

## Project Goals

- Use WordPress as a CMS.
- Use Next.js and React as the frontend.
- Use JavaScript for the frontend application.
- Use a custom WordPress plugin for example and case-study content types.
- Use WPGraphQL as the primary API layer between WordPress and Next.js.
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
.github/
  workflows/
    web.yml
apps/
  web/
wordpress/
  plugins/
    project-content/
docs/
  architecture.md
  deployment/
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
    package-lock.json
    package.json
```

## Local Development

Local development uses:

- WordPress running in Docker
- MySQL running in Docker
- Next.js running from `apps/web`

Requirements:

- Docker Compose
- Node.js and npm

Expected local URLs:

```txt
WordPress: http://localhost:8080
Next.js:   http://localhost:3000
```

Docker Compose binds WordPress to `127.0.0.1:8080` for local development so it is not exposed on the wider network by default.

### Setup

1. Copy the root Docker environment example:

   ```bash
   cp .env.example .env
   ```

2. Start WordPress and MySQL:

   ```bash
   docker compose up -d
   ```

3. Open `http://localhost:8080` and complete the WordPress install flow.

4. In WordPress, install and activate `WPGraphQL`.

5. In WordPress, activate the `Project Content` plugin.

6. Create and publish at least one Project entry in WordPress. Assign
   Technology terms if you want them to appear on the frontend.

7. Optional: manage footer profile links in WordPress under
   `Projects` -> `Site Profile Settings`. The custom plugin stores the CV,
   GitHub, LinkedIn, and personal website URLs as WordPress options and exposes
   them through the `projectContentSettings` WPGraphQL field.

The Docker Compose setup mounts `./wordpress/plugins` into the container at `/var/www/html/wp-content/plugins`, so the `Project Content` plugin is available to activate from the WordPress plugins screen.

Local changes to `wordpress/plugins/project-content` are available inside WordPress immediately.

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

Install dependencies and start the frontend from `apps/web`:

```bash
cd apps/web
npm install
npm run dev
```

With the default Next.js dev server, the frontend is available at `http://localhost:3000`.

Run validation from `apps/web` before committing frontend changes:

```bash
npm run lint
npm run build
```

The frontend can build without `WORDPRESS_GRAPHQL_URL` configured. In that case, WordPress-backed sections render empty states until WPGraphQL is running and `apps/web/.env.local` is configured.

### Continuous Integration

This repository includes a GitHub Actions workflow for the frontend lint and build checks from `apps/web` on pushes to `main` and on pull requests:

```bash
npm ci
npm run lint
npm run build
```

### Confirm WordPress Data

Open the WPGraphQL IDE in WordPress and run this query to confirm Project data is available:

```graphql
query GetProjectsForFrontend {
  projects(first: 10) {
    nodes {
      title
      slug
      excerpt
      content
      technologies {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

Run this query to confirm footer profile settings are available:

```graphql
query GetProjectContentSettings {
  projectContentSettings {
    cvUrl
    githubUrl
    linkedinUrl
    websiteUrl
  }
}
```

### Stop Services

```bash
docker compose down
```

## Deployment

Deployment is intentionally provider-neutral. The deployment docs are the source of truth for deployment options and environment variables.

Possible deployment targets include:

- WordPress CMS: managed WordPress hosting, cPanel hosting, a VPS, AWS, or another WordPress-capable host.
- Next.js frontend: Vercel, Netlify, AWS, or another Node.js-capable frontend host.

cPanel is listed as one possible WordPress CMS host. Hosting the Next.js frontend on cPanel depends on whether the account supports Node.js applications; static output is generally simpler there than server-rendered Next.js routes.

Production requirements:

- Install and activate `WPGraphQL` on the WordPress host.
- Deploy and activate the custom `Project Content` plugin from `wordpress/plugins/project-content`.
- Publish Project entries and Technology terms in WordPress.
- Configure the frontend host with `WORDPRESS_GRAPHQL_URL` pointing to the production GraphQL endpoint.
- Configure `NEXT_PUBLIC_SITE_URL` with the public frontend URL.
- Keep production `.env` files, credentials, database exports, and backups out of the repository.

Production environment values:

```txt
WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
NEXT_PUBLIC_SITE_URL=<public-frontend-url>
```

Start with [`docs/deployment/overview.md`](./docs/deployment/overview.md), then use the guide that matches the selected WordPress and frontend hosts.

## Documentation

- [`plan.md`](./plan.md): project phases, goals, and acceptance criteria
- [`agents.md`](./agents.md): engineering standards for AI agents and contributors
- [`security.md`](./security.md): security expectations for the public repository
- [`docs/architecture.md`](./docs/architecture.md): architecture overview and decisions
- [`docs/deployment/overview.md`](./docs/deployment/overview.md): deployment options and shared checklist
- [`docs/deployment/environment-variables.md`](./docs/deployment/environment-variables.md): production environment variable contract
- [`docs/deployment/cpanel-wordpress-vercel-frontend.md`](./docs/deployment/cpanel-wordpress-vercel-frontend.md): cPanel WordPress with Vercel frontend
- [`docs/deployment/cpanel-wordpress-aws-amplify-frontend.md`](./docs/deployment/cpanel-wordpress-aws-amplify-frontend.md): cPanel WordPress with AWS Amplify frontend
- [`docs/deployment/aws-lightsail-wordpress-vercel-frontend.md`](./docs/deployment/aws-lightsail-wordpress-vercel-frontend.md): AWS Lightsail WordPress with Vercel frontend
- [`docs/deployment/aws-lightsail-wordpress-aws-amplify-frontend.md`](./docs/deployment/aws-lightsail-wordpress-aws-amplify-frontend.md): AWS Lightsail WordPress with AWS Amplify frontend
- [`docs/deployment/troubleshooting.md`](./docs/deployment/troubleshooting.md): common deployment issues

## Repository Safety

This repository is intended to be public.

Do not commit `.env` files, API keys, passwords, production database exports, private information, sensitive screenshots, or notes unrelated to the repository.

Use `.env.example` files for placeholder configuration only.

## Project Status

The repository contains the local Docker WordPress environment, the custom `project-content` plugin, the JavaScript Next.js frontend, WordPress data-fetching helpers, public routes for projects and technologies, documentation, and an initial frontend CI workflow. Local WordPress content is not committed. Deployment remains the next project phase.
