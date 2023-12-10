const fsp = require('fs').promises;
const path = require('path');
//const StreamGenerate = require('./StreamGenerate');
const SETTINGS = require('../SETTINGS');
//const ModuleThumbnails = require('./ModuleThumbnails');

async function scan(realPath, clientDir = null, lambda, rootDir = null, outputList = [], firstInstance = true) {
    /*
        - scan ricorsivo dalla root fino alla cartelle voluta dal client
    */
    if (!rootDir) {
        rootDir = realPath;
        //maskedPath = path.join(id, l)
    }

    if (clientDir) {
        const idStr = clientDir.split('/')[0];
        const id = parseInt(idStr)
        realPath = clientDir.replace(new RegExp(idStr), SETTINGS.pathSources[id]);
    }
    const list = await fsp.readdir(realPath);

    for (let l of list) {
        const newRealPath = path.join(realPath, l);

        //let id = (clientDir) ? parseInt(clientDir.split('/')[0]) : SETTINGS.pathSources.indexOf(rootDir);
        const id = SETTINGS.pathSources.indexOf(rootDir);
        const maskedPath = newRealPath.replace(new RegExp(rootDir), id.toString());

        const stat = await fsp.stat(newRealPath);

        if (stat.isFile()) {
            const name = l.split('.');
            const ext = name.pop();
            if (SETTINGS.TYPE_FILES_TO_GET.includes(ext.toLowerCase())) {
                const thumbnail = (SETTINGS.enableThumbnails) ? await ModuleThumbnails.getAnteprima(newRealPath) : "";
                outputList.push(lambda(name, ext, true, maskedPath, thumbnail));
            }
        }
        else if (stat.isDirectory()) {
            // serve solo il primo livello
            outputList.push(lambda(l, "", false, maskedPath));
        }
    }
    if (firstInstance) {
        // unico return (quello della prima chiamata non annidata)
        return outputList.filter((o) => o != null);
    }
}

async function getListForClient(clientDir = null) {
    let list = [];
    try {
        let paths = SETTINGS.pathSources;
        if (clientDir) {
            const id = parseInt(clientDir.split('/')[0]);
            paths = [paths[id]];
        }

        for (let p of paths) {
            list.push(...
                await scan(p, clientDir, (name, ext, isFile, maskedPath, thumbnail) => {
                    return {
                        title: (isFile) ? name.join('.') : name,
                        ext: (isFile) ? ext : "",
                        src: maskedPath,
                        isFile: isFile,
                        thumbnail: thumbnail
                    };
                })
            );
        }
    }
    catch (err) {
        console.log(err);
    }
    return list;
}

function getRealPath(clientPath) {
    const idStr = clientPath.split('/')[0];
    const id = parseInt(idStr)
    return clientPath.replace(new RegExp(idStr), SETTINGS.pathSources[id]);
}

module.exports = {
    getListForClient: getListForClient,
    getRealPath: getRealPath
};