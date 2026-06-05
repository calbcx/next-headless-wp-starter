# Project Plan

## Project Goal

Build a developer-friendly headless WordPress reference application that uses WordPress as a content management system and Next.js as the frontend.

The project is intended to demonstrate practical modern WordPress development, React/Next.js frontend development with JavaScript, content modeling, WPGraphQL-based architecture, local development setup, and production-oriented documentation.

## Intended Audience

This project is written for developers exploring headless WordPress patterns, contributors extending the codebase, and teams evaluating practical CMS and frontend integration patterns.

## Project Summary

This repository contains a headless WordPress application built around an example-driven content model.

WordPress manages example entries, technical writeups, posts, and technology categories. The frontend is built with Next.js and JavaScript and consumes WordPress content through WPGraphQL.

The project is intentionally structured as a clear engineering reference, with the content model serving as a practical use case rather than the main reason the repository exists.

## Current Status

The repository foundation, Docker-based local WordPress environment, custom `project-content` plugin, and initial Next.js frontend foundation are in place.

The local integration flow has been validated:

```txt
WordPress Project content
    |
    v
WPGraphQL
    |
    v
apps/web/lib/wordpress.js
    |
    v
Next.js project listing and detail pages
```

Validated local checks:

- `docker compose up -d` runs WordPress and MySQL locally.
- WordPress is reachable at `http://localhost:8080`.
- WPGraphQL returns JSON from `http://localhost:8080/graphql`.
- The custom `Project` post type and `Technology` taxonomy are exposed through WPGraphQL.
- `apps/web` runs with `npm run dev`.
- `npm run lint` passes.
- `npm run build` passes.
- A WordPress-managed project renders in the Next.js frontend when `apps/web/.env.local` points to the local GraphQL endpoint.

## Core Goals

- Use WordPress as a CMS.
- Use Next.js and React as the public-facing frontend.
- Use JavaScript for the frontend application.
- Use a custom WordPress plugin for example and case-study content types.
- Keep content modeling separate from frontend presentation.
- Provide a local development setup using Docker.
- Document architecture, security considerations, and deployment steps.
- Keep the codebase understandable and extendable for another developer.

## Non-Goals

- Do not build a page-builder-driven marketing site.
- Do not add unnecessary dependencies.
- Do not force TypeScript into the first version.
- Do not overcomplicate the first version with Kubernetes, Terraform, or complex cloud infrastructure.
- Do not store secrets in the repository.
- Do not mix WordPress plugin logic into the Next.js frontend.

## Suggested Repository Structure

```txt
nextjs-headless-wordpress/
  apps/
    web/
  wordpress/
    plugins/
      project-content/
  docs/
    architecture.md
  agents.md
  plan.md
  security.md
  README.md
  docker-compose.yml
```

## Phase 1: Repository Foundation

Status: Complete.

### Goal

Create a clean project foundation that can run locally and be understood by another developer.

### Tasks

- Create the repository structure.
- Add a root `README.md`.
- Add `plan.md`.
- Add `agents.md`.
- Add `security.md`.
- Add `docs/architecture.md`.
- Add a Docker Compose setup for WordPress and MySQL.
- Add an `apps/web` directory for the Next.js JavaScript frontend.
- Add a `wordpress/plugins` directory for custom WordPress plugin code.
- Add `.gitignore`.
- Add `.env.example` files where needed.

### Acceptance Criteria

- The repository has a clear folder structure.
- A developer can understand the project purpose from the README.
- The project plan and engineering standards are documented.
- Local environment variables are documented without exposing secrets.

### Definition of Done

- Initial project files are committed.
- Documentation exists for setup direction, architecture, and security expectations.
- The repo is safe to make public.

## Phase 2: Local WordPress Environment

Status: Complete for local development.

### Goal

Run WordPress and MySQL locally using Docker.

### Tasks

- Configure `docker-compose.yml`.
- Add WordPress service.
- Add MySQL service.
- Add persistent database volume.
- Mount local custom plugin directory into WordPress.
- Document local WordPress setup.
- Confirm WordPress admin can be reached locally.

### Acceptance Criteria

- WordPress runs locally.
- MySQL runs locally.
- The WordPress admin is available.
- Custom plugin files can be edited from the repository and loaded by WordPress.
- Local setup instructions are documented.

### Definition of Done

- `docker compose up` starts the WordPress environment.
- WordPress can be installed locally.
- The custom plugin directory appears in the WordPress plugins screen.

## Phase 3: Custom WordPress Content Plugin

Status: Complete for the initial `Project` and `Technology` model.

### Goal

Create a custom WordPress plugin that defines example-oriented content in a reusable way.

### Plugin Name

`project-content`

### Tasks

- Register a `Project` custom post type.
- Register a `Technology` taxonomy.
- Make the custom post type visible in the WordPress admin.
- Expose the custom post type through WPGraphQL.
- Expose the taxonomy through WPGraphQL.
- Add support for title, editor, excerpt, thumbnail, and revisions.
- Keep plugin code organized and readable.
- Add inline comments for important WordPress hooks.

### Acceptance Criteria

