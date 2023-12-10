const Core = require('./Core');


/*
    Esempio di query su SQLITE3 (con chiave unica "id + email")

        `CREATE TABLE IF NOT EXISTS auth_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            password TEXT(78) NOT NULL,
            last_login_date DATETIME,
            is_superuser BOOLEAN NOT NULL,
            days INTEGER CHECK (days >= 0 AND days <= 9999),
            email  TEXT(255) PRIMARY KEY,
            key_to_mytable INTEGER,
            FOREIGN KEY (key_to_mytable) REFERENCES Mytable(id)
            UNIQUE (id, email)
        )`
*/

/*
    Esempio di query su POSTGRESS (con chiave unica "id + email")

        `CREATE TABLE IF NOT EXISTS auth_users (
            id SERIAL PRIMARY KEY,
            password CHAR(78) NOT NULL,
            last_login_date TIMESTAMPTZ,
            is_superuser BOOLEAN NOT NULL,
            days INTEGER CHECK (days >= 0 AND days <= 9999),
            email VARCHAR(255) UNIQUE,
            key_to_mytable INTEGER,
            FOREIGN KEY (key_to_mytable) REFERENCES mytable(id)
        )`
*/

/// Inizializza database creando le tabelle mancanti
async function databaseInit() {
    try {
        /*
            "Applicazione" identificata da "client_id" con settaggi e scadenze per
            creare o rigenerare token di accesso a scadenza auth_applications 
            (oauth2_provider_application)
        */
        await Core.queryRun(
            `CREATE TABLE IF NOT EXISTS auth_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id TEXT(30) UNIQUE NOT NULL,
                accesstokens_expir_hours INTEGER NOT NULL,
                refreshtokens_expir_hours INTEGER NOT NULL,
                max_active_sessions INTEGER NOT NULL,
                active_from DATETIME NOT NULL,
                active_to DATETIME NOT NULL,
                is_active BOOLEAN NOT NULL,
                created_at DATETIME NOT NULL
            )`
        );

        /*
            Gli utenti che vengono condivisi da tutte le "Applicazioni\client_id" 
            auth_users (<app>_user)
        */
        await Core.queryRun(
            `CREATE TABLE IF NOT EXISTS auth_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                password TEXT(78) NOT NULL,
                last_login_date DATETIME,
                is_superuser BOOLEAN NOT NULL,
                email TEXT(255) UNIQUE,
                first_name TEXT(35) NOT NULL,
                last_name TEXT(35) NOT NULL,
                active_from DATETIME NOT NULL,
                active_to DATETIME NOT NULL,
                is_active BOOLEAN NOT NULL,
                created_at DATETIME NOT NULL
            )`
        );

        // Tabella delle sessioni attive con i realtivi tokens
        await Core.queryRun(
            `CREATE TABLE IF NOT EXISTS auth_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_id INTEGER NOT NULL,
                application_client_id TEXT(30) NOT NULL,
                application_expir_date  DATETIME NOT NULL,
                user_id INTEGER NOT NULL,
                access_token TEXT(34) NOT NULL,
                access_token_expir_date DATETIME NOT NULL,
                refresh_token TEXT(34) NOT NULL,
                refresh_token_expir_date DATETIME NOT NULL,
                created_at DATETIME NOT NULL,
                last_refresh_date DATETIME NOT NULL,
                FOREIGN KEY (application_id) REFERENCES auth_applications(id),
                FOREIGN KEY (user_id) REFERENCES auth_users(id)
            )`
        );
        return true;

    } catch (e) {
        console.log(e);
    }
    return false;
}

/// Lista delle tabelle esistenti
async function databaseListTables() {
    try {
        return await Core.queryGetAll(
            `SELECT name
                FROM sqlite_master
                WHERE type='table';
                `
        );
    } catch (e) {
        console.log(e);
    }
    return [];
}



module.exports = {
    databaseInit: databaseInit,
    databaseListTables: databaseListTables,
};