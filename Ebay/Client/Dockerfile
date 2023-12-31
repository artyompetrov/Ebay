FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Ebay/Client/Ebay.Client.csproj", "Ebay/Client/"]
COPY ["Ebay/Shared/Ebay.Shared.csproj", "Ebay/Shared/"]
RUN dotnet restore "Ebay/Client/Ebay.Client.csproj"
COPY . .
WORKDIR "/src/Ebay/Client"
RUN dotnet build "Ebay.Client.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Ebay.Client.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Ebay.Client.dll"]
