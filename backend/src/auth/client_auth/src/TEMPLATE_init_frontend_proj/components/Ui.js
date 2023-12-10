import { useEffect, useState } from "react";
import UiLoadingSpin from "./Ui/UiLoadingSpin";
import UiSnackbar, { SNACKBAR_TYPE } from "./Ui/UiSnackbar";

const UiComponent = {
    snackbar: 'snackbar',
    loadingSpin: 'loadingSpin',
}

export class UiContext {

    static snackbarSuccess(msg, timeHide = 3000) {
        return {
            component: UiComponent.snackbar,
            type: SNACKBAR_TYPE.success,
            msg: msg,
            timeHide: timeHide,
        };
    }
    static snackbarWarning(msg, timeHide = 3000) {
        return {
            component: UiComponent.snackbar,
            type: SNACKBAR_TYPE.warning,
            msg: msg,
            timeHide: timeHide,
        };
    }
    static snackbarError(msg, timeHide = 3000) {
        return {
            component: UiComponent.snackbar,
            type: SNACKBAR_TYPE.error,
            msg: msg,
            timeHide: timeHide,
        };
    }

    static loadingSpin(active, msg = "") {
        if (active) {
            return {
                component: UiComponent.loadingSpin,
                msg: msg,
            };
        }
        return null;
    }
}

export const zIndexUiComponents = 2500;

export default function Ui({ context = null }) {
    const [currentContext, setCurrentContext] = useState(null);

    useEffect(() => {
        setCurrentContext(context);
        // autochiusura (caso Snackbar)
        if (context && context.component === UiComponent.snackbar) {
            setTimeout(() => { setCurrentContext(null); }, context.timeHide);
        }
    }, [context]);

    return (
        <>
            {currentContext && <>
                {currentContext.component === UiComponent.snackbar &&
                    <UiSnackbar
                        msg={currentContext.msg}
                        type={currentContext.type}
                        onClose={() => { setCurrentContext(null); }}
                    />}
                {currentContext.component === UiComponent.loadingSpin &&
                    <UiLoadingSpin
                        msg={currentContext.msg}
                    />}
            </>}
        </>
    );

}