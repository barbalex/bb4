FROM node:lts-alpine as build

WORKDIR /app

COPY ./package.json ./

RUN npm install
# need all app files for build, just like when building locally
COPY ./ ./

# Build the project
RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

# ENV ADDRESS=0.0.0.0 PORT=3000

ENV ORIGIN=https://new.blue-borders.ch

USER node

# Start the application
CMD [ "node", "server/entry.fastify"]