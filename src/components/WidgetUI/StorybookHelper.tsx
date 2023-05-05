import { useEffect, useState } from 'react';

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { internalEvents } from "../../core/events";


const btnStyles = {
    fontSize: '0.7525rem',
    lineHeight: '2.6',
    letterSpacing: '0.02857em',
    fontWeight: '600',
    borderRadius: '15px'
};

const styles = {
    transform: 'scale(1)',
    height: '85vh',
    backgroundColor: 'rgb(243 243 243)',
    borderRadius: '15px',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
    border: '1px solid hsla(203, 50%, 30%, 0.15)'
};


const ERC20_TR_REQ_SAMPLE = {
    "amount": "100",
    "chains": ["mainnet", "staging-perfect-parallel-gacrux"],
    "tokenKeyname": "_skl_0x2868716b3B4AEa43E8387922AFE71a77D101854e",
    "tokenType": "erc20",
    "lockValue": true,
    "toApp": "ruby"
};


const ERC721_TR_REQ_SAMPLE = {
    "tokenId": "1",
    "chains": ["mainnet", "staging-perfect-parallel-gacrux"],
    "tokenKeyname": "_SPACE_0x1b7729d7E1025A031aF9D6E68598b57f4C2adfF6",
    "tokenType": "erc721meta",
    "lockValue": true,
    "toApp": "ruby"
}

const ERC1155_TR_REQ_SAMPLE = {
    "tokenId": "1",
    "amount": "5",
    "chains": ["mainnet", "staging-perfect-parallel-gacrux"],
    "tokenKeyname": "_SKALIENS_0x6cb73D413970ae9379560aA45c769b417Fbf33D6",
    "tokenType": "erc1155",
    "lockValue": true,
    "toApp": "ruby"
}

const ERC20_S2S_TR_REQ_SAMPLE = {
    "amount": "10",
    "chains": ["staging-perfect-parallel-gacrux", "staging-severe-violet-wezen"],
    "tokenKeyname": "_SKL_0x099A46F35b627CABee27dc917eDA253fFbC55Be6",
    "tokenType": "erc20",
    "lockValue": true,
    "fromApp": "ruby",
    "toApp": "nftrade"
}

const ETH_ROUTED_TR_REQ_SAMPLE = {
    "amount": "0.01",
    "chains": ["mainnet", "staging-severe-violet-wezen"],
    "tokenKeyname": "eth",
    "tokenType": "eth",
    "lockValue": true,
    "toApp": "nftrade",
    "route": {
        "hub": "staging-perfect-parallel-gacrux",
        "tokenType": "erc20",
        "tokenKeyname": "_ETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70"
    }
}


export const storyDecorator = storyFn => <div style={styles}>
    <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)', marginTop: '10px', }}>
        <div style={{
            border: '1px solid hsla(203, 50%, 30%, 0.15)',
            borderRadius: '50%',
            height: '10px',
            width: '10px',
            marginBottom: '10px',
            marginLeft: '10px'
        }}></div>
    </div>
    {storyFn()}
</div>;


export const TransferRequestEditor = () => {
    const [inputValue, setInputValue] = useState(JSON.stringify(ERC20_TR_REQ_SAMPLE));
    const [events, setEvents] = useState([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        try {
            const parsedJSON = JSON.parse(inputValue);
            internalEvents.transfer(parsedJSON);
        } catch (error) {
            console.error('Invalid JSON object');
        }
    };

    useEffect(() => {
        window.addEventListener('metaport_actionStateUpdated', eventHandled, false);
        return () => {
            window.removeEventListener('metaport_actionStateUpdated', eventHandled, false);
        };
    }, []);

    function eventHandled(e: any) {
        events.push(e.detail);
        setEvents([...events]);
    }

    return (
        <div>
            <TextField
                label="Transfer request"
                multiline
                rows={8}
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: "100%" }}
            />
            <Button
                variant="contained"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={handleButtonClick}
            >
                Send transfer request
            </Button>

            <Button
                variant="contained"
                color="warning"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => internalEvents.reset()}
            >
                Reset widget
            </Button>

            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => { setInputValue(JSON.stringify(ERC20_TR_REQ_SAMPLE)) }}
            >
                Load ERC20 TR REQ
            </Button>

            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => { setInputValue(JSON.stringify(ERC721_TR_REQ_SAMPLE)) }}
            >
                Load ERC721 TR REQ
            </Button>

            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => { setInputValue(JSON.stringify(ERC1155_TR_REQ_SAMPLE)) }}
            >
                Load ERC1155 TR REQ
            </Button>

            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => { setInputValue(JSON.stringify(ERC20_S2S_TR_REQ_SAMPLE)) }}
            >
                Load ERC20 S2S TR REQ
            </Button>

            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px", marginRight: "20px", ...btnStyles }}
                onClick={() => { setInputValue(JSON.stringify(ETH_ROUTED_TR_REQ_SAMPLE)) }}
            >
                Load ETH ROUTED TR REQ
            </Button>
            <div style={{ marginTop: "20px" }}>
                <h2>Events</h2>
                {events.map((event, key) => (
                    <div key={key}>{event.actionName} - {event.actionState}</div>
                ))}
            </div>
        </div>
    );
}