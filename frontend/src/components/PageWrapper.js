import { Box } from '@mui/material';
import TopBar from './PageWrapper/TopBar';
import Menu from './PageWrapper/Menu';
import React from 'react';
import SessionManager from "../providers/SessionManager";
import LoginPage from '../pages/LoginPage';


export default function PageWrapper({ content, showLoginPopup = false }) {
    return (
        <>
            {/* popup per permettere l'autenticazione */}
            {
                (showLoginPopup === true) && <LoginPage />
            }

            {/* contenuto pagina */}
            {
                SessionManager.checkSessionExist() && <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden'
                }}
                >
                    <TopBar />

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%'
                        }}
                    >
                        <Menu />

                        <Box sx={{
                            flex: 1
                        }}>
                            {content}
                        </Box>
                    </Box>
                </Box>
            }
        </>
    );
};