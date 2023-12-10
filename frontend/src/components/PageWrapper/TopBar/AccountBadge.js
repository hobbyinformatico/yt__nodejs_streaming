import { useState, useRef } from 'react';
import { Box, Button, Popover } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Themes from '../../../settings/Themes';
import SessionManager from '../../../providers/SessionManager';



export default function AccountBadge() {

    const [showPopoverAccount, setShowPopoverAccount] = useState(null);
    const refBadgeAccount = useRef(null);

    const themeCurrent = Themes.current();
    const user = SessionManager.getUser();


    return (
        <>
            <Button
                ref={refBadgeAccount}
                onClick={() => setShowPopoverAccount(true)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: themeCurrent.TOP_BAR.TEXT_COLOR
                }}
            >
                <PersonIcon style={{
                    fontSize: themeCurrent.TOP_BAR.ICONS_SIZE,
                    color: themeCurrent.TOP_BAR.ICONS_COLOR
                }} />
                <Box sx={{
                    paddingLeft: '10px',
                    fontSize: themeCurrent.TOP_BAR.TEXT_SIZE
                }}>
                    {user ?? "Account"}
                </Box>
            </Button>
            <Popover
                anchorEl={refBadgeAccount.current}
                onClose={() => setShowPopoverAccount(false)}
                open={showPopoverAccount ?? false}
                // Ancoriamo un BOX (tramite un suo punto) ad un punto dell'elemento (REF):
                //  1. punto su elemento (REF)
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                //  2. punto su popup (BOX)
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box
                    sx={{
                        //width: '100px',
                        padding: '5px',
                    }}
                >
                    <Button
                        fullWidth
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: themeCurrent.TOP_BAR.POPOVER.TEXT_COLOR
                        }}
                        onClick={() => {
                            setShowPopoverAccount(false)
                            SessionManager.logout(true);
                        }}
                    >
                        <LogoutIcon style={{
                            fontSize: themeCurrent.TOP_BAR.POPOVER.ICONS_SIZE,
                            color: themeCurrent.TOP_BAR.POPOVER.ICONS_COLOR
                        }} />
                        <Box sx={{
                            marginLeft: '10px',
                            fontSize: themeCurrent.TOP_BAR.POPOVER.TEXT_SIZE
                        }}>
                            Logout
                        </Box>
                    </Button>
                </Box>
            </Popover>
        </>
    );
}