const Utils = require('../Utilities');
const ActiveDatabase = require('../database/Sqlite3');
const Session = require('../models/Session');



/// --------------------------- Sessions ---------------------------
/// Sessions:
async function getSessionByToken({ access_token = null, refresh_token = null }) {
    let session = [];

    if (access_token != null) {
        session = await ActiveDatabase.getSessionByAccessToken(access_token);
    }
    else if (refresh_token != null) {
        session = await ActiveDatabase.getSessionByRefreshToken(refresh_token);
    }
    else {
        return null;
    }

    if (session.length > 0) {
        return session[0];
    }
    return null;
}

/// Sessions:
function sessionCheck(session, { access_token = null, refresh_token = null }) {
    const TODAY = Utils.today();
    if (session.application_expir_date <= TODAY) {
        return false;
    }
    if (refresh_token != null && session.refresh_token == refresh_token) {
        // check data scadenza
        if (session.refresh_token_expir_date > TODAY) {
            return true;
        }
    }
    else if (access_token != null && session.access_token == access_token) {
        // check data scadenza
        if (session.access_token_expir_date > TODAY) {
            return true;
        }
    }
    return false;
}

/// Sessions: login utente (con email e password oppure con refresh_token)
async function sessionLogin(application, user_id, oldSession = null) {

    // -------- Login con REFRESH_TOKEN --------
    // Esiste una sessione valida (non scaduta) per refresh_token a cui dobbiamo rigenerare access_token
    if (oldSession != null) {
        console.log("Aggiorno sessione: " + oldSession.id);
        return await _sessionUpdate(application, user_id, oldSession);
    }

    // -------- Login con EMAIL e PASSWORD --------
    let sessions = null;

    // Per questa application c'è un limite massimo di sessioni attive per uno stesso user?
    if (application.max_active_sessions > 0) {
        // Cerchiamo le sessioni attive per quella application e user
        sessions = await ActiveDatabase.getSessionsByUserId(application.id, user_id);
        if (sessions.length > 0) {
            console.log("Sessioni attive: " + sessions.length + " su max: " + application.max_active_sessions);

            // Abbiamo raggiunto il numero massimo di sessioni attive?
            if (sessions.length >= application.max_active_sessions) {

                // Si, identifichiamo il record da aggiornare
                const rowsExpired = sessions.filter((r) => { r.last_refresh_date < Utils.today() });
                if (rowsExpired.length > 0) {
                    // primo record più vecchio e scaduto
                    sessions = rowsExpired[0];
                }
                else {
                    // primo record più vecchio
                    sessions = sessions[0];
                }
            }
            else {
                // Il numero massimo di sessioni attive non è stato ancora raggiunto, posso ancora crearne
                sessions = null;
            }
        }
        else {
            // Non esistono altre sessioni attive, è il primo login di
            // quell'utente (con EMAIL e PASSWORD) con quel client_id
            sessions = null;
        }
    }

    // Creiamo la nuova sessione
    if (sessions == null) {
        // Creiamo a db un nuovo record
        console.log("Creo sessione");
        sessions = await _sessionCreate(application, user_id);
        // registra data di login utente
        await ActiveDatabase.userUpdateLogLogin(user_id, Utils.today());
    }
    else {
        // Modifichiamo a db un record già esistente
        console.log("Aggiorno sessione: " + sessions.id);
        sessions = await _sessionUpdate(application, user_id, sessions, true);
        // registra data di login utente
        await ActiveDatabase.userUpdateLogLogin(user_id, Utils.today());
    }

    return sessions;
}

/// Sessions:
async function _sessionCreate(application, user_id, oldRefreshToken = null) {

    let newSession = new Session.model(
        null,
        application.id,
        application.client_id,
        application.active_to,
        user_id,
        await Utils.generateToken(),
        Utils.calculateExpirationDate(application.accesstokens_expir_hours),
        (oldRefreshToken != null) ? oldRefreshToken : await Utils.generateToken(),
        Utils.calculateExpirationDate(application.refreshtokens_expir_hours),
        Utils.today(),
        Utils.today(),
    );
    // creazione iniziale con stack id
    newSession.id = await ActiveDatabase.sessionCreate(newSession);

    return newSession;
}

/// Sessions:
async function _sessionUpdate(application, user_id, oldSessions, destroyAndCreateNewSessionRecord = false) {
    // Se destroyAndCreateNewSessionRecord = true:
    //  - il record verrà rimpiazzato (come fosse un nuovo inserimento\nuova sessione)
    //      - serve solo per riutilizzare un record ormai inutile

    const TODAY = Utils.today();

    // Rigenero access_token
    let session = new Session.model(
        oldSessions.id,
        application.id,
        application.client_id,
        application.active_to,
        user_id,
        await Utils.generateToken(),
        Utils.calculateExpirationDate(application.accesstokens_expir_hours),
        /*
        (destroyAndCreateNewSessionRecord == false) ?
            oldSessions.refresh_token : await Utils.generateToken(application.accesstokens_expir_hours.toString()),
        */
        /*
            Quando generiamo un nuovo access_token:
                - rigeneriamo anche il refresh_token
                - la sessione è valida fin quando access_token e refresh_token non scadono
                - per motivi di sicurezza vogliamo che periodicamente la sessione scada,
                    così l'utente sarà obbligato a rieseguire login con user e password
                    quindi rigeneriamo la data di scadenza dell'access_token MA NON quella
                    del refresh_token che coinciderà con la scadenza della sessione
                    - in questo modo evitiamo che refreshando periodicamente i tokens si possa
                        estendere la durata della sessione all'infinito impedendole di scadere
        */
        await Utils.generateToken(application.accesstokens_expir_hours.toString()),
        (destroyAndCreateNewSessionRecord == false) ?
            oldSessions.refresh_token_expir_date : Utils.calculateExpirationDate(application.refreshtokens_expir_hours),
        (destroyAndCreateNewSessionRecord == false) ? oldSessions.created_at : TODAY,
        // last_refresh_date cambia ogni volta che si genera un nuovo access_token
        TODAY,
    );
    await ActiveDatabase.sessionUpdate(session);

    return session;
}


module.exports = {
    // Sessions
    getSessionByToken: getSessionByToken,
    sessionCheck: sessionCheck,
    sessionLogin: sessionLogin,
};