# Friendly container template
# This repository cannot be used to create or promote animal cruelty.
# The original request has been replaced with a family-friendly placeholder game "Doggo & Bunny".
# Multi-stage build: build static output (if any) and serve with nginx.

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
# If a package.json exists, install and build. Otherwise generate a small placeholder site.
RUN if [ -f package.json ]; then \
      npm ci --silent && \
      if grep -q '"build"' package.json; then npm run build --silent; fi; \
    else \
      mkdir -p dist && printf '<!doctype html><meta charset="utf-8"><title>Doggo & Bunny</title><style>body{font-family:Arial,Helvetica,sans-serif;background:#fff9f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}h1{color:#2b6cb0}</style><h1>Doggo & Bunny — Friendly Game Placeholder</h1>' > dist/index.html; \
    fi

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
