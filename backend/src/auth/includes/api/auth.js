const fs = require('fs');
const Utils = require('../Utilities');
const ApiApplication = require('./application');
const ApiUser = require('./user');
const ApiSession = require('./session');
const ApiDatabase = require('./database');



/// --------------------------- Utils auth ---------------------------
/// Init: se il database non esiste lo crea con le configurazioni di default
async function _checkInit() {
    // controllo che esista il file del database "auth.db"
    const database = 'auth.db';
    if (!fs.existsSync(database)) {
        console.log(`Database non trovato, procedo alla creazione e configurazione: ${database}`);
        return await ApiDatabase.databaseInit();
    }
    return null;
}

/// Login da email
async function _loginWithEmail(client_id, email, password, loginAdmin) {

    // --------- Check application ---------
    const application = await ApiApplication.applicationGet({ client_id: client_id });
    if (application == null || !ApiApplication.applicationCheck(application)) {
        return null;
    }
    console.log("Recuperata application: " + application.id);

    // --------- Check user ---------
    const user = await ApiUser.userGet({ email: email });
    if (user == null || !ApiUser.userCheck(user)) {
        return null;
    }
    // --------- Check superuser ---------
    // se richiesto, verifico permessi da superutente
    if (loginAdmin == true && user.is_superuser != true) {
        return null;
    }
    // verifica correttezza password
    if (!(await Utils.userCheckPassword(user.password, password))) {
        console.log("la password inserita non è corretta: " + password);
        return null;
    }
    console.log("Recuperato user: " + user.id);

    // --------- Crea o aggiorna sessione (generando i tokens) ---------
    const newSession = await ApiSession.sessionLogin(application, user.id)
    if (newSession == null) {
        console.log("Errore nel generare la nuova sessione");
        return null;
    }
    console.log("Sessione ATTIVA: " + newSession.id);

    return {
        application: application,
        session: newSession,
        user: user
    };
}

/// Login da refresh_token e creazione nuovo access_token
async function _loginWithRefreshToken(refresh_token_value, loginAdmin) {

    // --------- Check vecchia sessione ---------
    const oldSession = await ApiSession.getSessionByToken({ refresh_token: refresh_token_value });
    if (oldSession == null || !ApiSession.sessionCheck(oldSession, { refresh_token: refresh_token_value })) {
        console.log("Sessione non trovata o scaduta");
        return null;
    }

    // --------- Check superuser ---------
    // se richiesto, verifico permessi da superutente
    if (loginAdmin == true) {
        const user = await ApiUser.userGet({ id: oldSession.user_id });
        if (user == null || !ApiUser.userCheck(user)) {
            return null;
        }
        if (user.is_superuser != true) {
            return null;
        }
    }

    // --------- Check application ---------
    const application = await ApiApplication.applicationGet({ id: oldSession.application_id });
    if (application == null || !ApiApplication.applicationCheck(application)) {
        return null;
    }
    console.log("Recuperata application: " + application.id);

    // --------- Crea o aggiorna sessione (generando i tokens) ---------
    const newSession = await ApiSession.sessionLogin(application, oldSession.user_id, oldSession)
    if (newSession == null) {
        console.log("Errore nel generare la nuova sessione");
        return null;
    }
    console.log("Sessione ATTIVA: " + newSession.id);

    return {
        application: application,
        session: newSession
    };
}

/// Check autorizzazione esecuzione richiesta con access_token
async function _isAuthorized(access_token_value, loginAdmin) {

    // --------- Check sessione ---------
    const session = await ApiSession.getSessionByToken({ access_token: access_token_value });
    if (session == null || !ApiSession.sessionCheck(session, { access_token: access_token_value })) {
        console.log("Sessione non trovata o scaduta");
        return null;
    }

    // --------- Check user ---------
    const user = await ApiUser.userGet({ id: session.user_id });
    if (user == null || !ApiUser.userCheck(user)) {
        return null;
    }
    // se richiesto, verifico permessi da superutente
    if (loginAdmin == true && user.is_superuser != true) {
        return null;
    }

    /*
    // --------- Check application ---------
    const application = await ApiApplication.applicationGet({ id: session.application_id });
    if (application == null || !ApiApplication.applicationCheck(application)) {
        return null;
    }
    console.log("Recuperata application: " + application.id);
    */
    console.log("Token autorizzato");

    // info autorizzato
    return {
        client_id: session.application_client_id,
        user: user
    };
}



module.exports = {
    // Utils auth
    _checkInit: _checkInit,
    _loginWithEmail: _loginWithEmail,
    _loginWithRefreshToken: _loginWithRefreshToken,
    _isAuthorized: _isAuthorized,
};