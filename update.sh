#!/bin/bash

cd ./git

git pull origin main

cd ./deploy

docker compose --env-file server.env build
docker compose --env-file server.env up -d