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
 * @file ErrorMessages.ts
 * @copyright SKALE Labs 2022-Present
 */

import React from 'react';

import LinkOffIcon from '@mui/icons-material/LinkOff';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ErrorIcon from '@mui/icons-material/Error';


export class BaseErrorMessage {

    icon: React.ReactElement;
    text: string;
    btnText?: string;
    fallback?: Function;

    constructor(fallback?: Function) {
        this.fallback = fallback;
    }
}


export class NoTokenPairsMessage extends BaseErrorMessage {
    constructor() {
        super();
        this.icon = <LinkOffIcon />;
        this.text = 'No token pairs for these chains';
    }
}


export class WrongNetworkMessage extends BaseErrorMessage {
    constructor(fallback: Function) {
        super(fallback);
        this.icon = <PublicOffIcon />;
        this.text = 'Looks like you are connected to the wrong network';
        this.btnText = 'Switch network';
    }
}


export class TransactionErrorMessage extends BaseErrorMessage {
    constructor(text: string, fallback: Function) {
        super(fallback);
        this.icon = <SentimentVeryDissatisfiedIcon />;
        this.text = text;
        this.btnText = 'Try again';
    }
}


export class CustomErrorMessage extends BaseErrorMessage {
    constructor(text: string) {
        super(undefined);
        this.icon = <ErrorIcon />;
        this.text = text;
    }
}
