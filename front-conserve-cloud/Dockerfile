FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY angular.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.spec.json ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist/front-conserve-cloud ./dist/front-conserve-cloud

EXPOSE 4000
CMD ["npm", "run", "serve:ssr:front-conserve-cloud"]
