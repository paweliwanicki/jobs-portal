FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app/backend
COPY . .
# RUN chown -R node:node /app/backend/
USER node
RUN pnpm install --verbose
RUN pnpm run build
# RUN chmod -R 777 /app/backend/node_modules
# RUN pnpm run migration:run

# Value set in .env file.
EXPOSE $BACKEND_PORT
CMD ["pnpm", "run", "start"]