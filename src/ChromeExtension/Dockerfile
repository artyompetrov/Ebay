# syntax=docker/dockerfile:1
# Image with only the signed extension. CI tags it with the hash of the extension inputs
# (`npm run --silent inputs-hash`, scripts/inputsHash.mjs) and builds it only when the registry has no current image with
# that tag (scripts/extensionImage.mjs), so the extension version changes only when the extension does. src/Dockerfile copies the .crx from it.
# The generated API client (src/clients/Generated) must exist in the context: build src/Ebay/Server.Client first.
FROM node:18-alpine AS build
WORKDIR /src
COPY . .
ARG EBAY_HELPER_BACKEND_DOMAIN="localhost"
ARG BUILD_VERSION="1.0.0.0"
RUN npm ci --include=dev
RUN EBAY_HELPER_BACKEND_DOMAIN=$EBAY_HELPER_BACKEND_DOMAIN BUILD_VERSION=$BUILD_VERSION npm run build
RUN mkdir -p /app/publish/chrome_extensions && \
    npx crx3 _extension --keyPath=./key.pem --crxPath=/app/publish/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx

FROM scratch
ARG BUILD_VERSION="1.0.0.0"
LABEL version=$BUILD_VERSION
COPY --from=build /app/publish/ /
