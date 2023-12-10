const Utils = require('../Utilities');
const ActiveDatabase = require('../database/Sqlite3');
const User = require('../models/User');



/// --------------------------- Users ---------------------------
/// Users: lista utenti
async function userList() {
    return await ActiveDatabase.listUsers();
}

/// Users: recupera utente
async function userGet({ id = null, email = null }) {
    let user = [];
    if (email != null) {
        user = await ActiveDatabase.getUserByEmail(email);
    }
    else if (id != null) {
        user = await ActiveDatabase.getUserById(id);
    }

    if (user.length > 0) {
        return user[0];
    }
    return null;
}

/// Users: verifica validità utente
function userCheck(user) {
    const validity = Utils.checkRange([user.active_from, user.active_to]);
    return (user.is_active && validity) ? true : false;
}

/// Users: crea utente
async function userCreate(email, password, is_superuser, first_name, last_name, active_from, active_to, is_active) {
    // controlliamo che non esista già un utente con la stessa email
    const user = await userGet({ email: email });
    if (user != null) {
        // l'utente esiste già
        return null;
    }

    let newUser = new User.model(
        null,
        await Utils.generatePasswordHash(password),
        null,
        is_superuser,
        email,
        first_name,
        last_name,
        active_from,
        active_to,
        is_active,
        Utils.today()
    );

    newUser.id = await ActiveDatabase.userCreate(newUser);
    return newUser;
}

/// Users: modifica utente
async function userUpdate(id, password, is_superuser, first_name, last_name, active_from, active_to, is_active) {
    // recuperiamo l'utente da modificare
    const oldUser = await userGet({ id: id });
    if (oldUser == null) {
        // l'utente NON esiste
        return null;
    }

    let user = new User.model(
        id,
        (password == null) ? oldUser.password : await Utils.generatePasswordHash(password),
        oldUser.last_login_date, // non modificabile
        is_superuser,
        oldUser.email, // non modificabile
        first_name,
        last_name,
        active_from,
        active_to,
        is_active,
        oldUser.created_at // non modificabile
    );
    return await ActiveDatabase.userUpdate(user);
}

/// Users: cancella utente
async function userDelete(id) {
    // recuperiamo l'utente da cancellare
    const oldUser = await userGet({ id: id });
    return (oldUser == null) ? null : await ActiveDatabase.userDelete(id);
}



module.exports = {
    // Users
    userList: userList,
    userGet: userGet,
    userCheck: userCheck,
    userCreate: userCreate,
    userUpdate: userUpdate,
    userDelete: userDelete,
};