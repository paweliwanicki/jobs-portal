FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Instalujemy podstawowe narzędzia
RUN apt-get update && apt-get install -y \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app/frontend

# Kopiujemy tylko pliki package.json najpierw dla lepszego cache
COPY package.json pnpm-lock.yaml* ./

# Instalujemy zależności jako root
RUN pnpm install --verbose

# Teraz kopiujemy resztę kodu
COPY . .

# Budujemy aplikację jako root
RUN pnpm run build

# Nadajemy uprawnienia do całego katalogu
RUN chown -R node:node /app/frontend/

# Przełączamy na użytkownika node dopiero na końcu
USER node

EXPOSE 8080
CMD [ "pnpm", "run", "preview" ]