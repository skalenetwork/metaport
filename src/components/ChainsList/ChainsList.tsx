import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import ChainApps from '../ChainApps'
import ChainIcon from '../ChainIcon'

import { MetaportConfig } from '../../core/interfaces'

import { cls, getChainAlias } from '../../core/helper'
import cmn from '../../styles/cmn.module.scss'
import styles from '../../styles/styles.module.scss'

export default function ChainsList(props: {
  config: MetaportConfig
  expanded: string | false
  setExpanded: (expanded: string | false) => void
  setChain: (chain: string) => void
  chain: string
  chains: string[]
  disabledChain: string
  from?: boolean
  disabled?: boolean
}) {
  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    props.setExpanded(isExpanded ? panel : false)
  }

  const schainNames = []

  for (let chain of props.chains) {
    if (chain != props.disabledChain && chain != props.chain) {
      schainNames.push(chain)
    }
  }

  function handle(schainName) {
    props.setExpanded(false)
    props.setChain(schainName)
  }

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
              <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
                <ChainIcon skaleNetwork={props.config.skaleNetwork} chainName={props.chain} />
              </div>
              <Tooltip title={'SKALE Chain ' + props.chain}>
                <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mri10)}>
                  {getChainAlias(props.config.skaleNetwork, props.chain)}
                </p>
              </Tooltip>
              <div className={cls(cmn.flex, cmn.flexg)}></div>
              {/* <div className={cls(cmn.flex, cmn.flexc)}>
                <ChainApps
                  skaleNetwork={props.config.skaleNetwork}
                  chain={props.chain}
                />
              </div> */}
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
          <div className={cls(cmn.chainsList, cmn.mbott10, cmn.mri10)} style={{ marginLeft: '8px' }}>
            <div style={{ marginTop: '-17px' }}>
              <ChainApps skaleNetwork={props.config.skaleNetwork} chain={props.chain} />
            </div>
            {schainNames.map((name) => (
              <Typography key={name}>
                <Button color="secondary" size="medium" onClick={() => handle(name)} className={cls(cmn.fullWidth)}>
                  {/* <div className={cmn.padd10}>
                    
                  </div> */}
                  <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop5, cmn.mbott5, cmn.fullWidth)}>
                    <div className={cls(cmn.flex, cmn.flexc, cmn.mri10, cmn.mleft10, cmn.pPrim)}>
                      <ChainIcon skaleNetwork={props.config.skaleNetwork} chainName={name} />
                    </div>
                    <p className={cls(cmn.flex, cmn.p3, cmn.p, cmn.p600, cmn.cap, cmn.pPrim, cmn.mri10)}>
                      {getChainAlias(props.config.skaleNetwork, name)}
                    </p>
                    <div className={cls(cmn.flex, cmn.flexg)}></div>
                    {/* <div className={cls(cmn.flex, cmn.flexc)}>
                      <ChainApps
                        skaleNetwork={props.config.skaleNetwork}
                        chain={name}
                      />
                    </div> */}
                  </div>
                </Button>
                <div className={cls(cmn.mleft20d)}>
                  <ChainApps skaleNetwork={props.config.skaleNetwork} chain={name} />
                </div>
              </Typography>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
