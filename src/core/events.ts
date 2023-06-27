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
 * @file events.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug';
import * as interfaces from './interfaces/index';
import { ActionState } from './actions/actionState';


debug.enable('*');
const log = debug('metaport:core:events');


function dispatchEvent(name: string, data = {}) {
    log(`dispatchEvent - sending: ${name}`);
    window.dispatchEvent(new CustomEvent(name, { detail: data }));
    log(`dispatchEvent - sent: ${name}`);
}


export namespace externalEvents {
    export function balance(tokenSymbol: string, schainName: string, _balance: string) {
        dispatchEvent('metaport_balance', {
            "tokenSymbol": tokenSymbol,
            "schainName": schainName,
            "balance": _balance
        });
    }

    export function transferComplete(
        tx: string,
        chainName1: string,
        chainName2: string,
        tokenSymbol: string,
        unwrap: boolean = false
    ) {
        dispatchEvent('metaport_transferComplete', {
            'tokenSymbol': tokenSymbol,
            'from': chainName1,
            'to': chainName2,
            'tx': tx,
            'unwrap': unwrap
        });
    }

    export function transferRequestCompleted(transferRequest: interfaces.TransferParams) {
        dispatchEvent('metaport_transferRequestCompleted', { 'transferRequest': transferRequest });
    }

    export function transactionCompleted(
        txData: any,
        timestamp: string | number,
        chainName: string,
        txName: string
    ): void {
        log('WARNING: Event metaport_transactionCompleted will be removed in the next version')
        dispatchEvent(
            'metaport_transactionCompleted',
            {
                tx: {
                    gasUsed: txData.gasUsed,
                    transactionHash: txData.transactionHash
                },
                timestamp,
                chainName,
                txName
            }
        );
    }

    export function actionStateUpdated(
        actionName: string,
        actionState: ActionState,
        actionData: {
            chainName1: string,
            chainName2: string,
            address: string,
            amount: string,
            amountWei: string,
            tokenId: number
        },
        transactionHash?: string,
        timestamp?: string | number
    ): void {
        dispatchEvent(
            'metaport_actionStateUpdated',
            {
                actionState,
                actionName,
                actionData,
                transactionHash,
                timestamp
            }
        );
    }

    export function unwrapComplete(
        tx: string,
        chainName1: string,
        tokenSymbol: string,
    ) {
        dispatchEvent('metaport_unwrapComplete', {
            'tokenSymbol': tokenSymbol,
            'chain': chainName1,
            'tx': tx
        });
    }

    export function ethUnlocked(tx: string) {
        dispatchEvent('metaport_ethUnlocked', {
            'tx': tx
        });
    }

    export function connected() {
        dispatchEvent('metaport_connected');
    }
}

export namespace internalEvents {
    export function updateParams(params) {
        dispatchEvent('_metaport_updateParams', {
            'tokens': params.tokens,
            'chains': params.chains
        });
    }

    export function transfer(params: interfaces.TransferParams): void {
        dispatchEvent('_metaport_transfer', {
            'params': params
        });
    }

    export function wrap(params) {
        dispatchEvent('_metaport_wrap', {
            'amount': params.amount,
            'chain': params.chain,
            'tokens': params.tokens
        });
    }

    export function unwrap(params) {
        dispatchEvent('_metaport_unwrap', {
            'amount': params.amount,
            'chain': params.chain,
            'tokens': params.tokens
        });
    }

    export function swap(params) {
        dispatchEvent('_metaport_swap', {
            'amount': params.amount,
            'chain': params.chain,
            'tokens': params.tokens // todo!
        });
    }

    export function close() {
        dispatchEvent('_metaport_close');
    }

    export function open() {
        dispatchEvent('_metaport_open');
    }

    export function reset() {
        dispatchEvent('_metaport_reset');
    }

    export function requestBalance(params) {
        dispatchEvent('_metaport_requestBalance', {
            'schainName': params.schainName,
            'tokenSymbol': params.tokenSymbol
        });
    }

    export function setTheme(theme) {
        dispatchEvent('_metaport_setTheme', {
            'theme': theme
        });
    }
}