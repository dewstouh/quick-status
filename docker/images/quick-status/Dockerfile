# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @quick-status/db generate
RUN pnpm build

# --- Production Stage ---
FROM node:20-alpine AS prod

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps /app/apps

RUN pnpm --filter @quick-status/db migrate:deploy || pnpm --filter @quick-status/db push

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Solo lanza el server de prod, nunca el dev
CMD ["pnpm", "start"]
