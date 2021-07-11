 FROM node:12-alpine
 EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

 RUN apk add --no-cache python g++ make
 WORKDIR /app
 COPY . .
 RUN yarn install --production
 CMD ["node", "docker:start"]