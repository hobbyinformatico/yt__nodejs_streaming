const ffmpeg = require('fluent-ffmpeg');
const rangeParser = require('range-parser');
const mime = require('mime');
const fs = require('fs');

const { pipeline, Readable } = require('stream');


// Avvia la conversione real-time iniziale
let ffmpegProcess = null;
let createdStream = null;

/// Codifico path completo del file da streammare in ID da fornire al client
function encodeVideoRoot(srcVideos, path) {
    return srcVideos.indexOf(path).toString();
}

/// Recupero path completo del file da streammare a partire da un ID del client
function decodeVideoRoot(srcVideos, index) {
    return srcVideos[parseInt(index)];
}

/// Chiusura flussi di conversione e\o streaming in corso
/// (escluso quello della richiesta corrente), per liberare
/// risorse
function killActiveStreamAndProcess() {
    // Permetto solo un flusso video attivo alla volta e per servire una nuova richiesta
    // chiudo le precedenti così da alleggerire il carico del server
    if (ffmpegProcess != null) {
        ffmpegProcess.kill('SIGINT', () => {
            console.log('Conversione interrotta.');
            ffmpegProcess = null;
        });
    }

    if (createdStream != null) {
        createdStream.destroy();
        console.log('Streaming interrotto.');
        createdStream = null;
    }
}

/// Creazione flusso di streaming video per files MP4 o WEBM
function manage_mp4_webm(inputRealPath, req, res, inputClientPath) {
    const stat = fs.statSync(inputRealPath);
    const fileSize = stat.size;
    const range = req.headers.range || 'bytes=0-';
    const positions = rangeParser(fileSize, range, { combine: true });

    if (!positions || positions === -1 || positions.length !== 1) {
        return res.status(416).end();
    }

    const position = positions[0];
    const headers = {
        'Content-Range': `bytes ${position.start}-${position.end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': position.end - position.start + 1,
        'Content-Type': mime.getType(req.params.filename),
    };

    res.writeHead(206, headers);

    killActiveStreamAndProcess();

    createdStream = fs.createReadStream(inputRealPath, { start: position.start, end: position.end });

    return {
        res: res,
        cmd: createdStream
    };
}

///
async function manage_others(inputRealPath, req, res, inputClientPath) {
    res.setHeader('Content-Type', 'video/webm');

    killActiveStreamAndProcess();

    let startTime = '00:00:00';

    // Utilizza FFmpeg per convertire il video .avi in .mp4 e lo invia in streaming al client
    ffmpegProcess = ffmpeg(inputRealPath)
        .videoCodec('libvpx').audioCodec('libvorbis').format('webm')
        .videoFilters('scale=1280:720')
        .videoBitrate(1500)//(2500)
        .inputOptions([`-ss ${startTime}`])
        .on('start', () => {
            console.log('Inizio conversione in WEBM...');
        })
        .on('end', () => {
            console.log('Fine conversione in WEBM...');
        })
        .on('error', function (err, stdout, stderr) {
            console.log("errore di un qualche tipo");
            if (err) {
                console.error('Errore durante la conversione:', err);
                console.log(err.message);
                console.log("stdout:\n" + stdout);
                console.log("stderr:\n" + stderr);
            }
        });

    return {
        res: res,
        cmd: ffmpegProcess
    }
}


module.exports = {
    encodeVideoRoot: encodeVideoRoot,
    decodeVideoRoot: decodeVideoRoot,
    manage_mp4_webm: manage_mp4_webm,
    manage_others: manage_others,
};