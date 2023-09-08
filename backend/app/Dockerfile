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

# BEWARE: it takes long to build the app, then copy 
# (>15 min on 2GB shared, often crashed, had to upgrade to 4GB dedicated)

# ------------------
# 2. Final image
# ------------------
FROM node:lts-alpine as production

# Do not use root to run the app to avoid privilege escalation, container escape, etc.
USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/tmp /app

EXPOSE 3000

ENV NODE_ENV=production

# ENV ORIGIN=https://blue-borders.ch

# Start the application
CMD [ "node", "server/entry.fastify"]