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
 * @file Store.ts
 * @copyright SKALE Labs 2023-Present
 */

import { create } from 'zustand'

import * as interfaces from '../core/interfaces'

interface UIState {
  theme: interfaces.MetaportTheme
  setTheme: (theme: interfaces.MetaportTheme) => void
  open: boolean
  setOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  theme: null,
  setTheme: (theme: interfaces.MetaportTheme) => set(() => ({ theme: theme })),
  open: false,
  setOpen: (isOpen: boolean) => set(() => ({ open: isOpen })),
}))

interface CollapseState {
  expandedFrom: string | false
  setExpandedFrom: (expanded: string | false) => void
  expandedTo: string | false
  setExpandedTo: (expanded: string | false) => void

  expandedTokens: string | false
  setExpandedTokens: (expanded: string | false) => void
}

export const useCollapseStore = create<CollapseState>()((set) => ({
  expandedFrom: false,
  setExpandedFrom: (expanded: string | false) =>
    set(() => ({
      expandedFrom: expanded,
      expandedTo: false,
      expandedTokens: false,
    })),
  expandedTo: false,
  setExpandedTo: (expanded: string | false) =>
    set(() => ({
      expandedTo: expanded,
      expandedFrom: false,
      expandedTokens: false,
    })),
  expandedTokens: false,
  setExpandedTokens: (expanded: string | false) =>
    set(() => ({
      expandedTokens: expanded,
      expandedFrom: false,
      expandedTo: false,
    })),
}))
