import React, { useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import FldNumber from './InputData/FldNumber';
import FldText from './InputData/FldText';
import FldDate from './InputData/FldDate';
import FldDatetime from './InputData/FldDatetime';
import Themes from '..//../settings/Themes';
import FldBool from './InputData/FldBool';


export default function InputData({ item, ctrl, formUpdate }) {

    /*
        "Mui Tooltip.open" funziona con un 3-state ("true", "false", "undefined"):
            - "undefined" di default (attivato solo hover, non funziona su mobile)
            - "false" (sempre disattivato)
            - "true" (sempre attivo)
    */
    const [showTooltip, setShowTooltip] = useState(undefined);
    const themeCurrent = Themes.current();

    /*
        Per rendere funzionale Tooltip sia su desktop che su mobile, lo settiamo a:
            - "undefined"
                - disattivato senza usare mai "false"
                - parte solo su hover (solo desktop)
            - "true"
                - quando vogliamo mostrare un tooltip temporaneo (scompare con "setTimeout()")
                - parte su click della label (sia mobile che desktop)
            - "false"
                - usato solo se non ci sono info da mostrare con tooltip
                - viene trasformato in "undefined" quando usato e ci sono info da mostrare
    */
    function openTooltip() {
        // calcolo se mostrare o meno il tooltip
        if (item.info === null || item.info === "") {
            return false;
        }
        return (showTooltip === true) ? showTooltip : undefined
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5px',
            backgroundColor: 'transparent'
        }}
        >
            {/* Identificativo nome campo */}
            <Box
                onClick={() => {
                    if (showTooltip !== true) {
                        setShowTooltip(true);
                        setTimeout(() => { setShowTooltip(undefined); }, 1500);
                    }
                }}
            >
                {/* Tooltip al click o al passaggio del cursore */}
                <Tooltip
                    open={openTooltip()}
                    title={item.info}
                    placement="top-end"
                >
                    <Box sx={{
                        display: 'flex',
                        width: '110px',
                        padding: '5px',
                        fontSize: themeCurrent.FORMS.LABELS.TEXT_SIZE,
                    }}>
                        {/* Label */}
                        {item.label}
                        {/* Asterisco required */}
                        {
                            item.required === true && <Box sx={{
                                color: 'red',
                                marginLeft: '5px',
                                position: 'relative',
                                top: '-5px'
                            }}>*</Box>
                        }
                    </Box>
                </Tooltip>
            </Box>

            {/* Campo input relativo */}
            <Box sx={{
                flex: 1,
                padding: '5px'
            }}>
                {(item.type === 'text') && <FldText item={item} ctrl={ctrl} isPswd={false} formUpdate={formUpdate} />}
                {(item.type === 'password') && <FldText item={item} ctrl={ctrl} isPswd={true} formUpdate={formUpdate} />}
                {(item.type === 'number') && <FldNumber item={item} ctrl={ctrl} formUpdate={formUpdate} />}
                {(item.type === 'date') && <FldDate item={item} ctrl={ctrl} formUpdate={formUpdate} />}
                {(item.type === 'datetime') && <FldDatetime item={item} ctrl={ctrl} formUpdate={formUpdate} />}
                {(item.type === 'bool') && <FldBool item={item} ctrl={ctrl} isPswd={false} formUpdate={formUpdate} />}
            </Box>
        </Box>

    );
};