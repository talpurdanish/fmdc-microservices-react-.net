# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder
WORKDIR /src
ENV DOTNET_NOLOGO=true \
    DOTNET_CLI_TELEMETRY_OPTOUT=true \
    NUGET_XMLDOC_MODE=skip

COPY NuGet.config ./
COPY *.sln ./
COPY FMDC/FMDC.csproj FMDC/
COPY Domain/Domain.csproj Domain/

RUN dotnet restore FMDC.sln

COPY . .
WORKDIR "/src/FMDC"

RUN dotnet build "FMDC.csproj" -c Release

RUN dotnet publish "FMDC.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

ENV ASPNETCORE_URLS="http://+:4100" \
    ASPNETCORE_ENVIRONMENT="Production" \
    DOTNET_NOLOGO=true \
    DOTNET_CLI_TELEMETRY_OPTOUT=true
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/publish .
COPY --from=builder /src/FMDC/Security ./Security
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4100/health || exit 1
ENTRYPOINT ["dotnet", "FMDC.dll"]
