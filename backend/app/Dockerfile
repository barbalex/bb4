FROM node:lts-alpine as build

WORKDIR /app

COPY ./package.json ./

RUN npm install

# TODO: how copy 
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

ENV ADDRESS=0.0.0.0 PORT=3000

# Start the application
CMD [ "ORIGIN=https://neu.blue-borders.ch node", "server/entry.fastify"]