#!/bin/sh
# Runs on the ThinkCentre (cron: */5 * * * *). Pushes stats to the Kindle feed.
# Needs: KINDLE_PUSH_TOKEN, POOL (zfs pool name, e.g. "tank").
set -eu
running=$(docker ps -q | wc -l | tr -d ' ')
total=$(docker ps -aq | wc -l | tr -d ' ')
# zpool list -Hp: size alloc in bytes.
set -- $(zpool list -Hp -o size,alloc "${POOL:-tank}")
tb() { awk "BEGIN { printf \"%.1f\", $1 / 1e12 }"; }
status=ok  # stopped containers are normal; flip to "degraded" on your own checks

curl -fsS -m 10 -X POST https://www.albyeah.com/api/kindle/server \
  -H "X-Kindle-Token: $KINDLE_PUSH_TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name\":\"ThinkCentre\",\"status\":\"$status\",\"containers_running\":$running,\"containers_total\":$total,\"pool_tb\":$(tb "$1"),\"storage_used_tb\":$(tb "$2"),\"storage_total_tb\":$(tb "$1")}"
