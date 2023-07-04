FROM node:lts-alpine as build

WORKDIR /app

COPY ./package.json ./

RUN npm install
# need all app files for build, just like when building locally
COPY ./ ./

# Build the project
RUN npm run build

RUN echo 'finished building app'

FROM node:lts-alpine as production

WORKDIR /app

RUN echo 'will copy to production'

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

ENV ORIGIN=https://new.blue-borders.ch

USER node

RUN echo 'will start server'

# Start the application
CMD [ "node", "server/entry.fastify"]