FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build_dotnet
WORKDIR /src
#тут была оптимизация разбивки по слоям - сначала рестор потом билд, но я ее убрал
COPY Ebay Ebay
RUN dotnet restore "Ebay/Server/Server.csproj"
WORKDIR "/src/Ebay/"
RUN dotnet msbuild -t:BeforeBuild
WORKDIR "/src/Ebay/Server"
ARG BUILD_VERSION="1.0.0.0"
RUN dotnet publish "Server.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:Version=$BUILD_VERSION
RUN apt-get update && apt-get install -y fontconfig fonts-liberation && fc-cache -f -v

FROM node:18-alpine AS build_crome_extension
WORKDIR /src
COPY ChromeExtension .
COPY --from=build_dotnet /src/ChromeExtension .
ARG EBAY_HELPER_BACKEND_DOMAIN="localhost"
ARG BUILD_VERSION="1.0.0.0"
RUN npm install
RUN EBAY_HELPER_BACKEND_DOMAIN=$EBAY_HELPER_BACKEND_DOMAIN BUILD_VERSION=$BUILD_VERSION npm run build
RUN mkdir -p /app/publish/ && \
    npx crx3 _extension --keyPath=./key.pem --crxPath=/app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build_dotnet /app/publish .
ARG BUILD_VERSION="1.0.0.0"
COPY --from=build_crome_extension /app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx /app/wwwroot/chrome_extensions/

COPY --from=build_dotnet /usr/share/fonts /usr/share/fonts
COPY --from=build_dotnet /etc/fonts /etc/fonts

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "Server.dll"]
