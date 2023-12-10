import { useGlobalContext } from '../../App';
import { Box, Divider, Drawer } from '@mui/material';
import Themes from '../../settings/Themes';
import RoutingManager from '../../routing/RoutingManager';
import { useNavigate } from "react-router-dom";


export default function Menu() {

    const { globalContext, setGlobalContext } = useGlobalContext();
    const navigate = useNavigate();
    const pages = RoutingManager.getMenuPages();
    const themeCurrent = Themes.current();


    return (
        <Drawer
            key="menu"
            anchor="left"
            open={globalContext.showMenu}
            // Riduco l'altezza del Drawer e lo traslo in basso (l'ombra del backdrop
            // non è stata modificata però la TopBar monta sopra con zIndex)
            PaperProps={{
                sx: {
                    backgroundColor: themeCurrent.MENU.COLOR,
                    height: `calc(100% - ${themeCurrent.TOP_BAR.SIZE})`,
                    top: themeCurrent.TOP_BAR.SIZE,
                },
            }}
            onClose={() => {
                setGlobalContext((prevState) => ({
                    ...prevState,
                    showMenu: false
                }));
            }}
        >
            <Box sx={{
                width: themeCurrent.MENU.SIZE,
                backgroundColor: themeCurrent.MENU.COLOR,
                paddingTop: '20px',
                // se ci sono troppe voci o la finestra è poco alta puoi scrollare
                overflow: 'auto'
            }}>
                {
                    pages.map((p) => (
                        <Box key={p.path}>
                            <Box
                                onClick={() => {
                                    navigate(`/${p.path}`);
                                    setGlobalContext((prevState) => ({
                                        ...prevState,
                                        showMenu: false,
                                    }));
                                }}
                                sx={{
                                    paddingX: '30px',
                                    paddingY: '13px',
                                    cursor: 'pointer',
                                    fontSize: themeCurrent.MENU.ITEM.TEXT_SIZE,
                                    fontWeight: "bold",
                                    backgroundColor: themeCurrent.MENU.ITEM.COLOR.DEF,
                                    color: themeCurrent.MENU.ITEM.TEXT_COLOR.DEF,
                                    '&:hover': {
                                        backgroundColor: themeCurrent.MENU.ITEM.COLOR.HOVER,
                                        color: themeCurrent.MENU.ITEM.TEXT_COLOR.HOVER,
                                    },
                                }}
                            >
                                {p.label}
                            </Box>
                            <Divider
                                sx={{
                                    borderWidth: 1,
                                    borderColor: themeCurrent.MENU.ITEM.DIV.COLOR,
                                }}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Drawer>
    );
};