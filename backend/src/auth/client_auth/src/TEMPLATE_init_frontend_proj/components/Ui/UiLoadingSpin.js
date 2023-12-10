import { Backdrop, CircularProgress, Card, Box } from '@mui/material';
import { zIndexUiComponents } from '../Ui';


export default function UiLoadingSpin({ msg = "" }) {
    const showMsg = (msg !== "");
    return (
        <Backdrop
            sx={{
                color: '#fff', zIndex: (theme) => zIndexUiComponents
            }}
            open
        >
            <Card sx={{
                padding: '30px',
                width: (showMsg) ? '180px' : null,
                height: (showMsg) ? '100px' : null,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <CircularProgress color="primary" />
                {showMsg && <Box sx={{
                    paddingTop: '30px',
                }}>
                    {msg}
                </Box>}
            </Card>
        </Backdrop>
    );
}
