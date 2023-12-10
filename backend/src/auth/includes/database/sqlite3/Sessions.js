const Core = require('./Core');


/// Sessions:
async function getByAccessToken(access_token) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_sessions
                WHERE access_token = ?
            `,
            [access_token]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Sessions:
async function getByRefreshToken(refresh_token) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_sessions
                WHERE refresh_token = ?
            `,
            [refresh_token]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Sessions:
async function getByUserId(application_id, user_id) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_sessions
                WHERE application_id = ?
                    AND user_id = ?
                ORDER BY last_refresh_date ASC,
                    id ASC
            `,
            [application_id, user_id]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Sessions:
async function create(session) {
    try {
        return await Core.queryRun(
            `INSERT INTO auth_sessions(
                application_id,
                application_client_id,
                application_expir_date,
                user_id,
                access_token,
                access_token_expir_date,
                refresh_token,
                refresh_token_expir_date,
                created_at,
                last_refresh_date
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
            , [
                session.application_id,
                session.application_client_id,
                session.application_expir_date,
                session.user_id,
                session.access_token,
                session.access_token_expir_date,
                session.refresh_token,
                session.refresh_token_expir_date,
                session.created_at,
                session.last_refresh_date
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Sessions:
async function update(session) {
    try {
        return await Core.queryRun(
            `UPDATE auth_sessions
                SET
                    application_id = ?,
                    application_client_id = ?,
                    application_expir_date = ?,
                    user_id = ?,
                    access_token = ?,
                    access_token_expir_date = ?,
                    refresh_token = ?,
                    refresh_token_expir_date = ?,
                    created_at = ?,
                    last_refresh_date = ?
                WHERE id = ?
            `
            , [
                session.application_id,
                session.application_client_id,
                session.application_expir_date,
                session.user_id,
                session.access_token,
                session.access_token_expir_date,
                session.refresh_token,
                session.refresh_token_expir_date,
                session.created_at,
                session.last_refresh_date,
                session.id,
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}


module.exports = {
    getByAccessToken: getByAccessToken,
    getByRefreshToken: getByRefreshToken,
    getByUserId: getByUserId,
    create: create,
    update: update,
};