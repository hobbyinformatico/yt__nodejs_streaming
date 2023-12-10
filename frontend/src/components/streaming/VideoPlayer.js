import { useState, useRef, useEffect, createRef } from 'react';
import { Box } from '@mui/material';
import Api from '../../api/Api';
import Themes from '../../settings/Themes';
//import io from 'socket.io-client';


export default function VideoPlayer({ srcVideo }) {
    const freqUpdateResumeSec = 5;
    const themeCurrent = Themes.current();

    const elemRef = useRef();
    const [boxInnerHeight, setBoxInnerHeight] = useState();
    const [boxInnerWidth, setBoxInnerWidth] = useState();
    const [lastCurrentTime, setLastCurrentTime] = useState(0);
    const videoRef = createRef();
    // invio progresso nel video in secondi
    //const socket = io(Api.BASE_URL_io);


    useEffect(() => {
        // quando si clicca su un'altro video la timeline riparte
        // da 0 quindi resetto anche il segno di dove ero arrivato
        setLastCurrentTime(0);
    }, [srcVideo]);

    useEffect(() => {
        if (boxInnerHeight) return;
        if (elemRef.current) {
            setBoxInnerHeight(elemRef.current.clientHeight);
            setBoxInnerWidth(elemRef.current.clientWidth - 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elemRef.current, elemRef.current?.clientHeight, elemRef.current?.clientWidth]);


    /*
    useEffect(() => {
        if (videoRef) {
            window.addEventListener("seeking", (event) => {
                console.log(event);
                console.log("Video is seeking a new position.");
            });
        }
    }, [videoRef]);
    */

    return (
        <>
            <Box
                backgroundColor='black'
                height={`calc(100vh - ${themeCurrent.TOP_BAR.SIZE})`}
                color='white'
                ref={elemRef}
            >
                {srcVideo &&
                    <video
                        key={srcVideo}
                        ref={videoRef}
                        controls
                        autoPlay
                        duration={3600}
                        onTimeUpdate={(a) => {
                            /*
                            // Ogni "freqUpdateResumeSec" secondi di video informo il server così
                            // tiene traccia di quello che ho effettivamente visto per il resume
                            if ((lastCurrentTime + freqUpdateResumeSec) < videoRef.current.currentTime) {
                                socket.emit('video_progress', {
                                    srcVideo: srcVideo,
                                    seconds: videoRef.current.currentTime
                                });
                                setLastCurrentTime(videoRef.current.currentTime);
                            }
                            */
                        }}
                        style={{
                            height: boxInnerHeight ?? 0,
                            width: boxInnerWidth ?? 0,
                        }}>
                        <source src={`${Api.buildVideoUrl(srcVideo)}`} />
                        Il tuo browser non supporta il tag video.
                    </video>
                }
            </Box>
        </>
    );
};
