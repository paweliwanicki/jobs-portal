FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/backend

# Kopiujemy tylko pliki package.json najpierw dla lepszego cache
COPY package.json pnpm-lock.yaml* ./

# Instalujemy zależności - używamy --force żeby przebudować lockfile jeśli potrzeba
RUN pnpm install --force

# Teraz kopiujemy resztę kodu
COPY . .

# Budujemy aplikację jako root
RUN pnpm run build

RUN mkdir -p /cloudsql

# Nadajemy uprawnienia do całego katalogu
RUN chown -R node:node /app/backend/

# Przełączamy na użytkownika node dopiero na końcu
USER node

# Cloud Run używa PORT, ale defaultujemy do 8080
EXPOSE 8080
CMD ["pnpm", "run", "start"]