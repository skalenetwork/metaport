import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import TokenBalance from './TokenBalance'
import { useMetaportStore } from '../store/MetaportStore'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'

export default function DestTokenBalance() {
  const { address } = useAccount()

  const token = useMetaportStore((state) => state.token)
  const destTokenBalance = useMetaportStore((state) => state.destTokenBalance)
  const updateDestTokenBalance = useMetaportStore((state) => state.updateDestTokenBalance)

  useEffect(() => {
    updateDestTokenBalance(address) // Fetch users immediately on component mount
    const intervalId = setInterval(() => {
      updateDestTokenBalance(address)
    }, BALANCE_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [updateDestTokenBalance, token, address])

  if (!token) return

  return (
    <TokenBalance
      balance={destTokenBalance}
      symbol={token.meta.symbol}
      decimals={token.meta.decimals}
    />
  )
}
