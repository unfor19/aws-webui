FROM node:14-alpine3.14 as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

## Server running the app
FROM node:14-alpine3.14 as server

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
CMD [ "yarn", "serve:prod" ]
