#!/bin/bash

cd ./git

git pull origin develop

cd ./deploy

docker compose --env-file server.env build
docker compose --env-file server.env up -d