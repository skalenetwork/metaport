
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
 * @file BalanceBlock.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement } from "react";
import Skeleton from '@mui/material/Skeleton';
import styles from "../WidgetUI/WidgetUI.scss";
import { clsNames } from "../../core/helper";
import { fromWei } from '../../core/convertation';
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants';


export default function BalanceBlock(props: {
    icon: ReactElement,
    disabled?: boolean,
    balance: string | undefined,
    token: string | undefined,
    chainName: string,
    margTop?: boolean
}) {
    const displayedBalance = props.balance ? fromWei(
        props.balance as string,
        DEFAULT_ERC20_DECIMALS
    ).substring(0, 5) : null;
    const displayedToken = props.token ? props.token.toUpperCase() : null;

    return (<div className={clsNames(
        styles.sk__balanceCard,
        [styles.mp__margTop20, props.margTop]
    )}>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert)}>
            <div className={clsNames(styles.mp__margRi5, styles.mp__flex, styles.chainIcon)}>
                {props.icon}
            </div>
            <p className={clsNames(
                styles.mp__noMarg,
                styles.mp__p,
                styles.mp__p3,
                [styles.mp__disabledP, props.disabled]
            )}>
                Balance on {props.chainName}
            </p>
        </div>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margTop5)}>
            {props.balance ? (<p className={clsNames(
                styles.mp__noMarg,
                styles.mp__p,
                styles.mp__p2,
                styles.sk__colorText,
                [styles.mp__disabledP, props.disabled]
            )}>
                {displayedBalance} {displayedToken}
            </p>) : <Skeleton width='70px' />}
        </div>
    </div>)
}