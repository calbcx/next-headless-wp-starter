# Local MySQL 8.0 to 8.4 Upgrade

This guide covers the local Docker setup. MySQL 8.4 uses `mysql84_data` so the
previous `mysql_data` volume can be retained for rollback. A fresh checkout needs
no migration; use the normal README setup instructions.

Run these commands from the repository root. Use the same Compose project name
and root `.env` throughout. Keep the database export and temporary Compose files
outside Git. Do not use `docker compose down -v` during this process.

## Export Existing Content

Do this while the MySQL 8.0 configuration is still checked out and the old database
is running. Stop WordPress to prevent content changes during the migration.

```bash
umask 077
mysql_backup_dir=$(mktemp -d "${TMPDIR:-/tmp}/wordpress-mysql-upgrade.XXXXXX")
cp docker-compose.yml "$mysql_backup_dir/compose-mysql80.yml"
docker compose stop wordpress
docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -uroot --single-transaction --routines --events --triggers --no-tablespaces --set-gtid-purged=OFF --databases "$MYSQL_DATABASE"' \
  > "$mysql_backup_dir/wordpress.sql"
```

Continue only if the export command succeeds and the export file is nonempty.
Record the backup directory so it can be found if the shell session closes.
The export includes only the application database, not MySQL's system accounts.

## Import into MySQL 8.4

Check out the updated configuration that uses `mysql:8.4` and `mysql84_data`.
Keep the same database name, username, and passwords in `.env`; the new image
creates database accounts with `caching_sha2_password`.

These steps assume `mysql84_data` is new and contains no content you need to keep.
If it already contains a WordPress database, stop and preserve that data before
importing, because the import replaces tables with matching names.

```bash
docker compose pull mysql
docker compose up -d --no-deps --wait mysql
docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot "$MYSQL_DATABASE"' \
  < "$mysql_backup_dir/wordpress.sql"
```

Start WordPress only after the import succeeds:

```bash
docker compose up -d --no-deps wordpress
```

## Validate

- Confirm WordPress admin opens and existing sample projects are present.
- Confirm WPGraphQL returns projects, technologies, and site profile settings.
- Run `npm test`, `npm run lint`, and `npm run build` from `apps/web`, with the
  frontend pointed at the local WordPress GraphQL endpoint.
- Keep the original volume and export until the updated setup is validated.

## Roll Back

Rollback returns to the content present at the time of migration. Export any
new content first if you have edited WordPress since switching to MySQL 8.4.
Never attach an upgraded 8.4 data directory to a MySQL 8.0 server.

Stop WordPress, then use the saved Compose file to reconnect to the retained
MySQL 8.0 volume. The project directory keeps relative mounts, `.env`, and the
default Compose project name consistent with the original setup.

```bash
docker compose stop wordpress
docker compose --project-directory "$PWD" \
  -f "$mysql_backup_dir/compose-mysql80.yml" up -d --no-deps mysql
```

Wait for MySQL 8.0 to accept connections, then restart WordPress using the saved
configuration:

```bash
docker compose --project-directory "$PWD" \
  -f "$mysql_backup_dir/compose-mysql80.yml" up -d --no-deps wordpress
```

Restore the previous tracked Compose configuration before subsequent normal
`docker compose` commands. Keep the 8.4 volume available until you decide whether
any newer content needs to be recovered.
