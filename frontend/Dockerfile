FROM node:20-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV VITE_WEBSOCKET_URL wss://hexguess.kellerkind.dev/ws
COPY ./package*.json /app/
RUN npm install --no-audit
COPY . /app
RUN npm run build
RUN rm -rf node_modules

# stage 2 - build the final image and copy the react build files
FROM arm64v8/node:20-alpine
LABEL name="hexguess"
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app/dist/hexguess-web/browser /app/build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]