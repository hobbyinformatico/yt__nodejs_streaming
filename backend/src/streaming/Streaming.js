const fs = require('fs');
const fsp = require('fs').promises;
const StreamGenerate = require('./includes/StreamGenerate');
const Utilities = require('./includes/Utilities');


/// Check autorizzazione esecuzione richiesta con access_token
function server_streaming(appExpress) {

    /// Recupero video
    appExpress.get('/video/*', (req, res) => {
        // Leggi il file video
        (async () => {
            // req.params non è un array ma si accede come un array
            const inputClientPath = req.params[0];
            const inputRealPath = Utilities.getRealPath(inputClientPath);

            // Verifica se il file esiste
            if (!fs.existsSync(inputRealPath)) {
                //console.log(inputRealPath);
                return res.status(404).send('File non trovato');
            }

            // estensione file
            const estensione = inputClientPath.split('.').pop().toLowerCase();
            let result = null;

            if (['mp4', 'webm'].includes(estensione)) {
                result = StreamGenerate.manage_mp4_webm(inputRealPath, req, res, inputClientPath);
                //console.log("gestione video: COMPATIBILI");
            }
            else {
                result = await StreamGenerate.manage_others(inputRealPath, req, res, inputClientPath);
                //console.log("gestione video: ALTRI");
                //return;
            }

            result.cmd.pipe(result.res, { end: true });
        })();
    });

    ///
    appExpress.get('/listHome', (req, res) => {
        (async () => {
            try {
                let fileList = await Utilities.getListForClient();
                res.status(200).send(fileList);
            }
            catch (err) {
                console.log(err);
                res.status(404);
            }
        })();
    });

    ///
    appExpress.post('/listItem', (req, res) => {
        const path = req.body.path;
        (async () => {
            try {
                let fileList = await Utilities.getListForClient(path);
                res.status(200).send(fileList);
            }
            catch (err) {
                console.log(err);
                res.status(404);
            }
        })();
    });

    ///
    appExpress.post('/listBack', (req, res) => {
        const back = async (reqPath) => {
            try {
                let parentPath = (reqPath) ? reqPath.split('/') : [];
                let fileList = [];
                if (parentPath.length > 2) {
                    parentPath.pop();
                    parentPath = parentPath.join('/');
                    fileList = await Utilities.getListForClient(parentPath);
                }
                else {
                    parentPath = reqPath;
                    fileList = await Utilities.getListForClient()
                }
                res.status(200).send({
                    parent: parentPath,
                    list: fileList
                });
            }
            catch (err) {
                console.log(err);
                res.status(404);
            }
        };

        back(req.body.path);
    });

}

module.exports = {
    server_streaming: server_streaming,
};