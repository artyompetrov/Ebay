#!/bin/sh
set -e

echo "Starting crond..."
crond

echo "Starting nginx..."
exec "$@"
