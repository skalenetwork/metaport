
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
 * @file CustomStationUrl.ts
 * @copyright SKALE Labs 2023-Present
 */


import Link from '@mui/material/Link';

import { DEFAULT_FAUCET_URL } from '../../core/constants';

import { clsNames } from '../../core/helper';
import { StationData } from '../../core/sfuel';
import styles from "../WidgetUI/WidgetUI.scss";


export default function CustomStationUrl(props: {
    stationData: StationData,
    type: 'source' | 'destination' | 'hub'
}) {
    return (props.stationData && props.stationData.faucetUrl &&
        props.stationData.faucetUrl !== DEFAULT_FAUCET_URL ? <p className={clsNames(
            styles.mp__flex,
            styles.mp__p3,
            styles.mp__p,
            styles.mp__margTop10
        )}>
        🔗
        <Link target="_blank" rel="noopener noreferrer" href={props.stationData.faucetUrl}
            className={clsNames(styles.mp__margLeft5)} >
            Custom Faucet for {props.type} chain
        </Link>
    </p> : null)
}
