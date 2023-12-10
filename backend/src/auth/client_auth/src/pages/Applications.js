import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Api from "../api/Api";
import DataTable from "../components/DataTable";
import Form from "../components/Form";
import PopupWrapper from "../components/PopupWrapper";
import Ui, { UiContext } from "../components/Ui";
import RestManager from "../providers/RestManager";
import Themes from "../settings/Themes";
import _ from 'lodash';
import { getFixedBool } from "../components/Form/InputData/FldBool";
import UtilsDate from "../utils/UtilsDate";



export default function Applications() {

    const themeCurrent = Themes.current();

    const [content, setContent] = useState([]);
    const [showForm, setShowForm] = useState(false);
    // Un array di dati da visualizzare nei box
    const [formFieldsCreation, setFormFieldsCreation] = useState(null);
    const [snackbar, setSnackbar] = useState(null);

    // Buffer di valori usati per l'update
    const [formFieldsUpdate, setFormFieldsUpdate] = useState(null);
    // ID righe selezionate
    const [idRowsSelected, setIdRowsSelected] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await Api.applicationsFormFields();
            if (res.status === RestManager.STATUS_OK) {
                setFormFieldsCreation(res.data.data);
            }
        })();
    }, []);

    useEffect(() => {
        // carica lista aggiornata
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formFieldsCreation]);

    /// caricamento lista backend
    async function loadItems() {
        const res = await Api.applicationsList();
        if (res.status === RestManager.STATUS_OK) {
            if (formFieldsCreation != null) {
                // conversione date
                const newData = UtilsDate.convertDatesBeforeShow(formFieldsCreation, res.data.data);
                setContent(newData);
            }
        }
    }

    /// verifichiamo di essere in modalità update
    function checkModeUpdate() {
        // se formFieldsUpdate è valorizzato => siamo in modalità UPDATE
        return (formFieldsUpdate == null) ? false : true;
    }

    /// recupera il form con i valori di default corretti
    function getFormFields() {
        return checkModeUpdate() ? formFieldsUpdate : formFieldsCreation;
    }

    // recupera il form corretto da wrappare in popup
    function getFormContent() {
        return checkModeUpdate() ? _formContentUpdate() : _formContentCreation();
    }

    // contenuto form di creazione da wrappare in popup
    function _formContentCreation() {
        return <>
            {
                getFormFields() && <Form
                    fields={getFormFields()}
                    save={async (values) => {
                        const res = await Api.applicationCreate(values);
                        if (res.status === RestManager.STATUS_OK) {
                            setSnackbar(UiContext.snackbarSuccess("Oggetto creato", 2000));
                            // close popup
                            setShowForm(false);
                            // ricarica lista aggiornata
                            await loadItems();
                        }
                        else {
                            setSnackbar(UiContext.snackbarError("Errore, riprovare", 2000));
                        }
                    }}
                    formUpdate={false}
                />
            }
        </>
    }

    // contenuto form di modifica da wrappare in popup
    function _formContentUpdate() {
        return <>
            {
                getFormFields() && <Form
                    fields={getFormFields()}
                    save={async (values) => {
                        const res = await Api.applicationUpdate(values);
                        if (res.status === RestManager.STATUS_OK) {
                            setSnackbar(UiContext.snackbarSuccess("Modifiche salvate", 2000));
                            // close popup
                            setShowForm(false);
                            // ricarica lista aggiornata
                            await loadItems();
                        }
                        else {
                            setSnackbar(UiContext.snackbarError("Errore, riprovare", 2000));
                        }
                    }}
                    formUpdate={true}
                />
            }
        </>
    }

    // carica valori dalla riga selezionata
    function loadFormToUpdate(row) {
        let formFields = _.cloneDeep(formFieldsCreation);
        for (const v of formFields) {
            v.defaultValue = row[v.key];
            if (v.type === 'bool') {
                v.defaultValue = getFixedBool(row[v.key]);
            }
        }
        // abilito update mode
        setFormFieldsUpdate(formFields);
        // mostro popup
        setShowForm(true);
    }

    // disabilita form di update
    function disableFormToUpdate(row) {
        // disabilito update mode
        setFormFieldsUpdate(null);
        // mostro popup
        setShowForm(true);
    }

    // contenuto form di creazione da wrappare in popup
    async function deleteItems() {
        let countOk = 0;
        let countErr = 0;
        for (const idItem of idRowsSelected) {
            const res = await Api.applicationDelete(idItem);
            (res.status === RestManager.STATUS_OK) ? countOk++ : countErr++;
        }
        (countOk > 0) ?
            setSnackbar(UiContext.snackbarSuccess(`Oggetti cancellati: ${countOk}/${(countOk + countErr)}`, 3000)) :
            setSnackbar(UiContext.snackbarError("Errore, riprovare", 2000));
        // ricarica lista aggiornata
        await loadItems();
    }

    return (
        <>
            <Ui context={snackbar} />

            {/* Popup form di creazione */}
            {
                showForm && <PopupWrapper
                    popupContent={getFormContent()}
                    onClose={() => {
                        // nascondo popup
                        setShowForm(false);
                    }} />
            }

            <Button
                variant="contained"
                onClick={() => {
                    disableFormToUpdate();
                }}
                sx={{
                    marginBottom: '20px',
                    marginLeft: '20px',
                    fontSize: themeCurrent.FORMS.BUTTONS.TEXT_SIZE,
                    backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.DEF,
                    color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.DEF,
                    '&:hover': {
                        backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.HOVER,
                        color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.HOVER,
                    },
                }}
            >
                Crea
            </Button>
            <DataTable
                content={content}
                onRowSelected={(idRowsSelectedValues) => {
                    /* abilita le checkbox */
                    setIdRowsSelected(idRowsSelectedValues);
                }}
                //onClickRow={(row) => {}}
                onClickCell={(event) => {
                    if (event.field !== "__check__") {
                        // apro form di update valori SOLO SE non ho cliccato sulla checkbox
                        loadFormToUpdate(event.row);
                    }
                }}
            />

            {/* Cancella a backend gli items selezionati */}
            {
                (idRowsSelected.length > 0) && <Button
                    variant="contained"
                    onClick={() => {
                        deleteItems();
                    }}
                    sx={{
                        marginTop: '20px',
                        marginLeft: '20px',
                        fontSize: themeCurrent.FORMS.BUTTONS.TEXT_SIZE,
                        backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.DEF,
                        color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.DEF,
                        '&:hover': {
                            backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.HOVER,
                            color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.HOVER,
                        },
                    }}
                >
                    {`Cancella selezionati (${idRowsSelected.length} items)`}
                </Button>
            }
        </>
    );
}
