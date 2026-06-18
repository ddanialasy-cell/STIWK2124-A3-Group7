# ---------- Stage 1: build the Angular app ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: serve the static build with nginx ----------
FROM nginx:alpine
# Serve the client-side (browser) bundle.
COPY --from=build /app/dist/arlfrontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
