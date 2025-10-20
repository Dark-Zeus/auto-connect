FROM node:20-slim AS build

ARG NODE_ENV=production
ARG APP_VERSION=1.0.0

ENV NODE_ENV=${NODE_ENV}
ENV APP_VERSION=${APP_VERSION}

WORKDIR /app

RUN corepack enable
RUN corepack prepare yarn@4.9.0 --activate

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "node", "server.js"]
