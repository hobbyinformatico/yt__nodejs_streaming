import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ListVideos from '../components/streaming/ListVideos';
import VideoPlayer from '../components/streaming/VideoPlayer';

export default function VideosPage() {
    const [srcVideo, setSrcVideo] = useState(null);

    return (
        <Grid container
            spacing={0}
            direction="row"
            //justifyContent="center"
            //alignItems="center"
            height='100%'
            width='100%'
        >
            <Grid item width='500px'>
                <ListVideos
                    onClickVideo={(srcVideo) => {
                        setSrcVideo(srcVideo);
                    }}
                >
                </ListVideos>
            </Grid>

            <Grid item xs>
                {<VideoPlayer
                    srcVideo={srcVideo}>
                </VideoPlayer>}
            </Grid>

        </Grid>
    );
};