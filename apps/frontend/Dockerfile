FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Instalujemy podstawowe narzędzia
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/frontend

# Kopiujemy tylko pliki package.json najpierw dla lepszego cache
COPY package.json pnpm-lock.yaml* ./

# Czyścimy cache pnpm
RUN pnpm store prune

# Instalujemy zależności - używamy --force żeby przebudować lockfile jeśli potrzeba
RUN pnpm install --force

# Teraz kopiujemy resztę kodu
COPY . .

# Budujemy aplikację jako root
RUN pnpm run build

# Nadajemy uprawnienia do całego katalogu
RUN chown -R node:node /app/frontend/

# Przełączamy na użytkownika node dopiero na końcu
USER node

# Cloud Run używa PORT, ale defaultujemy do 8080
EXPOSE 8080
CMD ["pnpm", "run", "preview"]