FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Argument do przekazania klucza API podczas budowania
ARG VITE_GOOGLE_LOCATION_API_KEY
ENV VITE_GOOGLE_LOCATION_API_KEY=$VITE_GOOGLE_LOCATION_API_KEY

# Build arguments for environment variables
ARG VITE_GOOGLE_LOCATION_API_KEY
ENV VITE_GOOGLE_LOCATION_API_KEY=$VITE_GOOGLE_LOCATION_API_KEY

# Build argument for TinyMCE Editor API Key  
ARG VITE_TINYMCE_EDITOR_API_KEY
ENV VITE_TINYMCE_EDITOR_API_KEY=$VITE_TINYMCE_EDITOR_API_KEY

# Backend URL for Cloud Run
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Install basic tools
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/frontend

# Copy only package.json files first for better cache
COPY package.json pnpm-lock.yaml* ./

# Clean pnpm cache
RUN pnpm store prune

# Install dependencies - use --force to rebuild lockfile if needed
RUN pnpm install --force

# Now copy the rest of the code
COPY . .

# Build application as root
RUN pnpm run build

# Set permissions for the entire directory
RUN chown -R node:node /app/frontend/

# Switch to node user only at the end
USER node

# Cloud Run używa PORT, ale defaultujemy do 8080
EXPOSE 8080
CMD ["pnpm", "run", "preview"]