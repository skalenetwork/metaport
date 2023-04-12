import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { internalEvents } from "../../core/events";


const styles = {
    transform: 'scale(1)',
    height: '85vh',
    backgroundColor: 'rgb(243 243 243)',
    borderRadius: '15px',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
    border: '1px solid hsla(203, 50%, 30%, 0.15)'
};

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

    const defaultTrReq = JSON.stringify({
        "amount": "100",
        "chains": ["mainnet", "staging-perfect-parallel-gacrux"],
        "tokenKeyname": "_skl_0x2868716b3B4AEa43E8387922AFE71a77D101854e",
        "tokenType": "erc20",
        "lockValue": true,
        "toApp": "ruby"
    });

    const [inputValue, setInputValue] = useState(defaultTrReq);

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
                style={{ marginTop: "20px" }}
                onClick={handleButtonClick}
            >
                Send transfer request
            </Button>

            <Button
                variant="contained"
                color="warning"
                style={{ marginTop: "20px", marginLeft: "20px" }}
                onClick={() => internalEvents.reset()}
            >
                Reset widget
            </Button>


        </div>
    );
}