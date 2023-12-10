import React, { useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import UtilsDate from '../../../utils/UtilsDate';
import UtilsFld from '../../../utils/UtilsFld';



export default function FldDatetime({ item, ctrl, formUpdate }) {

    const { values, setValues, setErrors } = ctrl;

    // check iniziale obbligatorietà campo
    useEffect(() => {
        setErrors((prevState) => ({
            ...prevState,
            [item.key]: isError() //!([null, ""].includes(values[item.key]))
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /// verifica al volo l'errore
    function isError() {
        return [null, ""].includes(values[item.key]);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                // il valore di default deve avere il formato (YYYY-MM-DD HH:MM:ss)
                value={dayjs(values[item.key])}
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
                        [item.key]: (err) ? "" : UtilsDate.setDatetime(value)
                    }));
                }}
                // inputProps={{ readOnly: (item.updatable === false) }}
                disabled={(formUpdate === true && item.updatable === false)}
                // formato visibile
                format='DD/MM/YYYY HH:mm'
                // nascondo AM/PM
                ampm={false}
            />
        </LocalizationProvider>
    );
};