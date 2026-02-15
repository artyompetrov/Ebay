FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build_dotnet
WORKDIR /src
# Сначала копируем файлы проектов для использования кэша слоёв при restore
COPY .editorconfig /
COPY Ebay/*.sln Ebay/
COPY Ebay/*.props Ebay/
COPY Ebay/nuget.config Ebay/
COPY Ebay/Client/*.csproj Ebay/Client/
COPY Ebay/Server/*.csproj Ebay/Server/
COPY Ebay/Server.Adapters.Smtp/*.csproj Ebay/Server.Adapters.Smtp/
COPY Ebay/Server.Adapters.uTracer/*.csproj Ebay/Server.Adapters.uTracer/
COPY Ebay/Server.Adapters.EF.ReadModel/*.csproj Ebay/Server.Adapters.EF.ReadModel/
COPY Ebay/Server.Adapters.EF.WriteModel/*.csproj Ebay/Server.Adapters.EF.WriteModel/
COPY Ebay/Server.Adapters.ChipFind/*.csproj Ebay/Server.Adapters.ChipFind/
COPY Ebay/Server.Adapters.WebApi/*.csproj Ebay/Server.Adapters.WebApi/
COPY Ebay/Server.Contracts/*.csproj Ebay/Server.Contracts/
COPY Ebay/Server.Application/*.csproj Ebay/Server.Application/
COPY Ebay/Server.Domain/*.csproj Ebay/Server.Domain/
COPY Ebay/Server.Client/*.csproj Ebay/Server.Client/
COPY Ebay/Tests/*.csproj Ebay/Tests/
RUN dotnet restore "Ebay/Ebay.sln"
# Копируем остальной исходный код
COPY Ebay/ Ebay/
WORKDIR "/src/Ebay/"
WORKDIR "/src/Ebay/Server"
ARG BUILD_VERSION="1.0.0.0"
RUN dotnet publish "Server.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:Version=$BUILD_VERSION
RUN apt-get update && apt-get install -y fontconfig fonts-liberation && fc-cache -f -v

FROM node:18-alpine AS build_chrome_extension
WORKDIR /src
COPY ChromeExtension .
COPY --from=build_dotnet /src/ChromeExtension .
ARG EBAY_HELPER_BACKEND_DOMAIN="localhost"
ARG BUILD_VERSION="1.0.0.0"
RUN npm ci --include=dev
RUN EBAY_HELPER_BACKEND_DOMAIN=$EBAY_HELPER_BACKEND_DOMAIN BUILD_VERSION=$BUILD_VERSION npm run build
RUN mkdir -p /app/publish/ && \
    npx crx3 _extension --keyPath=./key.pem --crxPath=/app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS final
WORKDIR /app
COPY --from=build_dotnet /app/publish .
ARG BUILD_VERSION="1.0.0.0"
COPY --from=build_chrome_extension /app/publish/mlebgdemjnpnfgcgbbncllpniiicffbm_${BUILD_VERSION}.crx /app/wwwroot/chrome_extensions/

COPY --from=build_dotnet /usr/share/fonts /usr/share/fonts
COPY --from=build_dotnet /etc/fonts /etc/fonts

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "Server.dll"]
