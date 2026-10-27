# ==============================================================================
# Multi-stage Production Dockerfile for Fleet Tracking & Delivery Finance API
# Optimized for Render Web Services (.NET 8 Runtime on Linux)
# ==============================================================================

# ─── Stage 1: Build & Publish ──────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies (optimizes Docker layer caching)
COPY ["DeliveryFinance.Api.csproj", "./"]
RUN dotnet restore "DeliveryFinance.Api.csproj"

# Copy source code and build production release
COPY . ./
RUN dotnet publish "DeliveryFinance.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false --no-restore

# ─── Stage 2: Minimal Production Runtime ──────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published binaries from build stage
COPY --from=build /app/publish .

# Render dynamically assigns $PORT at runtime (defaults to 8080 if running standalone)
EXPOSE 8080

ENV ASPNETCORE_ENVIRONMENT=Production
ENV EnableSwagger=true

# Shell entrypoint dynamically binds Kestrel to the Render $PORT variable
ENTRYPOINT ["sh", "-c", "dotnet DeliveryFinance.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
