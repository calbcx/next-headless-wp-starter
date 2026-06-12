# Operations

This guide covers lightweight operational tasks for a deployed headless WordPress and Next.js setup.

It is intentionally practical. It is not a full enterprise runbook, monitoring plan, or compliance guide.

## Routine Checks

Periodically run the relevant checks from [`post-deployment-validation.md`](./post-deployment-validation.md), especially after provider maintenance, plugin updates, environment variable changes, or content migrations.

## Publishing Content

For a new Project entry:

1. Create the Project in WordPress.
2. Add title, excerpt, main content, and any relevant media.
3. Assign Technology terms.
4. Publish the Project.
5. Confirm the Project appears in the WPGraphQL IDE.
6. Confirm the frontend renders the Project after cache or revalidation delay.

If content does not appear, check whether the frontend host is serving cached static output and whether a rebuild or revalidation delay is expected.

## Updating Footer Profile Links

Footer profile links are managed in WordPress:

```txt
Projects -> Site Profile Settings
```

After updating a link:

- Confirm the value is saved in WordPress.
- Run the `projectContentSettings` GraphQL query.
- Confirm the frontend footer updates after cache or revalidation delay.

Do not hardcode personal URLs in the frontend unless they are intentional public placeholders.

## Updating WordPress Plugins

For `WPGraphQL` and other third-party plugins:

- Review the plugin update notes.
- Back up the WordPress site according to the host's process.
- Update in staging if available.
- For the single-host setup most users of this reference project will run, back up first and update during a low-traffic window.
- Confirm `/graphql` still responds.
- Confirm `/projects` still renders on the frontend.

For the custom `Project Content` plugin:

- Deploy the updated plugin files from `wordpress/plugins/project-content`.
- If the host supports SSH and WP-CLI, use [`wp-cli.md`](./wp-cli.md) to install and activate the packaged plugin.
- Confirm the plugin remains active.
- Confirm Projects and Technologies still appear in WordPress admin.
- Confirm custom GraphQL fields still resolve.

## Updating the Frontend

Before deploying frontend changes:

```bash
cd apps/web
npm run lint
npm run build
```

After deploying:

- Confirm the deployment used the `apps/web` app root.
- Confirm environment variables are still set.
- Confirm `/projects` and a known project detail route render.
- Review build and runtime logs for GraphQL errors.

## Backups

Backups are managed outside this repository.

At minimum, understand how the selected WordPress host backs up:

- Database content
- Uploaded media
- Plugin files
- WordPress configuration

The frontend can usually be redeployed from Git, but WordPress content cannot be recreated from this repository alone.

## Incident Notes

For a content outage:

- Check the frontend deployment status.
- Check the WordPress host status.
- Check `WORDPRESS_GRAPHQL_URL`.
- Check whether `/graphql` is blocked or returning errors.
- Check whether Project entries are published.

For a suspected secret exposure:

- Remove the secret from the current code.
- Rotate the credential.
- Review Git history and deployment logs.
- Follow the incident guidance in the root [`security.md`](../../security.md).

For a broken plugin update:

- Deactivate only the affected plugin if WordPress admin remains reachable.
- Restore the previous plugin files if the host supports file rollback.
- Review PHP error logs.
- Revalidate WPGraphQL and frontend routes after restoring service.

## Maintenance Boundaries

This repository does not define:

- A production monitoring stack
- Centralized logging
- Automated database backups
- Disaster recovery objectives
- Access control policy beyond practical WordPress security guidance

Those decisions should be made for the selected hosting environment before relying on the site for critical production use.
