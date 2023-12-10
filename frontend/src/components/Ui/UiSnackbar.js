import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { zIndexUiComponents } from '../Ui';

export const SNACKBAR_TYPE = {
    // severity => 'success' | 'info' | 'warning' | 'error'
    success: {
        border: '1px solid green',
        severity: 'success',
    },
    warning: {
        border: '1px solid yellow',
        severity: 'warning',
    },
    error: {
        border: '1px solid red',
        severity: 'error',
    },
};

export default function UiSnackbar({ msg, type, onClose }) {
    return (
        <Snackbar
            open={true}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            onClick={() => { onClose(); }}
            sx={{
                zIndex: zIndexUiComponents,
                border: (type) ? type.border : '1px solid red',
                borderRadius: '10px',
            }}
        >
            <Alert
                // 'success' | 'info' | 'warning' | 'error'
                severity={(type) ? type.severity : 'error'}
                sx={{
                    width: '100%',
                }}
            >
                {(msg) ? msg : ""}
            </Alert>
        </Snackbar>
    );
}
