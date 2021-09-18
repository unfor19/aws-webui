# aws-webui (aws-webui)

A Single Page Application to manage AWS resources efficiently

## Requirements

- Node 14.x+
- NPM 6.x+
- Docker and Docker-Compose for testing locally with localstack

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
make up-localstack
```

```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).
