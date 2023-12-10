import React, { useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import UtilsDate from '../../../utils/UtilsDate';
import UtilsFld from '../../../utils/UtilsFld';


export default function FldDate({ item, ctrl, formUpdate }) {

    const defaultFormat = 'DD/MM/YYYY';
    const { values, setValues, setErrors } = ctrl;

    // check iniziale obbligatorietà campo
    useEffect(() => {
        setErrors((prevState) => ({
            ...prevState,
            [item.key]: isError()
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /// verifica al volo l'errore
    function isError() {
        return [null, ""].includes(values[item.key]);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={dayjs(values[item.key], defaultFormat)}
                slotProps={{
                    textField: {
                        error: isError(),
                        size: 'small'
                    }
                }}
                onChange={(value) => {
                    // se è un campo obbligatorio verifico che sia alimentato
                    const err = !UtilsFld.checkRequiredDatetime(item, value);
                    // registro eventuale errore per validazione finale del form
                    setErrors((prevState) => ({
                        ...prevState,
                        [item.key]: err
                    }));
                    // se errata sostituisco con default (""), altrimenti aggiorno valore nel buffer
                    setValues((prevState) => ({
                        ...prevState,
                        [item.key]: (err) ? "" : UtilsDate.setDate(value)
                    }));
                }}
                // inputProps={{ readOnly: (item.updatable === false) }}
                disabled={(formUpdate === true && item.updatable === false)}
                // formato visibile
                format='DD/MM/YYYY'
            />
        </LocalizationProvider>
    );
};