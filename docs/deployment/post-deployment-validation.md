# Post-Deployment Validation

Use this guide after deploying the WordPress CMS, custom plugin, and Next.js frontend.

The goal is to prove the public frontend can read published WordPress content through WPGraphQL. This is a support checklist, not a full production acceptance test.

## Confirm WordPress

- Visit the WordPress home URL over HTTPS.
- Log in to WordPress admin.
- Confirm `WPGraphQL` is active.
- Confirm `Project Content` is active.
- Confirm `Projects` appears in the admin menu.
- Confirm at least one Project entry is published.
- Confirm Technology terms are assigned if the frontend should show `/technologies` data.
- Confirm footer profile links in `Projects` -> `Site Profile Settings` if the footer should render those links.

## Confirm WPGraphQL

Open the WPGraphQL IDE or send a POST request to:

```txt
https://<wordpress-host>/graphql
```

Run:

```graphql
query ValidateProjects {
  projects(first: 5) {
    nodes {
      title
      slug
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

If footer profile links are configured, run:

```graphql
query ValidateProjectContentSettings {
  projectContentSettings {
    cvUrl
    githubUrl
    linkedinUrl
    websiteUrl
  }
}
```

Expected result:

- The GraphQL request succeeds.
- Published projects appear in `projects.nodes`.
- `projectContentSettings` returns strings or empty values.
- Draft and private content does not appear in public frontend queries.

## Confirm Frontend Environment

In the frontend host settings, confirm:

```txt
WORDPRESS_GRAPHQL_URL=https://<wordpress-host>/graphql
NEXT_PUBLIC_SITE_URL=https://<frontend-host>
```

Check common mistakes:

- `WORDPRESS_GRAPHQL_URL` points to the frontend instead of WordPress.
- `WORDPRESS_GRAPHQL_URL` uses `http://` when the public CMS requires HTTPS.
- `WORDPRESS_GRAPHQL_URL` is missing `/graphql`.
- `NEXT_PUBLIC_SITE_URL` points to WordPress instead of the frontend.

## Confirm Public Routes

Visit:

```txt
https://<frontend-host>/
https://<frontend-host>/projects
https://<frontend-host>/technologies
https://<frontend-host>/writing
https://<frontend-host>/reference
```

For at least one published Project, visit:

```txt
https://<frontend-host>/projects/<project-slug>
```

Expected result:

- The frontend loads without a server error.
- `/projects` renders published Project entries.
- Project detail routes render by slug.
- `/technologies` renders assigned Technology terms or a graceful empty state.
- The footer renders only configured profile links.

## Check Build and Runtime Logs

Review frontend host logs for:

- Failed GraphQL requests.
- Missing environment variables.
- Build failures from the wrong app root.
- Next.js runtime compatibility issues.
- Unexpected empty API responses.

Review WordPress or host logs for:

- PHP fatal errors from plugin activation.
- Security rules blocking `/graphql`.
- SSL or redirect loops.
- Memory or timeout errors on GraphQL requests.

## Validate Cache Behavior

After publishing or editing a Project:

- Wait for the configured frontend revalidation interval.
- Refresh `/projects`.
- Refresh the affected `/projects/<project-slug>` page.
- Rebuild or redeploy the frontend if the host is serving a stale static build.

If content still does not appear, use [`troubleshooting.md`](./troubleshooting.md).
