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
 * @file WrappedTokensWarning.ts
 * @copyright SKALE Labs 2022-Present
 */

import Button from '@mui/material/Button';

import { View } from '../../core/dataclasses/View';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function WrappedTokensWarning(props) {
    if (!props.wrappedTokens || !props.wrappedTokens.erc20) return;
    const wrappedTokens = Object.entries(props.wrappedTokens.erc20);
    if (wrappedTokens.length === 0) return;
    return (<div>
        <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow, styles.mp__margTop20)}>
            ❗ You have wrapped tokens in your wallet. Please unwrap them before proceeding with your transfer.
        </p>
        <Button
            variant="contained" color="warning" size="medium"
            className={clsNames(styles.mp__btnAction, styles.mp__margTop20)}
            onClick={() => { props.setView(View.UNWRAP) }}
        //   startIcon={<MoveUpIcon />}
        >
            Click to unwrap stuck tokens
        </Button>
    </div>)
}
