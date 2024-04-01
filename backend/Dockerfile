FROM node:20-alpine as build
WORKDIR /hexguess-server
COPY ./package*.json ./
RUN npm install --no-audit
COPY ./ ./
RUN npm run build
RUN rm -rf node_modules


FROM arm64v8/node:20-alpine
LABEL name="hexguess"
WORKDIR /hexguess-server

# Install dotenvx
RUN apk --no-cache add curl
RUN curl -fsS https://dotenvx.sh/ | sh

COPY ./package*.json ./
RUN npm ci --omit=dev
COPY --from=build /hexguess-server/dist ./src
COPY --from=build /hexguess-server/.env.prod ./
RUN npm install pm2 -g
EXPOSE 3000
CMD ["dotenvx", "run",  "--env-file=.env.prod", "--", "pm2-runtime", "src/server.js", "--node-args='--es-module-specifier-resolution=node'"]
