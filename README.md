# SKALE Metaport Widget

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

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
      - [Wrap](#wrap)
      - [Unwrap](#unwrap)
    - [Tips & tricks](#tips--tricks)
      - [Locking a token](#locking-a-token)
      - [Locking chains](#locking-chains)
      - [Adding Mainnet & ETH](#adding-mainnet--eth)
      - [Autowrap for tokens](#autowrap-for-tokens)
      - [Usage with SSR](#usage-with-ssr)
    - [Events](#events)
      - [Available Events](#available-events)
    - [Themes](#themes)
  - [Development](#development)
    - [Storybook setup](#storybook-setup)


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

const widget = new Metaport(METAPORT_OPTIONS);
```

### Initialization options

All currently available options are listed below:

```Javascript
const widget = new Metaport({
    open: true, // Open Metaport on load (optional, default = false)
    mainnetEndpoint: MAINNET_ENDPOINT, // Ethereum Mainnet endpoint, required only for M2S or S2M transfers (optional, default = null)
    network: 'staging', // SKALE network that will be used - mainnet or staging (optional, defualt = mainnet)
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
                'symbol1': { // token symbol
                    'name': 'TOKEN_NAME1', // token display name
                    'address': '0x0357' // token origin address
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


### Functions

#### Transfer

When sending a transfer request you can specify token and chains or keep ones that are already selected in the Metaport UI.

```Javascript

const TRANSFER_PARAMS = {
    amount: '1000', // amount to transfer (in wei)
    chains: ['chainName1', 'chainName2'], // 'from' and 'to' chains
    tokens: { // optional, if token is already selected in the Metaport UI
        'chainName1': {
            'erc20': {
                'tst': {
                    'address': '0x0777',
                    'name': 'TEST_TOKEN'
                }
            }
        }
    },
    lockAmount: true // optional, boolean - lock the amount in the Metaport UI
}

metaport.transfer(TRANSFER_PARAMS);
```

Once transfer will be completed, you will receive `metaport_transferComplete` event (see Events section for more details).

#### Wrap

Wrap is not available as a separate action yet, please use wrap autodetection feature.

```Javascript
metaport.wrap(WRAP_PARAMS);
```

#### Unwrap

Will be available soon.

```Javascript
metaport.unwrap(UNWRAP_PARAMS);
```

### Tips & tricks

#### Locking a token

If you're passing multiple tokens to Metaport constructor or to `updateParams` function they will be available in the dropdown menu and no token will be selected by default. 

If you want to lock user on a specific token, pass a single entry to `tokens` param:

```Javascript
const widget = new Metaport({
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
const widget = new Metaport({
    ...,
    chains: [
        'chainName1', // this one will be set as 'From' chain
        'chainName2' // this one will be set as 'To' chain
    ],
})
```

You can use the same approach for `updateParams` and `transfer` functions.

#### Adding Mainnet & ETH

ETH clone is already pre-deployed on each chain, so to have it in the Metaport UI, you just need to specify token like that:

```Javascript
const widget = new Metaport({
    ...,
    chains: ['mainnet', 'chainName1']
    tokens: {
        'mainnet': { 'eth': {} }
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
                'wreth': { // wrapper token
                    'address': '0x0123', // wrapper token address
                    'name': 'wreth', // wrapper token display name
                    'wraps': { // token that needs to be wrapped
                        'address': '0xD2Aaa00700000000000000000000000000000000', // unwrapped token address
                        'symbol': 'ethc' // unwrapped token symbol
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
      open: true,
      network: 'staging',
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

- `metaport_transferComplete`: `{tokenSymbol, from, to, tx}` - emited when the transfer completed and funds are minted on destination chain
- `metaport_unwrapComplete`: `{tokenSymbol, chain, tx}` - emited when unwrap transaction is mined
- `metaport_ethUnlocked`: `{tx}` - emited when ETH unlock transaction is mined (on Mainnet and only for ETH)
- `metaport_connected`: `{}` - emited when widget is initialized on a page
- `metaport_balance`: `{tokenSymbol, schainName, balance}` - emited when token balance is retrieved in Metaport widget (after init, after transfer and on request)

### Themes

You can easily modify Metaport color scheme by providing a theme:

```Javascript
// option 1: during the init
const widget = new Metaport({
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

## Development

### Storybook setup

```
yarn install
npx sb init --builder webpack5
yarn run storybook
```
