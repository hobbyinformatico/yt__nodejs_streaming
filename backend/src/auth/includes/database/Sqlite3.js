const Init = require('./sqlite3/Init');
const Users = require('./sqlite3/Users');
const Applications = require('./sqlite3/Applications');
const Sessions = require('./sqlite3/Sessions');


/// --------------------------- Database ---------------------------
/// Database: inizializza database creando le tabelle mancanti
async function databaseInit() {
    return await Init.databaseInit();
}

/// Database: lista delle tabelle esistenti
async function databaseListTables() {
    return await Init.databaseListTables();
}

/// --------------------------- Users ---------------------------
/// Users: lista utenti
async function listUsers() {
    return await Users.list();
}

/// Users: recupera utente
async function getUserById(id) {
    return await Users.getById(id);
}

/// Users: recupera utente
async function getUserByEmail(email) {
    return await Users.getByEmail(email);
}

/// Users: crea utente
async function userCreate(newUser) {
    return await Users.create(newUser);
}

/// Users: crea utente
async function userUpdate(newUser) {
    return await Users.update(newUser);
}

/// Users: crea utente
async function userDelete(id) {
    return await Users.deleteById(id);
}

/// Users: registra ultima data di login utente
async function userUpdateLogLogin(user_id, last_login_date) {
    return await Users.updateLogLogin(user_id, last_login_date);
}


/// --------------------------- Applications ---------------------------
/// Applications: lista applicazioni
async function listApplications() {
    return await Applications.list();
}

/// Applications: recupera applicazione
async function getApplicationById(id) {
    return await Applications.getById(id);
}

/// Applications: recupera applicazione
async function getApplicationByClientId(client_id) {
    return await Applications.getByClientId(client_id);
}

/// Applications:
async function applicationCreate(newApplication) {
    return await Applications.create(newApplication);
}

/// Applications:
async function applicationUpdate(application) {
    return await Applications.update(application);
}

/// Applications:
async function applicationDelete(id) {
    return await Applications.deleteById(id);
}


/// --------------------------- Sessions ---------------------------
/// Sessions: recupera sessione con access_token
async function getSessionByAccessToken(access_token) {
    return await Sessions.getByAccessToken(access_token);
}

/// Sessions: recupera sessione con refresh_token
async function getSessionByRefreshToken(refresh_token) {
    return await Sessions.getByRefreshToken(refresh_token);
}

/// Sessions: recupera sessione user
async function getSessionsByUserId(application_id, user_id) {
    return await Sessions.getByUserId(application_id, user_id);
}

/// Sessione: crea sessione
async function sessionCreate(newSession) {
    return await Sessions.create(newSession);
}

/// Sessione: aggiorna sessione esistente
async function sessionUpdate(session) {
    return await Sessions.update(session);
}



module.exports = {
    // Database
    databaseInit: databaseInit,
    databaseListTables: databaseListTables,
    // Users
    listUsers: listUsers,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    userCreate: userCreate,
    userUpdate: userUpdate,
    userDelete: userDelete,
    userUpdateLogLogin: userUpdateLogLogin,
    // Applications
    listApplications: listApplications,
    getApplicationById: getApplicationById,
    getApplicationByClientId: getApplicationByClientId,
    applicationCreate: applicationCreate,
    applicationUpdate: applicationUpdate,
    applicationDelete: applicationDelete,
    // Sessions
    getSessionByAccessToken: getSessionByAccessToken,
    getSessionByRefreshToken: getSessionByRefreshToken,
    getSessionsByUserId: getSessionsByUserId,
    sessionCreate: sessionCreate,
    sessionUpdate: sessionUpdate,
};