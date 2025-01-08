#!/bin/bash

cd ./deploy

env $(cat server.env | xargs) docker compose pull
docker compose --env-file server.env build
docker compose --env-file server.env down
docker compose --env-file server.env up -d
docker image prune -f