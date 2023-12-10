import { useEffect, useState } from "react";
import Api from "../../api/Api";
import RestManager from "../../providers/RestManager";
import Ui, { UiContext } from '../../components/Ui';
import CardVideo from "../../components/streaming/CardVideo";
import { Card, Box } from "@mui/material";



export default function ListVideos({ onClickVideo }) {

    const [snackbar, setSnackbar] = useState(null);
    const [spin, setSpin] = useState(null);
    const [listVideos, setListVideos] = useState([]);
    const [lastFolder, setLastFolder] = useState(null);


    useEffect(() => {
        (async () => {
            setSpin(UiContext.loadingSpin(true));
            setListVideos(await Api.getListHome());
            setSpin(UiContext.loadingSpin(false));
        })();

    }, []);

    async function onClickBack() {
        setSpin(UiContext.loadingSpin(true));
        const data = await Api.getListBack(lastFolder);
        setLastFolder(data.parent);
        setListVideos(data.list);
        setSpin(UiContext.loadingSpin(false));
    }

    async function onClickHome() {
        setSpin(UiContext.loadingSpin(true));
        setListVideos(await Api.getListHome());
        setSpin(UiContext.loadingSpin(false));
    }

    async function onClick(src, isFile) {
        setSpin(UiContext.loadingSpin(true, "Recupero lista"));
        if (isFile) {
            onClickVideo(src);
        }
        else {
            setLastFolder(src);
            setListVideos(await Api.getListItem(src));
        }
        setSpin(UiContext.loadingSpin(false));
        //setSnackbar(UiCollectionContext.snackbarSuccess("Lista elementi recuperata", 3000));
    }

    return (
        <>
            <Ui context={snackbar} />
            <Ui context={spin} />

            <Box
                backgroundColor='#D1D1D1'
                height='100vh'
                overflow={'auto'}
            >
                <Box
                    sx={{
                        padding: '10px'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly'
                    }}>
                        <Card
                            key={'back'}
                            sx={{
                                marginBottom: '10px',
                                height: '10px', //'100px',
                                padding: '20px',
                                backgroundColor: '#444444',
                                color: 'white'
                            }}
                            onClick={() => {
                                onClickBack();
                            }}
                        >
                            {"BACK"}
                        </Card>
                        <Card
                            key={'home'}
                            sx={{
                                marginBottom: '10px',
                                height: '10px', //'100px',
                                padding: '20px',
                                backgroundColor: '#444444',
                                color: 'white',
                            }}
                            onClick={() => {
                                onClickHome();
                            }}
                        >
                            {"HOME"}
                        </Card>
                    </Box>
                    {listVideos.length > 0 && listVideos.map((o) =>
                        <>
                            <CardVideo
                                key={o.title}
                                onClick={() => {
                                    onClick(o.src, o.isFile);
                                }}
                                elem={o}
                            >
                            </CardVideo>
                        </>
                    )}
                </Box>
            </Box >
        </>
    );
}