/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file TransactionData.ts
 * @copyright SKALE Labs 2023-Present
*/

import { ReactElement } from 'react';

import IconButton from '@mui/material/IconButton';

import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

import { getTxUrl } from '../../core/explorer';
import { MetaportConfig, TransactionHistory } from '../../core/interfaces';

import styles from "../WidgetUI/WidgetUI.scss";
import localStyles from "./TransactionData.scss";
import { clsNames } from '../../core/helper';


const actionIcons: { [actionName: string]: ReactElement; } = {
    'deposit': <ArrowOutwardIcon />,
    'transferToSchain': <ArrowOutwardIcon />,
    'wrap': <MoveDownIcon />,
    'unwrap': <MoveUpIcon />,
    'getMyEth': <LockOpenIcon />,
    'withdraw': <LogoutIcon />,
    'approve': <DoneRoundedIcon />,
    'approveWrap': <DoneRoundedIcon />,
}

export default function TransactionData(props: {
    transactionData: TransactionHistory,
    config: MetaportConfig
}) {
    const explorerUrl = getTxUrl(
        props.transactionData.chainName,
        props.config.skaleNetwork,
        props.transactionData.tx.transactionHash
    );
    return (<div className={clsNames(styles.mp__margBott10, styles.mp__flex, styles.mp__flexCenteredVert)} >
        <div>
            <div className={clsNames(
                localStyles.br__transactionDataIcon,
                styles.mp__flex,
                styles.mp__flexCentered,
                styles[`br__action_${props.transactionData.txName}`]
            )}>
                {actionIcons[props.transactionData.txName]}
            </div>
        </div>
        <div className={clsNames(styles.mp__margLeft20, styles.mp__flexGrow, styles.mp__flex)}>
            <div>
                <p className={clsNames(styles.mp__p, styles.mp__p2, styles.mp__capitalize, styles.sk__colorText)}>
                    {props.transactionData.txName}
                </p>
                <p className={clsNames(styles.mp__p, styles.mp__p3)}>
                    {new Date(props.transactionData.timestamp * 1000).toUTCString()}
                </p>
            </div>
        </div>
        <div>
            <IconButton
                id="basic-button"
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsNames(styles.mp__margLeft10, localStyles.sk__openExplorerBtn)}
            >
                <OpenInNewIcon className={styles.sk__colorText} />
            </IconButton>
        </div>
    </div>)
}
