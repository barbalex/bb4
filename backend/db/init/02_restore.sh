#!/bin/bash
set -e

echo "restoring database"
# do not declare --host db, seems to create error
pg_restore --dbname=bb --port 5432 --username "${POSTGRES_USER}" --no-password --verbose "/sik_data/bb.backup"
echo "database was restored"