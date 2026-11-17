FROM node:22-alpine AS dependencies

# Apply current Alpine security updates in the dependency stage.
RUN apk upgrade --no-cache

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

FROM node:22-alpine AS runtime

# Apply current Alpine security updates to the final runtime image.
RUN apk upgrade --no-cache

ENV NODE_ENV=production
ENV PORT=8081
WORKDIR /app

COPY --from=dependencies --chown=node:node \
    /app/node_modules ./node_modules

COPY --chown=node:node package*.json ./
COPY --chown=node:node server.js ./

USER node
EXPOSE 8081
CMD ["node", "server.js"]