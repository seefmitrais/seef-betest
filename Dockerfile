FROM node:alpine

RUN mkdir -p /usr/app && chown -R node:node /usr/app

WORKDIR /usr/app

COPY --chown=node:node package.json package-lock.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000