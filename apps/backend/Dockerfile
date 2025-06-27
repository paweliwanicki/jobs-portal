FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Instalujemy wymagane pakiety dla bcrypt i innych natywnych modułów
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/backend

# Kopiujemy tylko pliki package.json najpierw dla lepszego cache
COPY package.json pnpm-lock.yaml* ./

# Czyścimy cache pnpm żeby uniknąć problemów z natywными modułami
RUN pnpm store prune

# Instalujemy zależności bez cache dla natywnych modułów
RUN pnpm install --frozen-lockfile --no-optional

# Przebudowujemy wszystkie natywne moduły dla właściwej architektury
RUN pnpm rebuild

# Teraz kopiujemy resztę kodu
COPY . .

# Budujemy aplikację jako root
RUN pnpm run build

# Jeszcze raz rebuild po build dla pewności
RUN pnpm rebuild

# Nadajemy uprawnienia do całego katalogu
RUN chown -R node:node /app/backend/

# Przełączamy na użytkownika node dopiero na końcu
USER node
# RUN pnpm run migration:run

# Cloud Run używa PORT, ale defaultujemy do 3000
EXPOSE 8080
CMD ["pnpm", "run", "start"]