# aws-webui

[![Push to Docker Registries](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml/badge.svg)](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml)

**Work In Progress (WIP)** - This is me, trying to learn frontend

A Single Page Application to manage AWS resources efficiently.

## Requirements

- [Node](https://nodejs.org/en/download/) 14.x+
- [quaser CLI](https://quasar.dev/quasar-cli/installation) v3.x
- [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/) for testing locally with localstack
- (Optional) [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) - for modifying values via terminal
### Install the dependencies
```bash
yarn
```

## Getting Started

1. Fork/Clone this repo
1. Start localstack
    ```bash
    yarn localstack:up
    ```
1. Add parameters with AWS CLI (required until I add the `Add parameter` feature)
   ```bash
   yarn init-params:20
   ```
1. Start development server - will automatically open a new browser with hot-reload
   ```bash
   yarn serve
   ```

## Production Mode

### Run From Source Code

1. Fork/Clone this repo
1. Build the application
    ```bash
    yarn build
    ```
1. Install server dependencies (do it once)
   ```bash
   cd server && \
   yarn && \
   cd ..
   ```
1. Run application in production mode
   ```bash
   yarn serve:prod
   ```

### Run With Docker

#### Run Official Container

TODO: Add CI/CD to build and push to DockerHub

```bash
docker run --rm -it -p 8080:8080 unfor19/aws-webui
```

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

## TODO

- Add `Edit Item` Page - add `EditItemPage`, to get data use `get-parameter` and to set data `put-parameter`. The `get-parameter` and `get-parameter-history` to get more information than `get-parameters-by-path`.

## Authors

Created and maintained by [Meir Gabay](https://github.com/unfor19)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/unfor19/aws-webui/blob/master/LICENSE) file for details
