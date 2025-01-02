FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src
COPY ["Directory.Packages.props", "Directory.Packages.props"]
COPY ["Ebay.sln", "Ebay.sln"]
COPY ["Ebay/Server/Ebay.Server.csproj", "Ebay/Server/"]
COPY ["Ebay/Client/Ebay.Client.csproj", "Ebay/Client/"]
RUN dotnet restore "Ebay/Server/Ebay.Server.csproj"
COPY . .
WORKDIR "/src/Ebay/Server"
RUN dotnet publish "Ebay.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Ebay.Server.dll"]
