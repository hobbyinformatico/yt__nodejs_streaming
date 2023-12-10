
# Esempio di utilizzo

## 1. Snackbar
```
import Ui, { UiContext } from './Ui';


export default function esempio() {

    const [snackbar, setSnackbar] = useState(null);

    function spin_on() {
        const durataMs = 2000;
        const msg = "messaggio";

        setSnackbar(UiContext.snackbarSuccess(msg, durataMs));
        // setSnackbar(UiContext.snackbarWarning(msg, durataMs));
        // setSnackbar(UiContext.snackbarError(msg, durataMs));
    }

    return (
        <Ui context={snackbar} />
    }
```

## 2. Loading Spin
```
import Ui, { UiContext } from './Ui';


export default function esempio() {

    const [spin, setSpin] = useState(null);

    function spin_on() {
        setSpin(UiContext.loadingSpin(true));

        //  -- con messaggio --
        // const msg = "messaggio";
        // setSpin(UiContext.loadingSpin(true, msg));
    }

    function spin_off() {
        setSpin(UiContext.loadingSpin(false));

        //  -- con messaggio --
        // const msg = "messaggio";
        // setSpin(UiContext.loadingSpin(false, msg));
    }

    return (
        <Ui context={spin} />
    }
}
```