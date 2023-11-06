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
 * @file SFuelStore.ts
 * @copyright SKALE Labs 2023-Present
 */

import { create } from 'zustand'
import { Station } from '../core/sfuel'

export interface SFuelState {
  loading: boolean
  setLoading: (loading: boolean) => void
  mining: boolean
  setMining: (loading: boolean) => void

  fromChainStation: Station
  setFromChainStation: (station: Station) => void

  toChainStation: Station
  setToChainStation: (station: Station) => void

  hubChainStation: Station
  setHubChainStation: (station: Station) => void

  sFuelStatus: 'action' | 'warning' | 'error'
  setSFuelStatus: (status: 'action' | 'warning' | 'error') => void

  sFuelOk: boolean
  setSFuelOk: (loading: boolean) => void
}

export const useSFuelStore = create<SFuelState>()((set, get) => ({
  loading: true,
  setLoading: (loading: boolean) => set(() => ({ loading: loading })),
  mining: false,
  setMining: (mining: boolean) => set(() => ({ mining: mining })),

  fromChainStation: undefined,
  setFromChainStation: (station: Station) => set({ fromChainStation: station }),

  toChainStation: undefined,
  setToChainStation: (station: Station) => set({ toChainStation: station }),

  hubChainStation: undefined,
  setHubChainStation: (station: Station) => set({ hubChainStation: station }),

  sFuelStatus: 'action',
  setSFuelStatus: (status: 'action' | 'warning' | 'error') => set({ sFuelStatus: status }),

  sFuelOk: false,
  setSFuelOk: (sFuelOk: boolean) => set(() => ({ sFuelOk: sFuelOk }))
}))
