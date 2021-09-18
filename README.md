# aws-webui

**Work In Progress (WIP)** - This is me, trying to learn frontend

A Single Page Application to manage AWS resources efficiently.

## Requirements

- [Node](https://nodejs.org/en/download/) 14.x+
- [quaser CLI](https://quasar.dev/quasar-cli/installation) v3.x
- [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/) for testing locally with localstack
- (Optional) [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) - for modifying values via terminal
## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

1. Start localstack
    ```bash
    make up-localstack
    ```
1. Add parameters with AWS CLI (required until I add the `Add parameter` feature)
   ```bash
   export \
    AWS_ACCESS_KEY_ID="mock_aws" \
    AWS_SECRET_ACCESS_KEY="mock_aws" \
    AWS_REGION="us-east-1" \
    AWS_SSM_ENDPOINT_URL="http://localhost:4566"

   for i in {1..32}; do
     P_NAME="/myapp/dev/test${i}"
     P_VALUE="testvalue${i}"
     P_TYPE="SecureString"
     aws ssm --endpoint-url="$AWS_SSM_ENDPOINT_URL" put-parameter --overwrite --name "$P_NAME" --value "$P_VALUE" --type "$P_TYPE"
   done
   ```
   
2. Start development server

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


## Authors

Created and maintained by [Meir Gabay](https://github.com/unfor19)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/unfor19/aws-webui/blob/master/LICENSE) file for details
