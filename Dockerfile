# Base image for both dev and prod
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development
FROM base AS dev
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Production
FROM base AS builder
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
