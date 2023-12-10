const moment = require('moment');
const crypto = require('crypto');
//const jwt = require('jsonwebtoken');
const Settings = require('./Settings');


/// --------------------------- Utilities date ---------------------------
/// Controlla che il range di date contenga TODAY
function checkRange(arrayRange) {
    const date = today();
    return (arrayRange[0] <= date && arrayRange[1] >= date);
}

/// Recupera data TODAY (formato 'YYYY-MM-DD HH:mm:ss')
function today() {
    return (new Date()).toISOString().slice(0, 19).replace('T', ' ');
}

/// Calcola la data di scadenza futura TODAY + hours (formato 'YYYY-MM-DD HH:mm:ss')
function calculateExpirationDate(hours) {
    return todayAddHours(hours);
}

/// Calcola la data TODAY + hours (formato 'YYYY-MM-DD HH:mm:ss')
function todayAddHours(hours) {
    const today = moment();
    const newDate = today.add(hours, 'hours');
    return newDate.format('YYYY-MM-DD HH:mm:ss');
}

/// Calcola la data TODAY - hours (formato 'YYYY-MM-DD HH:mm:ss')
function todaySubHours(hours) {
    const today = moment();
    const newDate = today.subtract(hours, 'hours');
    return newDate.format('YYYY-MM-DD HH:mm:ss');
}

/*
/// Trasforma una stringa in datetime
function dateTimeFromString(dataString) {
    //const dataString = "2023-10-09 15:30:00"; // Sostituisci questa stringa con la tua data

    // Divide la stringa in parti per ottenere l'anno, il mese, il giorno, l'ora, i minuti e i secondi
    const parts = dataString.split(/[- :]/);

    // Nota: Month in JavaScript è 0-based, quindi sottrai 1 dal mese
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const hours = parseInt(parts[3], 10);
    const minutes = parseInt(parts[4], 10);
    const seconds = parseInt(parts[5], 10);

    // Crea l'oggetto Date
    const data = new Date(year, month, day, hours, minutes, seconds);
    const datetime = data.toISOString().slice(0, 19).replace('T', ' ');
    return datetime;
}
*/


/// --------------------------- Utilities hashing ---------------------------
/// Funzione di hash (usata per generare hash di password e tokens)
async function _hash(contentToHash, settings, saltBufferToUse = null) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(settings.saltLength, (err, salt) => {
            if (err) {
                reject(err);
                return;
            }

            const saltBuffer = (saltBufferToUse != null) ? saltBufferToUse : salt.toString('hex');

            crypto.pbkdf2(
                contentToHash,
                saltBuffer,
                settings.iterations,
                settings.keyLength,
                settings.hash,
                (err, key) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve({
                        saltBuffer: saltBuffer,
                        hash: key.toString('hex'),
                    });
                });
        });
    });
}

/// Funzione per generare l'hash della password
async function generatePasswordHash(password) {

    const contentToHash = password;
    const settings = Settings.hashSettings().password;

    // Qui il SALT è calcolato randomicamente ogni volta, ma dovrà essere
    // registrato a DB altrimenti sarà impossibile rigenerare il token per
    // confrontarlo con quello esistente e validarlo
    const result = await _hash(contentToHash, settings);

    // generazione password user
    return `${settings.algorithm}_${settings.hash}$${settings.iterations}$${result.saltBuffer}$${result.hash}`;
}

/// Funzione per creare un token con dati al suo interno
async function generateToken(optionalContent = "") {

    const contentToHash = `${optionalContent}${Date.now().toString()}`;
    const settings = Settings.hashSettings().token;
    const result = await _hash(contentToHash, settings);

    // generazione token (access_token o refresh_token)
    return result.hash;
}


/// Verifica confrontando password utente fornita dal client con quella nel database
async function userCheckPassword(dbHashedPassword, userPassword) {

    const contentToHash = userPassword;
    const hashedPswSlices = dbHashedPassword.split('$');
    const prefixSlices = hashedPswSlices[0].split('_');
    let settings = Settings.hashSettings().password;

    settings.iterations = parseInt(hashedPswSlices[1]);
    settings.algorithm = prefixSlices[0];
    settings.hash = prefixSlices[1];
    const saltBufferToUse = hashedPswSlices[2];
    const dbPswHashed = hashedPswSlices[3];

    const result = await _hash(contentToHash, settings, saltBufferToUse);

    // esito confronto
    return (result.hash == dbPswHashed);
}

async function randomValueForPayloadToken() {
    return await _hash(
        Date.now().toString(),
        Settings.hashSettings().randomKey
    );
}

function checkKeys(keys, obj) {
    const keysFound = Object.keys(obj);
    for (let k of keys) {
        if (!keysFound.includes(k)) {
            return false;
        }
    }
    return true;
}



module.exports = {
    // Utilities date
    checkRange: checkRange,
    today: today,
    calculateExpirationDate: calculateExpirationDate,
    todayAddHours: todayAddHours,
    todaySubHours: todaySubHours,
    // Utilities hashing
    generatePasswordHash: generatePasswordHash,
    generateToken: generateToken,
    userCheckPassword: userCheckPassword,
    // Utilities varie
    checkKeys: checkKeys,
};