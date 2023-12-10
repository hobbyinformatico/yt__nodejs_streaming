import { Box, Button, Card, Backdrop, TextField, InputAdornment, IconButton, Checkbox, Tooltip } from '@mui/material';
import SessionManager from '../providers/SessionManager';
import { useGlobalContext } from '../App';
import LoginIcon from '@mui/icons-material/Login';
import Themes from '../settings/Themes';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Ui, { UiContext } from '../components/Ui';
import RestManager from '../providers/RestManager';
//import CloseIcon from '@mui/icons-material/Close';


export default function LoginPage() {

    // eslint-disable-next-line
    const { globalContext, setGlobalContext, setSpin } = useGlobalContext();
    const [snackbar, setSnackbar] = useState(null);

    const [values, setValues] = useState({
        username: "",
        password: "",
        stay_logged: true
    });
    const [errors, setErrors] = useState({
        username: false,
        password: false
    });
    const [showPassword, getShowPassword] = useState(false);
    const [showTooltip, setShowTooltip] = useState(undefined);
    //const [showLoginPopup, setShowLoginPopup] = useState(true);
    const [showLoginPopup] = useState(true);

    const themeCurrent = Themes.current();


    // check iniziale obbligatorietà campo
    useEffect(() => {
        setErrors((prevState) => ({
            ...prevState,
            username: !checkRequired(values.username),
            password: !checkRequired(values.password)
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 
    function checkRequired(value) {
        return ([null, ""].includes((value ?? "").trim())) ? false : true;
    }

    //
    function openTooltip() {
        // calcolo se mostrare o meno il tooltip
        return (showTooltip === true) ? showTooltip : undefined
    }

    //
    async function login() {
        const validation = (checkRequired(values.username) && checkRequired(values.password));
        if (validation) {
            //setSpin(true, "Accesso in corso");
            setSpin(true);
            const result = await SessionManager.login(values.username, values.password, values.stay_logged);
            setSpin(false);

            // esito
            if (result.status === RestManager.STATUS_OK) {
                return true;
            }
            else if (result.status === RestManager.STATUS_UNAUTHORIZED) {
                setSnackbar(UiContext.snackbarError("Credenziali errate", 2000));
                return false;
            }
            else if (result.status === RestManager.STATUS_BAD_REQUEST) {
                setSnackbar(UiContext.snackbarError("Login fallito riprovare", 2000));
                return false;
            }
        }
        else {
            setSnackbar(UiContext.snackbarWarning("Valorizzare username e password", 3000));
            return false;
        }
        return false;
    }


    return (
        <>
            <Ui context={snackbar} />

            <Backdrop
                sx={{ color: '#FFFFFF', zIndex: (theme) => 2000 }}
                open={showLoginPopup}
            >
                <Card sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '400px',
                    height: '400px',
                    padding: '15px',
                    margin: '15px',
                    position: 'relative'
                }}>
                    {/* Pulsante chiudi popup (nascosto se non c'è una sessione e un contenuto sotto) */}
                    {/*
                        SessionManager.checkSessionExist() && <Button
                            onClick={() => {
                                setShowLoginPopup(false);
                            }}
                            sx={{
                                position: 'absolute',
                                top: 5,
                                right: 0,
                            }}
                        >
                            <CloseIcon
                                sx={{
                                    fontSize: 38,
                                    color: themeCurrent.TOP_BAR.ICONS_COLOR
                                }}
                            />
                        </Button>
                    */}

                    {/* --------- Testata --------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '250px',
                            paddingBottom: '50px'
                        }}
                    >
                        <LoginIcon style={{
                            fontSize: themeCurrent.TOP_BAR.ICONS_SIZE,
                            color: themeCurrent.TOP_BAR.ICONS_COLOR
                        }} />
                        <Box sx={{
                            paddingLeft: '10px'
                        }}>
                            Login
                        </Box>
                    </Box>

                    {/* --------- Username --------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '250px',
                            marginBottom: '20px',
                        }}
                    >
                        <TextField
                            key={"username"}
                            error={errors.username}
                            label={"Username"}
                            value={values.username}
                            size='small'
                            type='text'
                            sx={{
                                width: '100%'
                            }}
                            onChange={(event) => {

                                // se è un campo obbligatorio verifico che sia alimentato
                                const err = !checkRequired(event.target.value);
                                // registro eventuale errore per validazione finale del form
                                setErrors((prevState) => ({
                                    ...prevState,
                                    username: err
                                }));
                                // se errata sostituisco con default (""), altrimenti aggiorno valore nel buffer
                                setValues((prevState) => ({
                                    ...prevState,
                                    username: (err) ? "" : event.target.value
                                }));
                            }}
                        />
                    </Box>

                    {/* --------- Password --------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '250px',
                            marginBottom: '20px',
                        }}
                    >
                        <TextField
                            key={"password"}
                            error={errors.password}
                            label={"Password"}
                            value={values.password}
                            size='small'
                            type={(showPassword) ? 'text' : 'password'}
                            sx={{
                                width: '100%'
                            }}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            //backgroundColor: 'transparent'
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => {
                                                getShowPassword(!showPassword)
                                            }}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>,
                            }}
                            onChange={(event) => {

                                // se è un campo obbligatorio verifico che sia alimentato
                                const err = !checkRequired(event.target.value);
                                // registro eventuale errore per validazione finale del form
                                setErrors((prevState) => ({
                                    ...prevState,
                                    password: err
                                }));
                                // se errata sostituisco con default (""), altrimenti aggiorno valore nel buffer
                                setValues((prevState) => ({
                                    ...prevState,
                                    password: (err) ? "" : event.target.value
                                }));
                            }}
                        />
                    </Box>

                    {/* --------- Checkbox Ricordami --------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '250px',
                            marginBottom: '40px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
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
                                    title={"Abilita per accedere automaticamente"}
                                    placement="top-end"
                                >
                                    <Box sx={{
                                        padding: '5px',
                                        fontSize: themeCurrent.FORMS.LABELS.TEXT_SIZE,
                                    }}>
                                        {"Ricordami"}
                                    </Box>
                                </Tooltip>
                            </Box>

                            {/* Campo input relativo */}
                            <Checkbox
                                checked={values.stay_logged}
                                onChange={(event) => {
                                    setValues((prevState) => ({
                                        ...prevState,
                                        stay_logged: event.target.checked
                                    }));
                                }}
                            />
                        </Box>
                    </Box>

                    {/* --------- Button login --------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '250px',
                        }}
                    >
                        <Button
                            onClick={() => {
                                login();
                            }}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: themeCurrent.FORMS.BUTTONS.TEXT_SIZE,
                                backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.DEF,
                                color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.DEF,
                                '&:hover': {
                                    backgroundColor: themeCurrent.FORMS.BUTTONS.COLOR.HOVER,
                                    color: themeCurrent.FORMS.BUTTONS.TEXT_COLOR.HOVER,
                                },
                            }}
                        >
                            {"Login"}
                        </Button>
                    </Box>
                </Card>
            </Backdrop>

        </>
    );
}