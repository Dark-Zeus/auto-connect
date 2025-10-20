FROM node:20-slim AS build

ARG APP_VERSION=1.0.0
ENV NODE_ENV=production APP_VERSION=${APP_VERSION}

WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock ./
RUN printf "nodeLinker: node-modules\n" > .yarnrc.yml

RUN yarn install --immutable
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
