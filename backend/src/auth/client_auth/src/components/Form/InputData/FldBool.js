import React from 'react';
import { Checkbox } from '@mui/material';



export function getFixedBool(value) {
    // dal backend arriva 1\0 e non true\false
    if ([0, 1].includes(value)) {
        return (value === 1) ? true : false;
    }
    return false;
}

export function setFixedBool(value) {
    // al backend arriverà 1\0 e non true\false
    if ([true, false].includes(value)) {
        return (value === true) ? 1 : 0;
    }
    return 0;
}

export default function FldBool({ item, ctrl, formUpdate }) {

    const { values, setValues } = ctrl;

    return (
        <>
            <Checkbox
                checked={
                    (values[item.key] === '') ? false : getFixedBool(values[item.key])
                }
                onChange={(event) => {
                    // se errata sostituisco con default (""), altrimenti aggiorno valore nel buffer
                    setValues((prevState) => ({
                        ...prevState,
                        [item.key]: setFixedBool(event.target.checked)
                    }));
                }}
                // inputProps={{ readOnly: (item.updatable === false) }}
                disabled={(formUpdate === true && item.updatable === false)}
                sx={{
                    marginLeft: '-10px'
                }}
            />
        </>
    );
};

