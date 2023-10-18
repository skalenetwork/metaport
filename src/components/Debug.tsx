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
 * @file Debug.ts
 * @copyright SKALE Labs 2023-Present
 */

import Button from '@mui/material/Button'

import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useMetaportStore } from '../store/MetaportStore'
import { cls, cmn } from '../core/css'


export default function Debug() {

  const debug = useMetaportStore((state) => state.mpc.config.debug)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const amount = useMetaportStore((state) => state.amount)
  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)

  const rows = [
    { name: 'chainName1', value: chainName1 },
    { name: 'chainName2', value: chainName2 },
    { name: 'amount', value: amount },
    { name: 'stepsMetadata', value: JSON.stringify(stepsMetadata) },
  ]

  if (!debug) return
  return (
    <div className={cls(cmn.flex, cmn.flexcv)}>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell align="left">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

    </div>
  )
}
