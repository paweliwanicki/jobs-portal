FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/backend

# Copy only package.json files first for better cache
COPY package.json pnpm-lock.yaml* ./

# Install dependencies - use --force to rebuild lockfile if needed
RUN pnpm install --force

# Now copy the rest of the code
COPY . .

# Build application as root
RUN pnpm run build

RUN mkdir -p /cloudsql

# Set permissions for the entire directory
RUN chown -R node:node /app/backend/

# Switch to node user only at the end
USER node

# Cloud Run używa PORT, ale defaultujemy do 8080
EXPOSE 8080
CMD ["pnpm", "run", "start"]