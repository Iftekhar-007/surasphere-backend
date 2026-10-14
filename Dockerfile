# ==============================================================================
# SurahSphere Backend Dockerfile
# Node.js 22 + Express 5 + TypeScript + Prisma 7 (PostgreSQL adapter)
# ==============================================================================

FROM node:22-bookworm-slim AS base

# Install OpenSSL, CA certificates, and curl (essential for Prisma engines & healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack and prepare pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.9.1 --activate

WORKDIR /app

# ------------------------------------------------------------------------------
# Dependencies & Build stage
# ------------------------------------------------------------------------------
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including Prisma CLI for migrations)
RUN pnpm install --frozen-lockfile

# Copy Prisma schema, config, and source files
COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Build-time environment variables required for Prisma config evaluation during build
ENV NODE_ENV=production \
    PORT=5000 \
    DATABASE_URL="postgresql://surahsphere:surahsphere_secret_password@postgres:5432/surahsphere_db?schema=public" \
    BETTER_AUTH_SECRET="2itsQHDfBsd5gPTN9MFpy9Ld1UmCvPqu" \
    BETTER_AUTH_URL="http://localhost:5000" \
    CLOUDINARY_CLOUD_NAME="djp6x4ph8" \
    CLOUDINARY_API_KEY="329453882362616" \
    CLOUDINARY_API_SECRET="GVXohDp0m9d9GAUWdbWjoCIoOt4"

# Generate Prisma Client (outputs to src/generated/prisma)
RUN pnpm run generate

# Compile TypeScript to dist/
RUN pnpm run build

# ------------------------------------------------------------------------------
# Runtime Configuration
# ------------------------------------------------------------------------------
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Sync database schema then start production server with tsx
CMD ["sh", "-c", "pnpm prisma db push && pnpm tsx src/server.ts"]
