# syntax=docker/dockerfile:1
# The Chrome extension is built in its own image (src/ChromeExtension/Dockerfile). CI passes the image tagged with
# the hash of the extension inputs; the default lets a local build take the extension last published from main.
ARG EXTENSION_IMAGE=ghcr.io/artyompetrov/ebay-chrome-extension:latest
FROM ${EXTENSION_IMAGE} AS chrome_extension

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build_dotnet
WORKDIR /src
COPY .editorconfig /
# Для restore копируем только проектные файлы (COPY --parents сохраняет структуру каталогов),
# чтобы слой с пакетами кешировался, пока не менялись зависимости, и чтобы не поддерживать
# вручную список *.csproj при добавлении новых проектов в solution.
COPY --parents Ebay/**/*.csproj Ebay/*.props Ebay/*.slnx Ebay/nuget.config ./
RUN dotnet restore "Ebay/Ebay.slnx"
COPY Ebay/ Ebay/
WORKDIR "/src/Ebay/"
WORKDIR "/src/Ebay/Server"
ARG BUILD_VERSION="1.0.0.0"
RUN dotnet publish "Server.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:Version=$BUILD_VERSION --no-restore
RUN apt-get update && apt-get install -y fontconfig fonts-liberation && fc-cache -f -v

# Chiseled (distroless) runtime: no shell or package manager, runs as the non-root `app` user.
# The "extra" flavor adds ICU and tzdata, which the server needs (globalization is not invariant).
FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled-extra AS final
WORKDIR /app
COPY --from=build_dotnet /app/publish .
COPY --from=chrome_extension /chrome_extensions/ /app/wwwroot/chrome_extensions/

COPY --from=build_dotnet /usr/share/fonts /usr/share/fonts
COPY --from=build_dotnet /etc/fonts /etc/fonts

USER $APP_UID
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "Server.dll"]
