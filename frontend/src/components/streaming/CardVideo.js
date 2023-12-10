import { Card, CardMedia, Typography } from '@mui/material';
import Api from '../../api/Api';


export default function CardVideo({ onClick, elem }) {
    const iconFile = "/icons/media.png";
    const iconFolder = "/icons/folder.png";

    function existThumbnail(elem) {
        return ![null, ''].includes(elem.thumbnail);
    }

    function setCardHeight(elem) {
        if (elem.isFile && existThumbnail(elem)) {
            return '180px';
        }
        return '50px';
    }

    return (
        <Card
            sx={{
                marginBottom: '10px',
                height: setCardHeight(elem),
                padding: '20px',
                display: 'flex'
            }}
            onClick={onClick}
        >
            {<img
                src={(elem.isFile) ? iconFile : iconFolder}
                alt="PNG"
                height='100%'
                style={{
                    paddingRight: '5%'
                }}
            />}
            <Typography
                variant="h5"
            >
                {
                    //`${elem.title} [${elem.ext}]`
                    `${elem.title}`
                }
            </Typography>
        </Card>
    );
}