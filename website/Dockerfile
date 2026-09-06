# Étape Build
FROM node:20 AS build
WORKDIR /app

# Accept env vars as build arguments for client-side code
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:8080
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape Prod SSR
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app ./

# PAS de npm install ici → Nuxt doit rester dispo

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

