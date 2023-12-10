import React from 'react';
import { Box, Card, Backdrop, Button } from '@mui/material';
import Themes from '../settings/Themes';
import CloseIcon from '@mui/icons-material/Close';



export default function PopupWrapper({ popupContent, onClose }) {

    const themeCurrent = Themes.current();

    return (
        <>
            <Backdrop
                sx={{
                    color: '#FFFFFF',
                    zIndex: (theme) => 1,
                    // la topbar è sempre visibile
                    marginTop: themeCurrent.TOP_BAR.SIZE
                }}
                open={true}
            >
                <Card sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    //width: '100%',
                    width: '600px',
                    maxHeight: '90%',
                    padding: '15px',
                    margin: '15px',
                    position: 'relative'
                }}>
                    {/* Pulsante chiudi popup */}
                    {
                        <Button
                            onClick={() => {
                                onClose();
                            }}
                            sx={{
                                position: 'absolute',
                                top: 5,
                                right: 0
                            }}
                        >
                            <CloseIcon
                                sx={{
                                    fontSize: 38,
                                    color: themeCurrent.TOP_BAR.ICONS_COLOR
                                }}
                            />
                        </Button>
                    }
                    <Box
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '95%',
                            marginTop: '40px',
                            paddingBottom: '15px',
                            overflow: 'auto'
                        }}
                    >
                        {/* contenuto */}
                        {popupContent}

                    </Box>
                </Card>
            </Backdrop>

        </>
    );
}