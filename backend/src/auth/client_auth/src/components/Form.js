
import { useState } from 'react';
import { Box, Button } from '@mui/material';
//import { useGlobalContext } from '../App';
import InputData from './Form/InputData';
import Themes from '../settings/Themes';
//import Auth from '../api/Auth';
import UtilsFld from '../utils/UtilsFld';
import Ui, { UiContext } from './Ui';
import { setFixedBool } from './Form/InputData/FldBool';
import UtilsDate from '../utils/UtilsDate';


export default function Form({
    fields,
    save,
    formUpdate = false
}) {

    //const { globalContext, setGlobalContext } = useGlobalContext();
    const themeCurrent = Themes.current();


    const [values, setValues] = useState(
        fields.reduce((acc, current) => {
            let defVal = current.defaultValue;
            // conversioni eventuali per tipo di dato
            defVal = fixValues(current.type, defVal);
            acc[current.key] = defVal ?? "";
            return acc;
        }, {})
    );
    const [errors, setErrors] = useState(
        fields.reduce((acc, current) => {
            acc[current.key] = false;
            return acc;
        }, {})
    );
    const [snackbar, setSnackbar] = useState(null);


    function fixValues(type, defVal) {
        if (type === 'bool') {
            defVal = setFixedBool(defVal);
        }
        /*
        else if (['date', 'datetime'].includes(type)) {
            defVal = UtilsDate.strUtcToLocal(defVal);
        }
        */
        return defVal;
    }


    return (
        <>
            <Ui context={snackbar} />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'left',
                flexWrap: 'wrap',
                marginBottom: '50px'
            }}>
                {values && fields.map((item, index) => (
                    <InputData key={index} item={item} ctrl={{ values, setValues, errors, setErrors }} formUpdate={formUpdate} />
                ))}
            </Box>
            <Button
                variant="contained"
                onClick={() => {
                    const esito = UtilsFld.validateForm(fields, values, errors);
                    if (esito.type === 'S') {
                        const newValues = UtilsDate.convertDatesBeforeSave(fields, values);
                        save(newValues);
                        //setSnackbar(UiContext.snackbarSuccess(esito.msg, 2000));
                    }
                    else if (esito.type === 'E') {
                        setSnackbar(UiContext.snackbarError(esito.msg, 4000));
                    }
                }}
                sx={{
                    fontSize: themeCurrent.FORMS.BUTTONS.TEXT_SIZE,
                    backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.DEF,
                    color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.DEF,
                    '&:hover': {
                        backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.HOVER,
                        color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.HOVER,
                    },
                }}
            >
                Salva
            </Button>
        </>
    );
};


