/// Funzione per generare l'hash della password
function hashSettings() {
    return {
        password: {
            saltLength: 6, // Lunghezza del salt in byte
            keyLength: 22, // Lunghezza della chiave derivata in byte
            iterations: 150000, // Numero di iterazioni
            algorithm: 'pbkdf2', // Algoritmo
            hash: 'sha512' // funzione di hashing
        },
        token: {
            saltLength: 6,
            keyLength: 15, // genera poi una stringa hash di 30
            iterations: 100,
            algorithm: 'pbkdf2',
            hash: 'sha512'
        },
        randomKey: {
            saltLength: 4,
            keyLength: 2, // genera poi una stringa hash di 4
            iterations: 5,
            algorithm: 'pbkdf2',
            hash: 'sha512'
        }
    };
    /*
        pbkdf2_sha256$150000$jKoxfNNVOuV5$3KLGBv5Ybb3K6u4heUMaK9H2Kfw41JJ4kymI+7xEa7o=
        pbkdf2_sha512$150000$e1277d039711$234895cc1495fd179906b1ab63cc8dc03b3f3421a8c9
    */
}

module.exports = {
    hashSettings: hashSettings,
};