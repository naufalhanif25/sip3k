FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

RUN bun build src/app/jobs/cron-picket.ts --outfile dist/cron.js --target bun
RUN bun build src/app/jobs/cron-backup.ts --outfile dist/backup.js --target bun

RUN bun build scripts/seed.ts --outfile dist/seed.js --target bun
RUN bun build scripts/set-env.ts --outfile dist/set-env.js --target bun
RUN bun build scripts/restore.ts --outfile dist/restore.js --target bun

FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Jakarta

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "run", "server.js"]