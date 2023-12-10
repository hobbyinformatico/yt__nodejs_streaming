import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import UtilsFld from '../../../utils/UtilsFld';


export default function FldText({ item, ctrl, isPswd, formUpdate }) {

    const { values, setValues, errors, setErrors } = ctrl;

    // check iniziale obbligatorietà campo
    useEffect(() => {
        setErrors((prevState) => ({
            ...prevState,
            [item.key]: !UtilsFld.checkRequired(item, values[item.key])
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TextField
            error={errors[item.key]}
            label={item.label}
            value={values[item.key]}
            size='small'
            type={(isPswd === false) ? 'text' : 'password'}
            onChange={(event) => {
                // se è un campo obbligatorio verifico che sia alimentato
                const err = !UtilsFld.checkRequired(item, event.target.value);
                // registro eventuale errore per validazione finale del form
                setErrors((prevState) => ({
                    ...prevState,
                    [item.key]: err
                }));
                // se errata sostituisco con default (""), altrimenti aggiorno valore nel buffer
                setValues((prevState) => ({
                    ...prevState,
                    [item.key]: (err) ? "" : event.target.value
                }));
            }}
            // inputProps={{ readOnly: (item.updatable === false) }}
            disabled={(formUpdate === true && item.updatable === false)}
        />
    );
};