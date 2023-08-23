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
import { MainnetChain, SChain } from '@skalenetwork/ima-js'

import * as interfaces from '../core/interfaces'
import { Station, StationData } from '../core/sfuel'
import MetaportCore from '../core/metaport'


interface SFuelState {
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

  sFuelStatus: 'action' | 'warning' | 'error';
  setSFuelStatus: (status: 'action' | 'warning' | 'error') => void

  sFuelOk: boolean
  setSFuelOk: (loading: boolean) => void

  fromStationData: StationData;
  setFromStationData: (data: StationData) => void;

  toStationData: StationData;
  setToStationData: (data: StationData) => void;

  hubStationData: StationData;
  setHubStationData: (data: StationData) => void;
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
  setSFuelOk: (sFuelOk: boolean) => set(() => ({ sFuelOk: sFuelOk })),

  fromStationData: { ok: false, balance: null },
  setFromStationData: (data: StationData) => set({ fromStationData: data }),

  toStationData: { ok: false, balance: null },
  setToStationData: (data: StationData) => set({ toStationData: data }),

  hubStationData: { ok: false, balance: null },
  setHubStationData: (data: StationData) => set({ hubStationData: data }),
}))
