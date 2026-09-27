# Project Content

Custom WordPress plugin for the project content model used by this headless WordPress starter.

The plugin registers:

- `project` custom post type
- `technology` taxonomy
- Site Profile Settings admin page
- WPGraphQL exposure for projects and technologies
- `projectContentSettings` WPGraphQL root field for footer profile URLs

WPGraphQL should be installed and active in WordPress for the GraphQL fields to be available at `/graphql`.
