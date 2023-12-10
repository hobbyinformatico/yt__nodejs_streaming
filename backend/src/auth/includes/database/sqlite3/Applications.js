const Core = require('./Core');


/// Users:
async function list() {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_applications
            `
        );
    }
    catch (e) {
        console.log(e);
    }
    return [];
}

// Applications:
async function getById(id) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_applications
                WHERE id = ?
            `,
            [id]
        );
    }
    catch (e) {
        console.log(e);
    }
    return [];
}

// Applications:
async function getByClientId(client_id) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_applications
                WHERE client_id = ?
            `,
            [client_id]
        );
    }
    catch (e) {
        console.log(e);
    }
    return [];
}

// Applications:
async function create(newApplication) {
    try {
        return await Core.queryRun(
            `INSERT INTO auth_applications(
                client_id,
                accesstokens_expir_hours,
                refreshtokens_expir_hours,
                max_active_sessions,
                active_from,
                active_to,
                is_active,
                created_at
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            `
            , [
                newApplication.client_id,
                newApplication.accesstokens_expir_hours,
                newApplication.refreshtokens_expir_hours,
                newApplication.max_active_sessions,
                newApplication.active_from,
                newApplication.active_to,
                newApplication.is_active,
                newApplication.created_at
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Applications:
async function update(application) {
    try {
        return await Core.queryRun(
            `UPDATE auth_applications
                SET
                    accesstokens_expir_hours = ?,
                    refreshtokens_expir_hours = ?,
                    max_active_sessions = ?,
                    active_from = ?,
                    active_to = ?,
                    is_active = ?
                WHERE id = ?
            `
            , [
                application.accesstokens_expir_hours,
                application.refreshtokens_expir_hours,
                application.max_active_sessions,
                application.active_from,
                application.active_to,
                application.is_active,
                application.id
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Applications:
async function deleteById(id) {
    try {
        return await Core.queryRun(
            `DELETE FROM auth_applications
                WHERE id = ?
            `
            , [id]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}



module.exports = {
    list: list,
    getById: getById,
    getByClientId: getByClientId,
    create: create,
    update: update,
    deleteById: deleteById,
};