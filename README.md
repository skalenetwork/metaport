# SKALE Metaport Widget

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skalenetwork/metaport/publish.yml)
![npm](https://img.shields.io/npm/dm/@skalenetwork/metaport)
![NPM](https://img.shields.io/npm/l/@skalenetwork/metaport)
![GitHub top language](https://img.shields.io/github/languages/top/skalenetwork/metaport)

Metaport is a Typescript/Javascript widget that could be embeded into a web application to add IMA functionality to any SKALE dApp.


- [SKALE Metaport Widget](#skale-metaport-widget)
  - [Documentation](#documentation)
    - [Installation](#installation)
      - [npm](#npm)
      - [Yarn](#yarn)
    - [Integration](#integration)
    - [Initialization options](#initialization-options)
    - [Functions](#functions)
      - [Transfer](#transfer)
    - [Tips \& tricks](#tips--tricks)
      - [SKALE Network Options](#skale-network-options)
      - [Automatic M2S token lookup](#automatic-m2s-token-lookup)
      - [Locking a token](#locking-a-token)
      - [Locking chains](#locking-chains)
      - [Adding Mainnet \& ETH](#adding-mainnet--eth)
      - [Autowrap for tokens](#autowrap-for-tokens)
      - [Usage with SSR](#usage-with-ssr)
      - [Token icons](#token-icons)
      - [Type definitions](#type-definitions)
      - [Dataclasses](#dataclasses)
    - [Events](#events)
      - [Available Events](#available-events)
    - [UI Customization](#ui-customization)
      - [Themes](#themes)
      - [Position](#position)
      - [zIndex](#zindex)
  - [Development](#development)
    - [Debug mode](#debug-mode)
    - [Storybook setup](#storybook-setup)
    - [Linter](#linter)
      - [Linter git hook](#linter-git-hook)
  - [Security and Liability](#security-and-liability)
  - [License](#license)


## Documentation

### Installation

#### npm

```bash
npm install --save @skalenetwork/metaport
```

#### Yarn

```bash
yarn add @skalenetwork/metaport
```

### Integration

You can import Metaport into any modern web application (Vue/React/Angular/etc).

1. Add empty div with `metaport` id in the root page of your application:

```html
<div id='metaport'></div>
```

2. Import metaport library and init the object:

```Javascript
import { Metaport } from '@skalenetwork/metaport';

const metaport = new Metaport(METAPORT_OPTIONS);
```

### Initialization options

All currently available options are listed below:

```Javascript
const metaport = new Metaport({
    openOnLoad: true, // Open Metaport on load (optional, default = false)
    openButton: false, // Show open/close action button (optional, default = true)
    autoLookup: false, // Automatic token lookup for M2S tokens (default = true)
    mainnetEndpoint: MAINNET_ENDPOINT, // Ethereum Mainnet endpoint, required only for M2S or S2M transfers (optional, default = null)
    skaleNetwork: 'staging3', // SKALE network that will be used - mainnet, staging, or staging3 (optional, defualt = mainnet)
    debug: false, // Enable debug mode (optional, default = false)
    chains: [ // List of SKALE Chains that will be available in the Metaport UI (default = [])
        'chainName1',
        'chainName2',
        'chainName3'
    ],
    chainsMetadata: { // Chain name aliases that will be displayed in the UI (optional, defualt = {})
        'chainName1': {
            alias: 'Europa SKALE Chain', // optional
            minSfuelWei: '27000000000000', // optional
            faucetUrl: '[FAUCET_URL]' // optional
        },
        ...
    },
    tokens: { // List of tokens that will be available in the Metaport UI (default = {})
        'chainName2': { // chain name where token origin deployed (mainnet or SKALE Chain name)
            'erc20': { // token type (erc20 and eth are supported)
                '_[TOKEN_SYMBOL]_[TOKEN_ORIGIN_ADDRESS]': { // token keyname (composed from token symbol and origin token address)
                    'name': 'TOKEN_NAME1', // token display name
                    'address': '0x0357', // token origin address
                    'symbol': '[TOKEN_SYMBOL]' // token symbol
                    'cloneSymbol': 'CTST' // optional, symbol of the clone token
                    'iconUrl': 'https://example.com/my_token_icon.png', // optional
                    'decimals': '6' // optional (default = '18')
                }               
            }
        }
    },
    theme: { // custom widget theme (default = dark SKALE theme)
        primary: '#00d4ff', // primary accent color for action buttons
        background: '#0a2540', // background color
        mode: 'dark' // theme type - dark or light
    }
});
```

> You can skip almost all initialization options and set available tokens, chains and theme after Metaport initialization.

Reference Metaport config can be found [here](https://github.com/skalenetwork/bridge-ui/blob/main/env/mainnet/metaportConfig.json).

### Functions

#### Transfer

When sending a transfer request you can specify token and chains or keep ones that are already selected in the Metaport UI.

```Typescript
import { interfaces, dataclasses } from '@skalenetwork/metaport';

// token keyname is composed from token symbol and origin token address
const tokenKeyname = `_${tokenSymbol}_${tokenAddress}`;

const params: interfaces.TransferParams = {
    tokenId: tokenId, // for erc721, erc721meta and erc1155 tokens
    amount: amount, // amount to transfer (in wei) - for eth, erc20 and erc1155 tokens
    chains: chains, // 'from' and 'to' chains (must be present in the list on chains)
    tokenKeyname: tokenKeyname, // token that you want to transfer
    tokenType: dataclasses.TokenType.erc1155, // available TokenTypes are eth, erc20, erc721, erc721meta and erc1155
    lockValue: true, // optional, boolean - lock the amount in the Metaport UI
    text: 'Transfer text', // optional, string - text that will be displayed in the Metaport UI
    route: { // optional, interfaces.RouteParams - only for transfers with routing
        hub: 'hub', // string - name of the hub chain
        tokenKeyname: tokenKeyname, // token keyname on the hub chain
        tokenType: dataclasses.TokenType.erc1155 // token type on the hub chain
    },
    fromApp: 'ruby', // optional, string - name of the application on the source chain
    toApp: 'nftrade', // optional, string - name of the application on the destination chain
};
props.metaport.transfer(params);
```

Once transfer request will be fully processed, you will receive `metaport_transferRequestCompleted` event (see Events section for more details).

On each transfer completion will be completed, you will receive `metaport_transferComplete` event (see Events section for more details).

### Tips & tricks

#### SKALE Network Options

> Default is Mainnet

By default, Metaport is linked to the Ethereum Mainnet, however, Metaport can also be configured to
work with the Ethereum Goerli Testnet (SKALE Staging). The valid options for skaleNetwork are:

| Network Name | Config Value | Active  | Default |
| ------------ | ------------ | ------- | ------- |
| Ethereum     | **mainnet**  | **Yes** | **Yes** |
| Goerli       | staging3     | Yes     | No      |
| Rinkeby      | staging      | No      | No      |

```javascript
const metaport = new Metaport({
  ...
  skaleNetwork: "staging3" // or "mainnet"
  ...
})
```

#### Automatic M2S token lookup

> Only for tokens with origin on Mainnet

By default, automatic token lookup is enabled for Mainnet to SKALE Chain transfers. You can disable
it by setting `autoLookup` value to `false`. Also, you can override info retrieved by the automatic 
lookup by adding token to the tokens list in the following way: `_{TOKEN_SYMBOL}_{TOKEN_ADDRRESS}`:

```javascript
const TOKENS_OVERRIDE = {
  'mainnet': {
    'erc20': {
      "_TST_0x123456": {
        "name": "MY TEST TOKEN",
        "iconUrl": "https://example.com/test.png",
        "decimals": "6"
      }
  }
};

const metaport = new Metaport({
    ...
    autoLookup: true,
    tokens: TOKENS_OVERRIDE
    ...
})
```


#### Locking a token

If you're passing multiple tokens to Metaport constructor or to `updateParams` function they will be available in the dropdown menu and no token will be selected by default. 

If you want to lock user on a specific token, pass a single entry to `tokens` param:

```Javascript
const metaport = new Metaport({
    ...,
    tokens: {
        'chainName2': {
            'erc20': { 
                'tst': { 
                    'name': 'TEST_TOKEN',
                    'address': '0x0357'
                }
            }
        }
    }
})
```

Same works for `updateParams` function:

```Javascript
metaport.updateParams({tokens: {
    'chainName2': {
        'erc20': { 
            'tst': { 
                'name': 'TEST_TOKEN',
                'address': '0x0357'
            }               
        }
    }}});
```

Now token `tst` will be pre-selected and locked in the Metaport UI.


#### Locking chains

If you're passing more that 2 chains to Metaport constructor or to `updateParams` function they will be available in the dropdown menu and no chain will be selected by default. 

If you want to perform/request transfer from one particular chain to another, pass exactly 2 chain names to `schain` param:

```Javascript
const metaport = new Metaport({
    ...,
    chains: [
        'chainName1', // this one will be set as 'From' chain
        'chainName2' // this one will be set as 'To' chain
    ],
})
```

You can use the same approach for `updateParams` and `transfer` functions.

#### Adding Mainnet & ETH

ETH clone is already pre-deployed on each chain. You can enable it for any chain by adding the following config:

```Javascript
const metaport = new Metaport({
    ...,
    chains: ['mainnet', 'chainName1']
    tokens: {
        "mainnet": {  "eth": {
        "chains": [
          "chainName1" // list of chains where ETH trasfer will be available
        ]
      }}
    }
})
```

With this setup you will have `ETH` as a pre-selected asset, `Mainnet` as `From` network and `chainName1` as `To` network. To switch transfer direction just reorder chains: `['chainName1', 'mainnet']`.


#### Autowrap for tokens

To wrap tokens before transfer (for example to wrap ETHC before transfer to other chain) you need to specify token wrapped token info (address):

```Javascript
const TRANSFER_PARAMS = {
    amount: '1000',
    chains: ['chainName1', 'chainName2'],
    tokens: {
        'chainName1': {
            'erc20': {
                '_WRETH_0x123': { // wrapper token
                    'address': '0x0123', // wrapper token address
                    'name': 'wreth', // wrapper token display name
                    'symbol': 'WRETH', // wrapper token symbol
                    'wraps': { // token that needs to be wrapped
                        'address': '0xD2Aaa00700000000000000000000000000000000', // unwrapped token address
                        'symbol': 'ethc', // unwrapped token symbol
                        'iconUrl': '' // optional, icon URL for the origin token
                    }
                }
            }
        }
    }
}
metaport.transfer(TRANSFER_PARAMS);
```

You can use the same approach for `updateParams` and or during Metaport init.


#### Usage with SSR

Metaport has browser-only build, so to use it in an application that uses server-side rendering
you need to adapt it using trick described [here](https://nextjs.org/docs/advanced-features/dynamic-import#with-external-libraries).

Here is an example of Metaport import & usage in next.js app with SSR:

```Javascript
// in react component

const [metaport, setMetaport] = React.useState();

async function loadMetaport() {
    const Metaport = (await import('@skalenetwork/metaport')).Metaport;
    setMetaport(new Metaport({
      openOnLoad: true,
      skaleNetwork: 'staging',
      chains: ['mainnet', 'chainName1'],
      tokens: {'mainnet': {'eth': {}}}
    }));
}

useEffect(() => {
    loadMetaport();
}, []);

useEffect(() => {
    if (metaport) {
      console.log('metaport widget initialized');
    }
}, [metaport]);
```

#### Token icons

Metaport has built-in support for 471 well-known tokens. If token icon is not available for your
token, default Ethereum icon will be used.  

Also, it's possible to set a custom token icon by adding `iconUrl` option to the token definition:

```javascript
const TOKENS = {
  'SCHAIN_NAME': {
    'erc20': {
      'mytkn': {
        'name': 'MYTKN',
        'address': '0x123456',
        'iconUrl': 'https://example.com/my_token_icon.png'
      },
    }
  }
};
```

#### Type definitions

You can import interface definitions for the Metaport config and other data structures:

```typescript
import { interfaces } from '@skalenetwork/metaport';

const theme: interfaces.MetaportTheme = {
    primary: '#00d4ff',
    background: '#0a2540',
    mode: 'dark'
}

const config: interfaces.MetaportConfig = {
    skaleNetwork: 'staging',
    theme: theme
}
```

#### Dataclasses

You can import dataclasses types for the Metaport:

```typescript
import { dataclasses } from '@skalenetwork/metaport';

const params: interfaces.TransferParams = {
    amount: amount,
    chains: chains,
    tokenKeyname: tokenKeyname,
    tokenType: dataclasses.TokenType.erc20,
};
```


### Events

You can receive data from the Metaport widget using in-browser events.

Here's an example that demonstrates how you can subscribe to events in your dApp:

```Javascript
window.addEventListener(
    "metaport_transferComplete",
    transferComplete,
    false
);

function transferComplete(e) {
    console.log('received transfer complete event, transaction hash: ' + e.details.tx);
}
```

#### Available Events

- `metaport_transferComplete`: `{tokenSymbol, from, to, tx}` - emited when a single transfer is completed and funds are minted on destination chain
- `metaport_transferRequestCompleted`: `{interfaces.transferRequest}` - emited when the transfer request is completed and funds are minted on destination chain
- `metaport_unwrapComplete`: `{tokenSymbol, chain, tx}` - emited when unwrap transaction is mined
- `metaport_ethUnlocked`: `{tx}` - emited when ETH unlock transaction is mined (on Mainnet and only for ETH)
- `metaport_connected`: `{}` - emited when widget is initialized on a page
- `metaport_balance`: `{tokenSymbol, schainName, balance}` - emited when token balance is retrieved in Metaport widget (after init, after transfer and on request)

### UI Customization

#### Themes

You can easily modify Metaport color scheme by providing a theme:

```Javascript
// option 1: during the init
const metaport = new Metaport({
    ...
    theme: {
        primary: '#00d4ff', // primary accent color for action buttons
        background: '#0a2540', // background color
        mode: 'dark' // theme type - dark or light
    }
});

// option 2: on the fly (e.g. when user switches theme on your dApp):
metaport.setTheme({
    primary: '#e41c5d',
    background: '#ffffff',
    mode: 'light'
});
```

By default, SKALE dark theme will be used. You can also set `{mode: 'light'}` witout any additional param to use default SKALE light theme.

#### Position

By default, Metaport widget is located in the bottom right corner of the screen, with `20pt` margin.
You can customize widget position by providing `position` to the `theme` object:

```typescript
import { Metaport, interfaces, dataclasses } from '@skalenetwork/metaport';

const theme: interfaces.MetaportTheme = {
    mode: 'dark',
    position: dataclasses.Positions.topLeft
}
```

You can use of four predefined values: `topLeft`, `topRight`, `bottomRight`, `bottomLeft` or provide your custom values in the following format:

```typescript
import { dataclasses } from '@skalenetwork/metaport';
const customPosition: dataclasses.Position = {
    top: '50pt',
    bottom: 'auto',
    left: '70pt',
    right: 'auto'
}
const theme: interfaces.MetaportTheme = {
    mode: 'dark',
    position: customPosition
}
```

#### zIndex

By default, Metaport widget has base z-index equal to `99000`, though it can be configured in the Metaport theme:

```typescript
import { Metaport, interfaces } from '@skalenetwork/metaport';

const theme: interfaces.MetaportTheme = {
    mode: 'dark',
    zIndex: 2007 // custom zIndex
}
```

MUI components will be arranged using the following formula: `BASE_Z_INDEX + i * Z_INDEX_STEP`, where `Z_INDEX_STEP = 50`.
See MUI zIndex reference [here](https://mui.com/material-ui/customization/default-theme/?expand-path=$.zIndex).

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

![GitHub](https://img.shields.io/github/license/skalenetwork/skale.py.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).
