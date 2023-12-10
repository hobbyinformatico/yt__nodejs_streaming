const Core = require('./Core');


/// Users:
async function list() {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_users
            `
        );
    }
    catch (e) {
        console.log(e);
    }
    return [];
}

/// Users:
async function getById(id) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_users
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

/// Users:
async function getByEmail(email) {
    try {
        return await Core.queryGetAll(
            `SELECT *
                FROM auth_users
                WHERE email = ?
            `,
            [email]
        );
    }
    catch (e) {
        console.log(e);
    }
    return [];
}

/// Users:
async function create(newUser) {
    try {
        return await Core.queryRun(
            `INSERT INTO auth_users(
                password,
                last_login_date,
                is_superuser,
                email,
                first_name,
                last_name,
                active_from,
                active_to,
                is_active,
                created_at
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
            , [
                newUser.password,
                newUser.last_login_date,
                newUser.is_superuser,
                newUser.email,
                newUser.first_name,
                newUser.last_name,
                newUser.active_from,
                newUser.active_to,
                newUser.is_active,
                newUser.created_at
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Users:
async function update(user) {
    try {
        return await Core.queryRun(
            `UPDATE auth_users
                SET
                    email = ?,
                    password = ?,
                    is_superuser = ?,
                    first_name = ?,
                    last_name = ?,
                    active_from = ?,
                    active_to = ?,
                    is_active = ?
                WHERE id = ?
            `
            , [
                user.email,
                user.password,
                user.is_superuser,
                user.first_name,
                user.last_name,
                user.active_from,
                user.active_to,
                user.is_active,
                user.id
            ]
        );
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

/// Users:
async function deleteById(id) {
    try {
        return await Core.queryRun(
            `DELETE FROM auth_users
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

/// Users:
async function updateLogLogin(user_id, last_login_date) {
    try {
        await Core.queryRun(
            `UPDATE auth_users
                SET last_login_date = ?
                WHERE id = ?
            `
            , [
                last_login_date,
                user_id,
            ]
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
    getByEmail: getByEmail,
    create: create,
    update: update,
    deleteById: deleteById,
    updateLogLogin: updateLogLogin,
};