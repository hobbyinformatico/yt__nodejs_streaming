//import { useState, useEffect, useRef } from 'react';
//import Auth from '../../api/Auth';
import { Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useGlobalContext } from '../../App';
import Themes from '../../settings/Themes';
import AccountBadge from './TopBar/AccountBadge';


export default function TopBar() {

    const { globalContext, setGlobalContext } = useGlobalContext();

    const themeCurrent = Themes.current();


    return (
        <Box
            sx={{
                // >= 1300 per montare sopra al backdrop
                zIndex: 1300,
                display: 'flex',
                justifyContent: 'space-between',
                // Altezza della parte superiore
                height: themeCurrent.TOP_BAR.SIZE,
                // Colore di sfondo
                backgroundColor: themeCurrent.TOP_BAR.COLOR,
                paddingLeft: '1%', //'30px',
                paddingRight: '1.5%', //'30px'
            }}
        >
            {/*------------ Menu burger ------------*/}
            <Button
                onClick={() => {
                    setGlobalContext((prevState) => ({
                        ...prevState,
                        showMenu: !globalContext.showMenu
                    }));
                }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <MenuIcon style={{
                    fontSize: themeCurrent.TOP_BAR.ICONS_SIZE,
                    color: themeCurrent.TOP_BAR.ICONS_COLOR
                }} />
            </Button>

            {/*------------ Account ------------*/}
            <AccountBadge />
        </Box >
    );
};