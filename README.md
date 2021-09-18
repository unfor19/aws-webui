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


## TODO

- Decouple "SsmLayout" from `TableLayout` - Currently, TableLayout can only support SSM, so I need to break it down to templates, so each AWS Service can implement TableLayout by injecting values with `props`
- Add `Create Item (Parameter)` - add a `ItemLayout` modal, to get data use `get-parameter` and to set data `put-parameter`. The `get-parameter` and `get-parameter-history` to get more information than `get-parameters-by-path`.
- Add `Delete Item (Parameter)` - multiple selection of parameters and clicking on a button to delete
