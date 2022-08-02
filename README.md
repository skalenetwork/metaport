# SKALE Metaport Widget

<div align="center">
  <br><img src="https://global-uploads.webflow.com/625c39b93541414104a1d654/625c68f38c04ec14737f2ad8_svg-gobbler%20(3)%201.svg"><br><br>
</div>

-----------------

<br>

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

Metaport is a Typescript/Javascript widget that could be embeded into a web application to add IMA functionality to any SKALE dApp.

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

You can import Metaport into any modern web application (Vue/React/Angular/etc) and init the object:

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
    schains: [ // List of SKALE Chains that will be available in the Metaport UI (default = [])
        'chainName1',
        'chainName2',
        'chainName3'
    ],
    schainAliases: { // Chain name aliases that will be displayed in the UI (optional, defualt = {})
        'chainName1': 'Europa SKALE Chain',
        'chainName2': 'NFT Hub'
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
    schains: ['chainName1', 'chainName2'], // 'from' and 'to' chains
    tokens: { // optional, if token is already selected in the Metaport UI
        'chainName1': {
            'erc20': {
                'tst': {
                    'address': '0x0777',
                    'name': 'TEST_TOKEN'
                }
            }
        }
    }
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

#### Swap

Will be available soon.

```Javascript
metaport.swap(SWAP_PARAMS);
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

If you want to perform/request transfer from one particulat chain to another, pass exactly 2 chains to `schain` param:

```Javascript
const widget = new Metaport({
    ...,
      schains: [
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
    schains: ['mainnet', 'chainName1']
    tokens: {
        'mainnet': { 'eth': {} }
    }
})
```

With this setup you will have `ETH` as a pre-selected asset, `Mainnet` as `From` network and `chainName1` as `To` network. To switch transfer direction just reorder chains: `['chainName1', 'mainnet']`.


#### Autowrap for tokens

todo!

### Events

```bash
b
```

## Development

### Storybook setup

```
yarn install
npx sb init --builder webpack5
yarn run storybook
```
