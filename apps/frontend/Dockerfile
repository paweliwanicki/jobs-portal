FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app/frontend
COPY . .
RUN chown -R node:node /app/frontend/
USER node
RUN pnpm install --verbose
RUN pnpm run build
RUN chmod -R 777 /app/frontend/node_modules

EXPOSE $FRONTEND_PORT
CMD [ "pnpm", "run", "preview" ]