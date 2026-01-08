# -------- Base image --------
FROM node:20-alpine AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# -------- Dependencies --------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# -------- Builder --------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time envs (DO NOT put secrets here)
ENV NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=""

RUN npm run build

# -------- Production --------
FROM base AS runner
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
