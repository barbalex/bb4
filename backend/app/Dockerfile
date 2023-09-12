# https://www.specfy.io/blog/1-efficient-dockerfile-nodejs-in-7-steps
# ------------------
# 1. Tmp image
# ------------------
FROM node:slim as build

WORKDIR /app/tmp

COPY ./package.json ./

RUN npm install --force

# need all app files for build, just like when building locally
COPY ./ /app/tmp

# Build the project
RUN npm run build

# remove the development dependencies that are no longer required once the source code has been built. 
# This step ensures that we only retain the relevant dependencies needed for running the application, 
# while discarding tools like Typescript, Webpack, and other development-specific dependencies
# BEWARE: app did not run with this!!!
# RUN true \
#  && npm prune --omit=dev

# BEWARE: it takes long to build the app, then copy 
# (>15 min on 2GB shared, often crashed, had to upgrade to 4GB dedicated)

# ------------------
# 2. Final image
# ------------------
FROM node:slim as production

# Do not use root to run the app to avoid privilege escalation, container escape, etc.
USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/tmp /app

EXPOSE 3000

ENV NODE_ENV=production

# ENV ORIGIN=https://blue-borders.ch

# Start the application
CMD [ "node", "server/entry.fastify"]