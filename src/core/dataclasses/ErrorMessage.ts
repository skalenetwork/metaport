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
 * @file ErrorMessage.ts
 * @copyright SKALE Labs 2022-Present
 */



export class ErrorMessage {

    icon: string
    text: string
    btnText?: string
    fallback?: Function

    constructor(fallback?: Function) {
        this.fallback = fallback
    }
}


export class NoTokenPairsMessage extends ErrorMessage {
    constructor() {
        super()
        this.icon = 'link-off'
        this.text = 'No token pairs for these chains'
    }
}


export class WrongNetworkMessage extends ErrorMessage {
    constructor(fallback: Function) {
        super(fallback)
        this.icon = 'public-off'
        this.text = 'Looks like you are connected to the wrong network'
        this.btnText = 'Switch network'
    }
}


export class TransactionErrorMessage extends ErrorMessage {
    constructor(text: string, fallback: Function) {
        super(fallback)
        this.icon = 'sentiment'
        this.text = text
        this.btnText = 'Try again'
    }
}


export class CustomErrorMessage extends ErrorMessage {
    constructor(text: string) {
        super(undefined)
        this.icon = 'error'
        this.text = text
    }
}
