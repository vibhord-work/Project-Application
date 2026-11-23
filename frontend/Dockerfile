FROM node:22-alpine AS builder

# Apply current Alpine security updates in the build environment.
RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

# Apply current Alpine security updates to the runtime image.
# Explicitly upgrade libxml2 to include the patched Alpine package.
RUN apk update && apk upgrade --no-cache libxml2 \
    && apk info -v libxml2

COPY --from=builder /app/dist /usr/share/nginx/html
ARG NGINX_CONFIG=nginx.conf
COPY ${NGINX_CONFIG} /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
