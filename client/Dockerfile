# Annadata Frontend - Dockerfile
# Multi-stage build: Node build -> Nginx static file serving

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:5454
ARG VITE_RAZORPAY_KEY_ID=""
ARG VITE_STRIPE_PUBLISHABLE_KEY=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runtime

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
