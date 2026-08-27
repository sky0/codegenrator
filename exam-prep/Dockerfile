FROM node:20-bookworm-slim

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN cd backend && npm ci --omit=dev \
  && cd ../frontend && npm ci

COPY backend ./backend
COPY frontend ./frontend

RUN cd frontend && npm run build \
  && rm -rf node_modules

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
EXPOSE 3001

CMD ["node", "server.js"]
