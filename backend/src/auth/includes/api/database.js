const Utils = require('../Utilities');
const ActiveDatabase = require('../database/Sqlite3');
const ApiApplication = require('./application');
const ApiUser = require('./user');


/// --------------------------- Database ---------------------------
/// Database: inizializza database creando le tabelle mancanti
async function databaseInit() {
    const esito_init = await ActiveDatabase.databaseInit();
    if (esito_init) {
        const list_users = await ActiveDatabase.listUsers();
        if (list_users.length > 0) {
            // esistono già utenti, non creo l'utente admin di default
            return null;
        }

        const defaultClientId = "default";

        // creazione applicazione di default
        await ApiApplication.applicationCreate(
            defaultClientId,
            1, //accesstokens_expir_hours,
            2, //refreshtokens_expir_hours,
            2, //max_active_sessions,
            Utils.todaySubHours(1), //active_from,
            Utils.todayAddHours(365), //active_to,
            true //is_active
        );


        const username = "admin";
        const password = "admin";

        // creazione utenza admin di default (admin, admin)
        const defaultAdmin = await ApiUser.userCreate(
            username, //email,
            password, //password,
            true, //is_superuser,
            "admin", //first_name,
            "admin", //last_name,
            Utils.todaySubHours(1), //active_from,
            Utils.todayAddHours(365), //active_to,
            true //is_active
        );

        if (defaultAdmin != null) {
            return {
                client_id: defaultClientId,
                username: defaultAdmin.email,
                password: password,
                active_to: defaultAdmin.active_to,
            };
        }
    }

    return null;
}

/// Database: lista delle tabelle esistenti
async function databaseListTables() {
    return await ActiveDatabase.databaseListTables();
}


module.exports = {
    // Database
    databaseInit: databaseInit,
    databaseListTables: databaseListTables,
};