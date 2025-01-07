FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build_dotnet
WORKDIR /src
COPY "Ebay/Ebay.sln" "Ebay/"
COPY "Ebay/Directory.Packages.props" "Ebay/"
COPY "Ebay/Server/Server.csproj" "Ebay/Server/Server.csproj"
COPY "Ebay/Client/Client.csproj" "Ebay/Client/Client.csproj"
RUN dotnet restore "Ebay/Server/Server.csproj"
COPY Ebay Ebay
WORKDIR "/src/Ebay/Server"
ARG BUILD_VERSION="0.0.0.1"
RUN dotnet publish "Server.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:Version=$BUILD_VERSION

FROM node:18-alpine AS build_crome_extension
WORKDIR /src
COPY ChromeExtension .
COPY --from=build_dotnet /src/ChromeExtension .
RUN npm install
RUN npm run build
ARG BUILD_VERSION="0.0.0.1"
RUN node updateVersion.js 1.0.12
RUN mkdir -p /app/publish/ && \
    npx crx3 _extension --keyPath=./key.pem --crxPath=/app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build_dotnet /app/publish .
ARG BUILD_VERSION="0.0.0.1"
COPY --from=build_crome_extension /app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx /app/wwwroot/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm_1.0.12.crx
ENTRYPOINT ["dotnet", "Server.dll"]