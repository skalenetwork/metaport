import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';


import ChainApps from '../ChainApps';
import ChainIcon from '../ChainIcon';

import { MetaportConfig } from '../../core/interfaces';

import { cls, getChainAlias } from '../../core/helper';
import common from "../../styles/common.module.scss";
import styles from "../../styles/styles.module.scss";


export default function ChainsList(props: {
  config: MetaportConfig,
  expanded: string | false,
  setExpanded: (expanded: string | false) => void,
  setChain: (chain: string) => void,
  chain: string,
  disabledChain: string,
  from?: boolean,
  disabled?: boolean
}) {
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  const schainNames = [];

  for (let chain of props.config.chains) {
    if (chain != props.disabledChain && chain != props.chain) {
      schainNames.push(chain);
    }
  }

  function handle(schainName) {
    props.setExpanded(false);
    props.setChain(schainName);
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
            <div className={cls(common.flex, common.fullWidth, common.flexCenteredVert)}>
              <div className={cls(common.flex, common.flexCentered, common.margRi10)}>
                <ChainIcon
                  skaleNetwork={props.config.skaleNetwork}
                  chainName={props.chain}
                />
              </div>
              <Tooltip title={'SKALE Chain ' + props.chain}>
                <p className={cls(
                  common.p,
                  common.p3,
                  common.p600,
                  common.capitalize,
                  common.pMain,
                  common.margRi10
                )}>
                  {getChainAlias(props.config.skaleNetwork, props.chain)}
                </p>
              </Tooltip>
              <div className={cls(common.flex, common.flexGrow)}></div>
              {/* <div className={cls(common.flex, common.flexCentered)}>
                <ChainApps
                  skaleNetwork={props.config.skaleNetwork}
                  chain={props.chain}
                />
              </div> */}
            </div>
          ) : (
            <div className={cls(common.flex, common.flexCenteredVert)}>
              <div className={cls(common.flex, common.flexCentered, common.margRi10)}>
                <ChainIcon
                  skaleNetwork={props.config.skaleNetwork}
                  chainName={props.chain}
                />
              </div>
              <p className={cls(
                common.flex,
                common.p3,
                common.p600,
                common.p,
                common.pMain,
                common.margRi10
              )}>
                Transfer {props.from ? 'from' : 'to'}...
              </p>
            </div>
          )
          }
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={cls(common.chainsList, common.margBott10, common.margRi10)}
            style={{ marginLeft: '8px' }}
          >
            <div style={{ marginTop: '-17px' }}>
              <ChainApps
                skaleNetwork={props.config.skaleNetwork}
                chain={props.chain}
              />
            </div>
            {schainNames.map((name) => (
              <Typography key={name}>
                <Button
                  color="secondary"
                  size="medium"
                  onClick={() => handle(name)}
                  className={cls(common.fullWidth)}
                >
                  {/* <div className={common.padd10}>
                    
                  </div> */}
                  <div className={cls(
                    common.flex,
                    common.flexCenteredVert,
                    common.margTop5,
                    common.margBott5,
                    common.fullWidth
                  )}>
                    <div className={cls(
                      common.flex,
                      common.flexCentered,
                      common.margRi10,
                      common.margLeft10,
                      common.pMain)}>
                      <ChainIcon
                        skaleNetwork={props.config.skaleNetwork}
                        chainName={name}
                      />
                    </div>
                    <p className={cls(
                      common.flex,
                      common.p3,
                      common.p,
                      common.p600,
                      common.capitalize,
                      common.pMain,
                      common.margRi10
                    )}>
                      {getChainAlias(props.config.skaleNetwork, name)}
                    </p>
                    <div className={cls(common.flex, common.flexGrow)}></div>
                    {/* <div className={cls(common.flex, common.flexCentered)}>
                      <ChainApps
                        skaleNetwork={props.config.skaleNetwork}
                        chain={name}
                      />
                    </div> */}
                  </div>
                </Button>
                <div className={cls(common.margLeft20d)}>
                  <ChainApps
                    skaleNetwork={props.config.skaleNetwork}
                    chain={name}
                  />
                </div>

              </Typography>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div >
  )
}