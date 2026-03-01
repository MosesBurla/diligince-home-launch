# Dockerfile
# Use ECR Public Gallery – no rate limits, no login needed
FROM public.ecr.aws/docker/library/node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (leverages Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite + React app
RUN npm run build

# Production stage: lightweight Nginx
FROM public.ecr.aws/docker/library/nginx:alpine

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom Nginx config for React Router (SPA)
# Uncomment the next two lines if using client-side routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# (Create nginx.conf in project root with try_files $uri /index.html;)

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost || exit 1
  
# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
