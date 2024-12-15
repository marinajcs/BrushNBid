# Dockerfile
FROM node:23.4-alpine

LABEL maintainer="marinacarranza@correo.ugr.es" \
      version="1.0.0"


USER root

RUN mkdir -p /app && chown -R node:node /app

USER node

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start-server"]
