import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

import ChainApps from './ChainApps'
import ChainIcon from './ChainIcon'

import { MetaportConfig } from '../core/interfaces'

import { getChainAlias, getChainAppsMeta } from '../core/helper'
import { cls, cmn, styles } from '../core/css'

import SkPaper from './SkPaper'


export default function ChainsList(props: {
  config: MetaportConfig
  expanded: string | false
  setExpanded: (expanded: string | false) => void
  setChain: (chain: string) => void
  chain: string
  setApp: (chain: string) => void
  app: string
  chains: string[]
  disabledChain: string
  from?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    props.setExpanded(isExpanded ? panel : false)
  }

  const schainNames = []

  for (let chain of props.chains) {
    const isHub = chain == props.chain && getChainAppsMeta(props.chain, props.config.skaleNetwork)
    if (chain !== props.disabledChain && (chain != props.chain || isHub)) {
      schainNames.push(chain)
    }
  }

  function handle(schainName: string, app?: string) {
    props.setExpanded(false)
    props.setChain(schainName)
    props.setApp(app)
  }

  const size = props.size ?? 'sm'

  return (
    <div>
      <Accordion
        expanded={props.expanded === 'panel1'}
        onChange={handleChange('panel1')}
        disabled={props.disabled}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={styles.accordionSummary}
        >
          {props.chain ? (
            <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv)}>
              <div
                className={cls(
                  cmn.flex,
                  cmn.flexc,
                  [cmn.mri10, size === 'sm'],
                  [cmn.mri15, size === 'md']
                )}
              >
                <ChainIcon
                  skaleNetwork={props.config.skaleNetwork}
                  chainName={props.chain}
                  size={size}
                  app={props.app}
                />
              </div>
              <p
                className={cls(
                  cmn.p,
                  [cmn.p2, size === 'md'],
                  [cmn.p3, size === 'sm'],
                  [cmn.p700, size === 'md'],
                  [cmn.p600, size === 'sm'],
                  cmn.cap,
                  cmn.pPrim,
                  cmn.mri10,
                  cmn.pWrap
                )}
              >
                {getChainAlias(props.config.skaleNetwork, props.chain, props.app)}
              </p>
              <div className={cls(cmn.flex, cmn.flexg)}></div>
              <div className={cls(cmn.flex, cmn.flexc)}>
                {props.app ? (
                  <SkPaper gray className={cls(cmn.mri10, cmn.nop)}>
                    <p
                      className={cls(
                        cmn.p,
                        [cmn.p4, size === 'md'],
                        [cmn.p4, size === 'sm'],
                        cmn.p600,
                        cmn.pSec,
                        cmn.mtop5,
                        cmn.mbott5,
                        cmn.mleft10,
                        cmn.mri10,
                        cmn.pWrap
                      )}
                    >
                      on {getChainAlias(props.config.skaleNetwork, props.chain)?.split(' ')[0]}
                    </p>
                  </SkPaper>
                ) : null}
              </div>
            </div>
          ) : (
            <div className={cls(cmn.flex, cmn.flexcv)}>
              <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
                <ChainIcon skaleNetwork={props.config.skaleNetwork} chainName={props.chain} />
              </div>
              <p className={cls(cmn.flex, cmn.p3, cmn.p600, cmn.p, cmn.pPrim, cmn.mri10)}>
                Transfer {props.from ? 'from' : 'to'}...
              </p>
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={cls(cmn.chainsList, cmn.mbott10, cmn.mri10)}
            style={{ marginLeft: '8px' }}
          >
            {/* <div className={cls([cmn.mleft5, size === 'md'])} style={{ marginTop: '-15px' }}>
              <ChainApps skaleNetwork={props.config.skaleNetwork} chain={props.chain} size={size} handle={handle} />
            </div> */}
            {schainNames.map((name) => (
              <Typography key={name}>
                <Button
                  color="secondary"
                  size="medium"
                  onClick={() => handle(name)}
                  className={cls(cmn.fullWidth)}
                >
                  <div
                    className={cls(
                      cmn.flex,
                      cmn.flexcv,
                      [cmn.mtop5, size === 'sm'],
                      [cmn.mbott5, size === 'sm'],
                      [cmn.mtop10, size === 'md'],
                      [cmn.mbott10, size === 'md'],
                      cmn.fullWidth
                    )}
                  >
                    <div
                      className={cls(
                        cmn.flex,
                        cmn.flexc,
                        [cmn.mri10, size === 'sm'],
                        [cmn.mri15, size === 'md'],
                        cmn.mleft10,
                        cmn.pPrim
                      )}
                    >
                      <ChainIcon
                        skaleNetwork={props.config.skaleNetwork}
                        chainName={name}
                        size={size}
                      />
                    </div>
                    <p
                      className={cls(
                        cmn.flex,
                        cmn.p,
                        [cmn.p2, size === 'md'],
                        [cmn.p3, size === 'sm'],
                        [cmn.p700, size === 'md'],
                        [cmn.p600, size === 'sm'],
                        cmn.cap,
                        cmn.pPrim,
                        cmn.mri10
                      )}
                    >
                      {getChainAlias(props.config.skaleNetwork, name)}
                    </p>
                    <div className={cls(cmn.flex, cmn.flexg)}></div>
                    <KeyboardArrowRightRoundedIcon className={cls(cmn.mri5, cmn.pPrim)} />
                  </div>
                </Button>
                <div className={cls([cmn.mleft5, size === 'md'])}>
                  <ChainApps
                    skaleNetwork={props.config.skaleNetwork}
                    chain={name}
                    handle={handle}
                    size={size}
                  />
                </div>
              </Typography>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
