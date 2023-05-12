#!/bin/sh

set -o errexit

if [ "${#}" -eq 0 ] || [ "${1#-}" != "${1}" ]; then
  set -- node ./packages/server/server.js start "$@"
fi

exec "$@"
