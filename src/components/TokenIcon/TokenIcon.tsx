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
 * @file TokensIcon.ts
 * @copyright SKALE Labs 2023-Present
 */

import React from 'react';
import TollRoundedIcon from '@mui/icons-material/TollRounded';
import { TokenData } from '../../core/dataclasses';
import { tokenIconPath } from '../../core/metadata';

import styles from "../../styles/styles.scss";


export default function TokenIcon(props: {
  token?: TokenData,
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const size = props.size ?? 'sm';
  const className = styles[`chainIcon${size}`];
  if (props.token === undefined || props.token === null) {
    return <TollRoundedIcon />
    // return <img className={className} src={tokenIcon('eth')} />
  }
  return <img className={className} src={tokenIconPath(props.token)} />
}