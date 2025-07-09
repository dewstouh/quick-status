# Dockerfile for Quick Status

FROM node:20-alpine AS base


# System dependencies
RUN apk update
RUN apk add --no-cache libc6-compat git curl

RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Install pnpm
RUN npm install -g pnpm@9

# Set working directory
WORKDIR /app

# Copy repo files
COPY . .

# Install dependencies
RUN pnpm install

# Generate Prisma client (si hace falta, depende del monorepo)
RUN pnpm --filter @quick-status/db generate

# Build the application
RUN pnpm build

# Create DB directory and apply migrations
RUN mkdir -p packages/db/prisma
RUN pnpm --filter @quick-status/db migrate:deploy || pnpm --filter @quick-status/db push

# Expose port (ajusta si es otro)
EXPOSE 3000

# Set env
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app (ajusta el script según tu monorepo, esto espera que "start" esté en el root package.json)
CMD ["pnpm", "run", "start"]
