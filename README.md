# aws-webui

[![Push to Docker Registries](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml/badge.svg)](https://github.com/unfor19/aws-webui/actions/workflows/docker-latest.yml)

A Single Page Application to manage AWS resources efficiently.

This application was built with:

- [TypeScript](https://www.typescriptlang.org/)
- [Vue v3](https://v3.vuejs.org/guide/introduction.html)
- [Quasar v2](https://v3.vuejs.org/guide/introduction.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)
  
## Requirements

- [Node](https://nodejs.org/en/download/) 14.x+
- [quasar CLI](https://quasar.dev/quasar-cli/installation) v3.x
- [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/) for testing locally with localstack
- (Optional) [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) - for modifying values via terminal

## Getting Started

### Quick Start

1. Download relevant files
   ```bash
   curl -sL -o docker-compose-localstack.yml "https://raw.githubusercontent.com/unfor19/aws-webui/master/docker-compose-localstack.yml"
   ```
1. Run application and LocalStack locally
   ```bash
   docker-compose -p awswebui --profile frontend -f docker-compose-localstack.yml up --detach
   ```
1. Open application in browser - [http://localhost:8080](http://localhost:8080)

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
1. Start localstack
   ```bash
   yarn localstack:up
   ```
2. Run application in production mode
   ```bash
   yarn serve:prod
   ```

### Docker

#### Run Official Container

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

## Contributing

Report issues/questions/feature requests on the [Issues](https://github.com/unfor19/terraform-aws-ssm-parameters/issues) section.

Pull requests are welcome! These are the steps:

1. Fork this repo
1. Install dependencies
   ```bash
   yarn install
   ```
1. Create your feature branch from master (`git checkout -b my-new-feature`)
1. Start localstack
    ```bash
    yarn localstack:up
    ```
1. Start development server - will automatically open a new browser with hot-reload
   ```bash
   yarn serve
   ```    
1. Add the code of your new feature; expand the above *Local Development* section to learn how
1. Commit your remarkable changes (`git commit -am 'Added new feature'`)
1. Push to the branch (`git push --set-up-stream origin my-new-feature`)
1. Create a new Pull Request and provide details about your changes

## Authors

Created and maintained by [Meir Gabay](https://github.com/unfor19)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/unfor19/aws-webui/blob/master/LICENSE) file for details
