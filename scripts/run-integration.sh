#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
# Set environment variables from GitHub Secrets
# export DATABASE_URL=${{ secrets.DATABASE_URL }}
# export JWT_ACCESS_SECRET=${{ secrets.JWT_ACCESS_SECRET }}
# export JWT_REFRESH_SECRET=${{ secrets.JWT_REFRESH_SECRET }}

docker-compose -f docker-compose.testing.yml up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init
if [ "$#" -eq  "0" ]
  then
    vitest -c test/vitest.config.integration.ts
else
    vitest -c test/vitest.config.integration.ts --ui
fi