# --- Base Stage ---
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat git curl

RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Install pnpm
RUN npm install -g pnpm@9

# Set working dir
WORKDIR /app

# Copy repo files
COPY . .

# Install dependencies
RUN pnpm install

# Generate Prisma client
RUN pnpm --filter @quick-status/db generate

# Build app
RUN pnpm build


RUN rm -rf /tmp/* /root/.npm /root/.cache/node /opt/yarn* && \
    apk del apk-tools


# --- Production Stage ---
FROM node:20-alpine AS production
COPY --from=base / /

# Apply DB migrations 
RUN pnpm --filter @quick-status/db migrate:deploy || pnpm --filter @quick-status/db push

# Expose port
EXPOSE 3000

# Set env
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --spider -q http://localhost:3000/health || exit 1

# Start app
CMD ["pnpm", "run", "start"]
