# ------------------
# 1. Tmp image
# ------------------
FROM node:lts-alpine as build

WORKDIR /app/tmp

COPY ./package.json ./

RUN npm install --force

# need all app files for build, just like when building locally
COPY ./ /app/tmp

# Build the project
RUN npm run build

# BEWARE: it takes FOREVER to build the app, then copy (>15 min)

# ------------------
# 2. Final image
# ------------------
FROM node:lts-alpine as production

# Do not use root to run the app to avoid privilege escalation, container escape, etc.
USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/tmp/node_modules ./node_modules
COPY --from=build --chown=node:node /app/tmp/server ./server
COPY --from=build --chown=node:node /app/tmp/dist ./dist
COPY --from=build --chown=node:node /app/tmp/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

# ENV ORIGIN=https://blue-borders.ch

# Start the application
CMD [ "node", "server/entry.fastify"]