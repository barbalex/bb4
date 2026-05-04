# Pre-built image: build locally with `npm run build.client && npm run build.server`
# then rsync dist/ and server/ to the server together with the other project files.
FROM node:slim

# Do not use root to run the app to avoid privilege escalation, container escape, etc.
USER node

WORKDIR /app

COPY --chown=node:node ./package.json ./

RUN npm install --force

COPY --chown=node:node ./ /app

EXPOSE 3000

ENV NODE_ENV=production

# ENV ORIGIN=https://blue-borders.ch

# Start the application
CMD [ "node", "server/entry.fastify"]