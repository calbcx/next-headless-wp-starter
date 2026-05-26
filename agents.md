# Agent Instructions

## Purpose

This file provides engineering guidance for AI coding agents and contributors working in this repository.

The project is a public, developer-focused headless WordPress application with a Next.js frontend written in JavaScript.

Agents should prioritize clarity, maintainability, security, and professional presentation.

## Project Architecture

This project uses WordPress as the CMS and Next.js as the frontend.

Expected structure:

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

## Primary Responsibilities

### WordPress

WordPress is responsible for content management, the admin editing experience, example entries, technical writeups, posts or writing entries, technology taxonomies, and media management.

### Custom WordPress Plugin

The custom plugin is responsible for registering custom post types, registering custom taxonomies, exposing content to WPGraphQL, and keeping content-model-specific CMS functionality separate from themes.

### Next.js

Next.js is responsible for public frontend rendering, routing, layout, fetching WordPress content, presenting example entries and technical writeups, SEO metadata, and static or server-rendered pages where appropriate.

## General Rules

- Keep the project simple and professional.
- Use JavaScript for the frontend unless the project is intentionally migrated later.
- Prefer readable code over clever code.
- Do not add unnecessary dependencies.
- Do not commit secrets.
- Do not include private information.
- Do not introduce large architectural changes without updating documentation.
- Keep public-facing documentation developer-friendly and technically direct.
- Update `README.md` when setup steps change.
- Update `plan.md` when project phases change.
- Update `docs/architecture.md` when architecture decisions change.
- Update `security.md` when security assumptions change.

## WordPress Standards

### Custom Post Types

Custom post types should be registered in a plugin, not in a theme.

Use clear names such as `project` and `case_study`.

Recommended support for `project`:

```php
'supports' => [
    'title',
    'editor',
    'excerpt',
    'thumbnail',
    'revisions',
]
```

### REST API

REST compatibility is optional. If dual API support is needed later, custom post types intended for the frontend should use:

```php
'show_in_rest' => true
```

### WPGraphQL

Expose relevant post types and taxonomies with GraphQL names.

Example:

```php
'show_in_graphql' => true,
'graphql_single_name' => 'Project',
'graphql_plural_name' => 'Projects',
```

### Taxonomies

Use taxonomies for structured grouping such as Technology, Project type, and Skill area.

Technology taxonomy should be available in the admin and through WPGraphQL.

### Plugin Code

Plugin code should use a clear namespace or function prefix, avoid global function name collisions, register hooks explicitly, sanitize input, escape output, avoid direct database queries unless necessary, and avoid mixing display markup with content registration logic.

### Themes

Do not place core content model logic in a theme.

Themes may control presentation. Plugins should control CMS functionality.

## JavaScript Standards

Use modern JavaScript for frontend code.

Prefer:

- Clear function names
- Small modules
- Defensive API response handling
- JSDoc comments where helpful
- Consistent formatting
- Isolated data-fetching logic
- Simple object mapping between WordPress responses and frontend components

Avoid:

- Large components with mixed responsibilities
- Hardcoded WordPress GraphQL endpoint URLs
- Unclear object shapes
- Repeated fetch logic across pages
- Unnecessary state management libraries
- Adding TypeScript files unless the project is intentionally migrated

## Next.js Standards

### App Router

Use the Next.js App Router.

Expected frontend files should use JavaScript extensions:

```txt
layout.js
page.js
route.js
```

### Environment Variables

The WordPress GraphQL endpoint URL should come from environment variables.

Do not hardcode production URLs throughout the application.

Suggested variable names:

```txt
WORDPRESS_GRAPHQL_URL
NEXT_PUBLIC_SITE_URL
```

Only use `NEXT_PUBLIC_` for values that are safe to expose in the browser.

### API Layer

Keep WordPress fetching logic isolated.

Suggested location:

```txt
apps/web/lib/wordpress.js
```

or:

```txt
apps/web/src/lib/wordpress.js
```

Do not scatter WordPress fetch calls across unrelated components.

The WordPress helper module should build the GraphQL endpoint URL from environment variables, fetch published projects, fetch a single project by slug, normalize API responses into simple JavaScript objects, and handle empty or unexpected responses defensively.

### Components

Use reusable components for layout, header, footer, content cards, technology badges, technical sections, and page headings.

Suggested component files:

```txt
Header.js
Footer.js
PageHeader.js
ProjectCard.js
TechnologyBadge.js
```

### Routing

Suggested frontend routes:

```txt
/
 /projects
 /projects/[slug]
 /writing
 /writing/[slug]
 /technologies
 /reference
```

### Styling

Use a simple styling approach such as plain CSS, CSS modules, or Tailwind CSS if intentionally added.

Avoid heavy UI frameworks unless there is a clear reason.

### Metadata

Pages should include appropriate metadata, including page title, description, Open Graph title, and Open Graph description.

## Documentation Standards

Documentation should be written for another developer or contributor.

When the project includes case studies or technical writeups, describe them in implementation terms rather than promotional language.

Documentation should explain what the project is, why the architecture was chosen, how to run the project locally, how content flows from WordPress to Next.js, how to deploy the frontend and CMS, what security assumptions exist, and why JavaScript was chosen for the frontend.

## Security Standards

- Never commit `.env` files.
- Commit `.env.example` files only.
- Never commit credentials.
- Never commit production database exports.
- Never expose private information.
- Never include real passwords in examples.
- Avoid unsafe WordPress coding patterns.
- Sanitize input.
- Escape output.
- Validate external API responses.
- Avoid exposing draft or private WordPress content publicly.

## Git Standards

Use focused commits.

Good commit examples:

```txt
Add Docker Compose WordPress environment
Register Project custom post type
Add Next.js JavaScript project listing page
Document headless architecture
Add security policy
```

Avoid vague commits such as `Update stuff`, `Fix things`, or `More changes`.

## Pull Request Standards

Each pull request should include a summary, what changed, how it was tested, screenshots if UI changed, and documentation updates if needed.

## Testing and Validation

For the frontend:

```bash
npm run lint
npm run build
```

For Docker:

```bash
docker compose up
```

For WordPress plugin changes:

- Confirm the plugin activates.
- Confirm the Projects admin menu appears.
- Confirm project content can be created.
- Confirm project content is available through the selected API.

## Do Not Do

Do not add secrets, private names or organization details without approval, unrelated business notes, unnecessary packages, or complex infrastructure before the basic application works.

Do not move CMS functionality into the frontend. Do not move frontend presentation logic into the WordPress plugin. Do not convert the frontend to TypeScript unless explicitly requested.

## Agent Behavior

When working on this repository:

1. Read `README.md`, `plan.md`, `agents.md`, `security.md`, and `docs/architecture.md`.
2. Identify the current project phase.
3. Make the smallest useful change.
4. Keep code organized.
5. Use JavaScript for frontend code.
6. Update documentation when behavior changes.
7. Prefer a working simple implementation over an incomplete complex one.
8. Explain tradeoffs in documentation when relevant.

## Project Tone

This is a developer-focused reference project built around a project and case-study content model.

The code and documentation should communicate practical engineering judgment, modern WordPress knowledge, React and Next.js competence, JavaScript competence, maintainable architecture, security awareness, and clear communication.
