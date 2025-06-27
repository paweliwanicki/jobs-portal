FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/backend

# Kopiujemy wszystkie pliki jako root
COPY . .

# Instalujemy zależności jako root - bez lockfile jesli nadal problemy
RUN pnpm install --verbose

# Budujemy aplikację jako root
RUN pnpm run build

# Nadajemy uprawnienia do całego katalogu
RUN chown -R node:node /app/backend/

# Przełączamy na użytkownika node dopiero na końcu
USER node
# RUN pnpm run migration:run

# Value set in .env file.
EXPOSE $BACKEND_PORT
CMD ["pnpm", "run", "start"]