- The WordPress admin contains a Projects section.
- Projects can be created, edited, and published.
- Technologies can be assigned to projects.
- Project content is exposed through WPGraphQL.
- The plugin does not depend on the active theme.

### Definition of Done

- The custom plugin can be activated from the WordPress admin.
- Project content can be created and retrieved through the WPGraphQL endpoint.
- The plugin code follows WordPress conventions.

## Phase 4: Next.js JavaScript Frontend Foundation

Status: Complete for the initial public routes and WordPress project integration.

### Goal

Create a modern frontend application that consumes WordPress content.

### Tasks

- Initialize a Next.js app in `apps/web`.
- Use JavaScript, not TypeScript.
- Use the App Router.
- Add basic layout components.
- Add environment variable support for the WordPress GraphQL endpoint URL.
- Add a homepage.
- Add a projects index page.
- Add a project detail page.
- Add basic metadata handling.
- Add simple styling using CSS modules, plain CSS, or another minimal styling approach.
- Keep WordPress fetch logic isolated in a helper module.

### Acceptance Criteria

- The frontend runs locally.
- The homepage renders successfully.
- The projects page fetches content from WordPress.
- Individual project pages render by slug.
- GraphQL endpoint configuration is handled through environment variables.
- JavaScript files use clear names and readable structure.

### Definition of Done

- `apps/web` can run locally.
- WordPress-managed project content appears on the frontend.
- The frontend has a simple, professional design.
- The frontend uses JavaScript consistently.

## Phase 5: Local Content Validation

Status: Complete for local validation.

### Goal

Use locally managed WordPress content to validate the data model and main frontend routes without committing sample content to the repository.

### Suggested Pages

- Home
- Projects
- Project detail
- Technologies
- Writing
- Reference

### Suggested Entry Format

Each technical entry should include overview, problem, constraints, technical approach, stack, implementation details, result, lessons learned, and future improvements.

### Acceptance Criteria

- The local WordPress site includes enough published content to validate list and detail views.
- Entries are presented as engineering work, not only screenshots.
- Technical writeups describe real decision-making.
- Content is appropriate for public viewing.
- Sample content is managed in WordPress and is not committed to the repository.

### Definition of Done

- At least three Project entries are published locally in WordPress.
- Project entries render on `/projects` and `/projects/[slug]`.
- Technology terms render on `/technologies` when assigned.
- The repository remains free of database exports, media uploads, and sample content fixtures.

## Phase 6: Quality Checks

Status: Complete for initial public repository checks.

### Goal

Add basic quality controls suitable for a public engineering repository.

### Tasks

- Add frontend linting.
- Add frontend build command.
- Add GitHub Actions workflow for the frontend build.
- Add documentation review.
- Add security review of public files.
- Confirm no secrets are committed.

### Acceptance Criteria

- The frontend build passes locally.
- GitHub Actions runs on pull requests or pushes.
- Public documentation does not include private information.
- `.env` files are excluded from Git.

### Definition of Done

- The repo has a basic CI check.
- Documentation is accurate enough for another developer to follow.
- The repo is ready to share publicly.

## Phase 7: Deployment

Status: Ready to begin.

### Goal

Deploy the project in a practical, maintainable way.

### Recommended Deployment Direction

- WordPress CMS hosted on managed WordPress hosting, cPanel hosting, a VPS, AWS, or another WordPress-capable host.
- Next.js frontend deployed to Vercel, Netlify, AWS, or another Node.js-capable frontend host.
- Environment variables configured in the hosting provider.
- WordPress admin protected with strong credentials and two-factor authentication where available.

cPanel is a good candidate for WordPress hosting. It should only be considered for the Next.js frontend when the account supports Node.js applications through Application Manager or an equivalent runtime. Static exports are easier to host on cPanel than server-rendered Next.js routes.

Deployment option guides are available in `docs/deployment/`.

Required production configuration:

```txt
WORDPRESS_GRAPHQL_URL=<wordpress-graphql-url>
NEXT_PUBLIC_SITE_URL=<public-frontend-url>
```

Do not commit production `.env` files or provider secrets.

### Acceptance Criteria

- The frontend is publicly accessible.
- The frontend can fetch published WordPress content.
- WordPress admin is not exposed unnecessarily beyond normal login access.
- Deployment steps are selected from the matching guide in `docs/deployment/`.

### Definition of Done

- A live URL exists.
- The live frontend renders WordPress-managed content.
- Deployment notes are committed to the repository without secrets.

## Future Improvements

- Add WPGraphQL code generation if the project later adopts TypeScript.
- Add preview mode for unpublished WordPress content.
- Add image optimization.
- Add sitemap generation.
- Add RSS feed for writing.
- Add search.
- Add project filtering by technology.
- Add automated accessibility checks.
- Add Playwright smoke tests.
- Add deeper provider-specific deployment automation notes after a real deployment path is selected.
- Consider TypeScript later if it becomes useful.

## Public Repository Notes

This repository is intended to be public.

Do not commit API keys, passwords, private information, private business details, production database exports, notes unrelated to the repository, or sensitive materials.

Keep all documentation technical, contributor-friendly, and focused on implementation details.
