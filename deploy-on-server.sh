#!/bin/bash

cd ./deploy || exit 1

docker compose --env-file server.env pull
docker compose --env-file server.env down
docker compose --env-file server.env up -d
docker image prune -af
docker builder prune -af
