# aws-webui

[![Push to Docker Registries](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml/badge.svg)](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml) [![Dockerhub pulls](https://img.shields.io/docker/pulls/unfor19/aws-webui)](https://hub.docker.com/r/unfor19/aws-webui)

A Single Page Application to manage AWS resources efficiently.

This application was built with:

- [TypeScript](https://www.typescriptlang.org/)
- [Vue v3](https://v3.vuejs.org/guide/introduction.html)
- [Quasar v2](https://quasar.dev/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

## Requirements

- [Node](https://nodejs.org/en/download/) 14.x+
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install) 1.22+
- [quasar CLI](https://quasar.dev/quasar-cli/installation) v3.x
- [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/) for testing locally with [localstack](https://github.com/localstack/localstack)
- (Optional) [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) - for modifying values via terminal

## Getting Started

### Quick Start

1. Download relevant files
   ```bash
   curl -sL -o docker-compose.yml "https://raw.githubusercontent.com/unfor19/aws-webui/master/docker-compose.yml"
   ```
2. Run application (GUI) and [localstack](https://github.com/localstack/localstack) - a backend server that immitates [AWS SSM Parameters API](https://docs.aws.amazon.com/systems-manager/latest/APIReference/Welcome.html)
   ```bash
   docker-compose -p awswebui --profile frontend up --detach
   ```
3. Open application in browser - [http://localhost:8081](http://localhost:8081)
4. Cleanup
   ```bash
   docker-compose -p awswebui down && \
   rm docker-compose.yml
   ```

### Run From Source Code

1. Fork/Clone this repo
2. Install application dependencies
   ```bash
   yarn install
   ```
3. Build the application
    ```bash
    yarn build
    ```
4. Install server dependencies
   ```bash
   cd server && \
   yarn install && \
   cd ..
   ```
5. Start [localstack](https://github.com/localstack/localstack)
   ```bash
   yarn localstack:up
   ```
6. Run application in production mode
   ```bash
   yarn serve:prod
   ```
7. Open application in browser - [http://localhost:8080](http://localhost:8080)

### Docker

#### Run Official Container

1. Run application in Docker
   ```bash
   docker run --rm -it -p 8080:8080 unfor19/aws-webui
   ```
1. Open application in browser - [http://localhost:8080](http://localhost:8080)

#### Build Docker Image From Source Code

1. Fork/Clone this repo
1. Build the application
   ```bash
   docker build -t aws-webui .
   ```
1. Run application in production mode
   ```bash
   docker run --rm -it -p 8080:8080 aws-webui
   ```
1. Open application in browser - [http://localhost:8080](http://localhost:8080)   

## Contributing

Report issues/questions/feature requests on the [Issues](https://github.com/unfor19/terraform-aws-ssm-parameters/issues) section.

Pull requests are welcome! These are the steps:

1. Fork this repo
1. Install dependencies
   ```bash
   yarn install
   ```
1. Create your feature branch from master (`git checkout -b my-new-feature`)
1. Start [localstack](https://github.com/localstack/localstack)
    ```bash
    yarn localstack:up
    ```
1. Start development server - will automatically open a new browser with hot-reload
   ```bash
   yarn serve
   ```    
2. Add the code of your new feature
3. Commit your remarkable changes (`git commit -am 'Added new feature'`)
4. Push to the branch (`git push --set-up-stream origin my-new-feature`)
5. Create a new Pull Request and provide details about your changes

## TODO

- Add the action `bulk edit value` with the options to `find and replace` and `add prefix/suffix`. Requires a new function `editItems(items)`
- Add the action - `export selected items to a JSON file`, the structure per service should be declared in `src/router/routes.ts`. For SSM the structure as in [unfor19/parzival](https://github.com/unfor19/parzival/blob/master/cmd/config.go). Requires a new function `exportItemsToFile(items)`
- Add the action - `export selected items to a JSON string`, the structure per service should be declared in `src/router/routes.ts`. For SSM the structure as in [unfor19/parzival](https://github.com/unfor19/parzival/blob/master/cmd/config.go). Requires a new function `exportItemsToString(string)`
- Add the action - `import items from a JSON file` attempts to create/update items, and returns information about which ones were successfully updated and which ones failed. Requires a new function `importItemsFromFile(inputFilePath)`
- Add the action - `import items from a JSON string` attempts to create/update items, and returns information about which ones were successfully updated and which ones failed. Requires a new function `importItemsFromString(string)`

## Authors

Created and maintained by [Meir Gabay](https://github.com/unfor19)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/unfor19/aws-webui/blob/master/LICENSE) file for details
