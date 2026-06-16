# ---- Stage 1: build the React app into static files ----
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # outputs static files to /app/dist

# ---- Stage 2: bake those files into a Caddy image ----
# The result is a self-contained web server: Caddy + the built site, no host
# files needed. The Caddyfile itself is mounted at runtime (see docker-compose).
FROM caddy:2
COPY --from=build /app/dist /srv
