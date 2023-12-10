const Utils = require('../Utilities');
const ActiveDatabase = require('../database/Sqlite3');
const Application = require('../models/Application');



/// --------------------------- Applications ---------------------------
/// Applications: recupera lista applicazioni esistenti
async function applicationList() {
    return await ActiveDatabase.listApplications();
}

/// Applications: recupera applicazione
async function applicationGet({ id = null, client_id = null }) {
    let application = [];
    if (client_id != null) {
        application = await ActiveDatabase.getApplicationByClientId(client_id);
    }
    else if (id != null) {
        application = await ActiveDatabase.getApplicationById(id);
    }

    if (application.length > 0) {
        return application[0];
    }
    return null;
}

/// Applications:verifica validità applicazione
function applicationCheck(application) {
    const validity = Utils.checkRange([application.active_from, application.active_to]);
    return (application.is_active && validity) ? true : false;
}

/// Applications: crea applicazione
async function applicationCreate(client_id, accesstokens_expir_hours, refreshtokens_expir_hours, max_active_sessions, active_from, active_to, is_active) {
    // controlliamo che non esista già un'applicazione con le stesse informazioni chiave
    const application = await applicationGet({ client_id: client_id });
    if (application != null) {
        // l'applicazione esiste già
        return null;
    }

    let newApplication = new Application.model(
        null,
        client_id,
        accesstokens_expir_hours,
        refreshtokens_expir_hours,
        max_active_sessions,
        active_from,
        active_to,
        is_active,
        Utils.today()
    );

    newApplication.id = await ActiveDatabase.applicationCreate(newApplication);
    return newApplication;
}

/// Applications: modifica applicazione
async function applicationUpdate(id, accesstokens_expir_hours, refreshtokens_expir_hours, max_active_sessions, active_from, active_to, is_active) {
    // recuperiamo l'utente da modificare
    const oldApplication = await applicationGet({ id: id });
    if (oldApplication == null) {
        // l'utente NON esiste
        return null;
    }

    let application = new Application.model(
        id,
        oldApplication.client_id, // non modificabile
        accesstokens_expir_hours,
        refreshtokens_expir_hours,
        max_active_sessions,
        active_from,
        active_to,
        is_active,
        oldApplication.created_at // non modificabile
    );
    return await ActiveDatabase.applicationUpdate(application);
}

/// Applications: cancella applicazione
async function applicationDelete(id) {
    // recuperiamo l'utente da cancellare
    const oldApplication = await applicationGet({ id: id });
    return (oldApplication == null) ? null : await ActiveDatabase.applicationDelete(id);
}



module.exports = {
    // Applications
    applicationList: applicationList,
    applicationGet: applicationGet,
    applicationCheck: applicationCheck,
    applicationCreate: applicationCreate,
    applicationUpdate: applicationUpdate,
    applicationDelete: applicationDelete,
};