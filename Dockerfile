ARG NODE_VERSION="14"
ARG ALPINE_VERSION="3.14"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

## Server running the app
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as server

WORKDIR /app/server/

# Install server dependencies
COPY server/package.json server/yarn.lock ./
RUN  yarn install

# Copy server code
COPY server ./

# Copy app dist
WORKDIR /app/dist/
COPY --from=build /usr/src/app/dist/ .

EXPOSE 8080
WORKDIR /app/
COPY package.json .
CMD [ "yarn", "serve:prod" ]
