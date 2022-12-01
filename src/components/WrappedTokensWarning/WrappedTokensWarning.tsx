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
import Button from '@mui/material/Button';
import MoveUpIcon from '@mui/icons-material/MoveUp';

import { OperationType } from '../../core/dataclasses/OperationType';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function WrappedTokensWarning(props) {
    if (!props.wrappedTokens || !props.wrappedTokens.erc20) return;
    const wrappedTokens = Object.entries(props.wrappedTokens.erc20);
    if (wrappedTokens.length === 0) return;
    return (<div>
        <Button
            variant="contained" color="warning" size="medium"
            className={clsNames(styles.mp__btnAction, styles.mp__margTop20)}
            onClick={() => { props.setOperationType(OperationType.unwrap) }}
            startIcon={<MoveUpIcon />}
        >
            Click to unwrap stuck tokens
        </Button>
    </div>)
}
