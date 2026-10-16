FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl wget

COPY package.json package-lock.json ./
COPY prisma.config.mjs ./
COPY prisma ./prisma

# Prisma 7 config requires DATABASE_URL at generate time (value is not used to connect during build).
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=${DATABASE_URL}

RUN npm ci

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
