/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file constants.ts
 * @copyright SKALE Labs 2022-Present
 */

export const MAINNET_CHAIN_NAME = 'mainnet';

export const ETH_ERC20_ADDRESS = '0xD2Aaa00700000000000000000000000000000000';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const M2S_POSTFIX = 'm2s';
export const S2M_POSTFIX = 's2m';
export const S2S_POSTFIX = 's2s';
export const WRAP_ACTION = 'wrap';
export const UNWRAP_ACTION = 'unwrap';

// tslint:disable-next-line
export const MAX_APPROVE_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935'; // (2^256 - 1 )

export const DEFAULT_MIN_SFUEL_WEI = '21000000000000';

export const DEFAULT_ERC20_DECIMALS = '18';
export const DEFAULT_ERROR_MSG = 'Ooops... Something went wrong...';

export const DEFAULT_MP_MARGIN = '20pt';
export const DEFAULT_MP_Z_INDEX = 99000;

export const HTTPS_PREFIX = 'https://';

export const MAINNET_EXPLORER_URLS: { [skaleNetwork: string]: string } = {
    mainnet: 'https://etherscan.io',
    staging3: 'https://goerli.etherscan.io/',
    legacy: 'https://goerli.etherscan.io/'
};

export const BASE_EXPLORER_URLS = {
    mainnet: "explorer.mainnet.skalenodes.com",
    staging3: "explorer.staging-v3.skalenodes.com",
    legacy: "explorer.staging-v3.skalenodes.com"
};

// ETA constants

export const GAS_STATION_API_ENDPOINT = 'https://ethgasstation.info/api/ethgasAPI.json?';

export const IMA_M2S_WAIT = 5;
export const IMA_S2S_WAIT = 2;
export const IMA_HUB_WAIT = 5;

// ETF constants

export const COINGECKO_API_ENDPOINT = '';

export const DEFAULT_FAUCET_URL = 'https://sfuel.skale.network/';
export const SFUEL_CHEKCS_INTERVAL = 8;

export const SFUEL_TEXT = {
    'sfuel': {
        'action': '',
        'warning': 'You may need sFUEL on the destination chain',
        'error': 'You need sFUEL to perform a transfer'
    },
    'gas': {
        'action': '',
        'warning': 'You may need ETH on the destination chain',
        'error': 'You need ETH to perform a transfer'
    }
};