# aws-webui-docs

## Requirements

- [Node](https://nodejs.org/en/download/) 14.x+

## Getting Started

1. Install [vuedoc/md](https://github.com/vuedoc/md) globally
   ```bash
   yarn global add @vuedoc/parser @vuedoc/md
   ```
1. Add [JSDoc](https://jsdoc.app/) comments; see [vuedoc/md#examples](https://github.com/vuedoc/md#examples) to learn how
1. Generate docs with `vuedoc/md`
   ```bash
   yarn docs
   ```
1. Check the output directory `docs` for changes