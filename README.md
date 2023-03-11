# SKALE Metaport Widget

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skalenetwork/metaport/publish.yml)
![npm](https://img.shields.io/npm/dm/@skalenetwork/metaport)
![NPM](https://img.shields.io/npm/l/@skalenetwork/metaport)
![GitHub top language](https://img.shields.io/github/languages/top/skalenetwork/metaport)

Metaport is a Typescript/Javascript widget that can be embedded into a web application to add IMA functionality to any SKALE dApp.


- [SKALE Metaport Widget](#skale-metaport-widget)
  - [Documentation](#documentation)
    - [Installation](#installation)
      - [npm](#npm)
      - [Yarn](#yarn)
  - [Development](#development)
    - [Debug mode](#debug-mode)
    - [Storybook setup](#storybook-setup)
    - [Linter](#linter)
      - [Linter git hook](#linter-git-hook)
  - [Security and Liability](#security-and-liability)
  - [License](#license)


## Documentation

https://docs.skale.network

### Installation

#### npm

```bash
npm install --save @skalenetwork/metaport
```

#### Yarn

```bash
yarn add @skalenetwork/metaport
```

## Development

### Debug mode

To enable debug mode, set `debug` environment variable to `true`:

```Javascript
const metaport = new Metaport({
    ...
    debug: false // Enable debug mode (optional, default = false)
    ...
});
```

Additionally, you can enable debug logs in developer console by enabling `Verbose` level of logs.

### Storybook setup

```
yarn install
npx sb init --builder webpack5
yarn run storybook
```

### Linter

Used linter: https://palantir.github.io/tslint/  

Install the global CLI and its peer dependency:

```shell
yarn global add tslint typescript
```

#### Linter git hook

Be sure to add pre-commit git hook:

```shell
echo 'yarn lint' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Security and Liability

The Metaport UI and code is WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## License

![GitHub](https://img.shields.io/github/license/skalenetwork/metaport.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).
