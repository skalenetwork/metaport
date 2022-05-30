import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import Button from '@mui/material/Button';


const stringToColour1 = function(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function hashCode(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function stringToColour(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}


export default function ChainsList(props) {

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  const schainNames = [];

  for (let chain of props.schains) {
    if (chain.schain[0] != props.disabledChain){
      schainNames.push(chain.schain[0]);
    }
  }

  function handle(schainName) {
    props.setExpanded(false);
    props.setChain(schainName);
  }

  return (
    <div>
      <Accordion expanded={props.expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          {props.chain ? (
            <div className="flex-container chain-name-btn">
              <div className="flex-container fl-centered">
                <OfflineBoltIcon sx={{ color: stringToColour(props.chain) }} width='20px'/>
              </div>
              <p className="schain-name flex-container marg-ri-10">
                {props.chain}
              </p>
            </div>
          ) : (
            <div className="flex-container chain-name-btn">
              <div className="flex-container fl-centered">
                <OfflineBoltIcon sx={{ color: 'white' }} className='opacityIcon'/>
              </div>
              <p className="schain-name flex-container marg-ri-10">
                Select chain
              </p>
            </div>
          )
          }
        </AccordionSummary>
        <AccordionDetails>
          <div className='chains-list'>
            {schainNames.map((schainName)  => (
              <Typography key={schainName}>
                <Button color="secondary" size="small" className='chain-name-btn' onClick={() => handle(schainName)}>
                  <div className="flex-container chain-name-btn">
                    <div className="flex-container fl-centered">
                      <OfflineBoltIcon sx={{ color: stringToColour(schainName) }} className='opacityIcon'/>
                    </div>
                    <p className="schain-name flex-container marg-ri-10">
                      {schainName}
                    </p>
                  </div>  
                </Button>
            </Typography>
           ))}
          </div>
        </AccordionDetails>
      </Accordion>
     
    </div>
  )
}