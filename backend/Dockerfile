FROM node:22.23.5-alpine3.24 AS dependencies
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install --package-lock-only --ignore-scripts --no-audit --no-fund \
    && npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
    && npm cache clean --force

FROM alpine:3.24.4 AS runtime
RUN apk upgrade --no-cache \
    && apk add --no-cache libstdc++ libgcc ca-certificates

ENV NODE_ENV=production
ENV PORT=8081
WORKDIR /app
COPY --from=dependencies /usr/local/bin/node /usr/local/bin/node
COPY --from=dependencies --chown=10001:10001 /app/node_modules ./node_modules
COPY --from=dependencies --chown=10001:10001 /app/package.json ./package.json
COPY --chown=10001:10001 server.js ./
USER 10001:10001
EXPOSE 8081
CMD ["node", "server.js"]
