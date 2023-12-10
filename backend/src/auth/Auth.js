const ApiAuth = require('./includes/api/auth');
const ApiApplication = require('./includes/api/application');
const ApiUser = require('./includes/api/user');
const Application = require('./includes/models/Application');
const User = require('./includes/models/User');
const Utils = require('./includes/Utilities');


/// --------------------------- Auth ---------------------------
/// Init: se il database non esiste lo crea con le configurazioni di default
async function checkInit() {
    return await ApiAuth._checkInit();
}

/// Operazioni di: login, gestione applications e gestione users
async function manager(req_params, req_headers, req_body) {

    // es. req_params = "/admin/user/form_fields"
    const params = req_params[0].split('/');
    if (params.length < 1) {
        return resp__bad_request();
    }

    const resp_default = (data = null, msg = "Error", status = 400) => {
        return {
            status: status,
            data: data,
            msg: msg
        };
    };
    const resp__ok = (data, msg = "OK") => resp_default(data, msg, 200);
    const resp__bad_request = (msg = "Error: bad request") => resp_default(null, msg, 400);
    const resp__unauthorized = (msg = "Error: unauthorized") => resp_default(null, msg, 401);

    const filterInfoUser = (user) => {
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_superuser: user.is_superuser,
            created_at: user.created_at
        }
    }

    let resp = null;

    switch (params[0]) {
        // "init"
        // await _init();

        // --- chiamate usabili SENZA autenticazione ---
        case "login":
            if (params.length != 1) {
                // errore
                return resp__bad_request();
            }
            if (Utils.checkKeys(["client_id", "username", "password"], req_body)) {
                resp = await ApiAuth._loginWithEmail(
                    req_body["client_id"],
                    req_body["username"],
                    req_body["password"],
                    false
                );
                return (resp == null) ? resp__unauthorized() : resp__ok({
                    username: filterInfoUser(resp.user),
                    access_token: resp.session.access_token,
                    refresh_token: resp.session.refresh_token,
                });
            }
            else if (Utils.checkKeys(["refresh_token"], req_body)) {
                resp = await ApiAuth._loginWithRefreshToken(
                    req_body["refresh_token"],
                    false
                );
                return (resp == null) ? resp__unauthorized() : resp__ok({
                    username: null,
                    access_token: resp.session.access_token,
                    refresh_token: resp.session.refresh_token,
                });
            }
            return resp__bad_request();

        case "login_admin":
            if (params.length != 1) {
                // errore
                return resp__bad_request();
            }
            if (Utils.checkKeys(["client_id", "username", "password"], req_body)) {
                resp = await ApiAuth._loginWithEmail(
                    req_body["client_id"],
                    req_body["username"],
                    req_body["password"],
                    true
                );
                return (resp == null) ? resp__unauthorized() : resp__ok({
                    username: filterInfoUser(resp.user),
                    access_token: resp.session.access_token,
                    refresh_token: resp.session.refresh_token,
                });
            }
            else if (Utils.checkKeys(["refresh_token"], req_body)) {
                resp = await ApiAuth._loginWithRefreshToken(
                    req_body["refresh_token"],
                    true
                );
                return (resp == null) ? resp__unauthorized() : resp__ok({
                    username: null,
                    access_token: resp.session.access_token,
                    refresh_token: resp.session.refresh_token,
                });
            }
            return resp__bad_request();

        // --- chiamate usabili CON autenticazione ---
        case "application":
            if (params.length != 2) {
                // errore
                return resp__bad_request();
            }
            // check autorizzazione
            if ((await authorized(req_headers["authorization"], true)) == null) {
                // errore
                return resp__unauthorized();
            }
            // operazioni
            switch (params[1]) {
                case "list":
                    return resp__ok(await ApiApplication.applicationList());

                case "form_fields":
                    return resp__ok(Application.form);

                case "create":
                    resp = await ApiApplication.applicationCreate(
                        req_body.client_id,
                        req_body.accesstokens_expir_hours,
                        req_body.refreshtokens_expir_hours,
                        req_body.max_active_sessions,
                        req_body.active_from,
                        req_body.active_to,
                        req_body.is_active,
                    );
                    return (resp == null) ? resp__bad_request() : resp__ok(resp);

                case "update":
                    if (Utils.checkKeys(["id"], req_body)) {
                        resp = await ApiApplication.applicationUpdate(
                            req_body.id,
                            req_body.accesstokens_expir_hours,
                            req_body.refreshtokens_expir_hours,
                            req_body.max_active_sessions,
                            req_body.active_from,
                            req_body.active_to,
                            req_body.is_active,
                        );
                        return (resp == null) ? resp__bad_request() : resp__ok(resp);
                    }
                    return resp__bad_request();

                case "delete":
                    if (Utils.checkKeys(["id"], req_body)) {
                        resp = await ApiApplication.applicationDelete(req_body.id);
                        return (resp == null) ? resp__bad_request() : resp__ok(resp);
                    }
                    return resp__bad_request();
            }

        case "user":
            if (params.length != 2) {
                // errore
                return resp__bad_request();
            }
            // check autorizzazione
            if ((await authorized(req_headers["authorization"], true)) == null) {
                // errore
                return resp__unauthorized();
            }
            // operazioni
            switch (params[1]) {
                case "list":
                    const userList = await ApiUser.userList();
                    // al client non comunico la password hashata ma solo un *
                    for (const u of userList) {
                        u.password = '*';
                    }
                    return resp__ok(userList);

                case "form_fields":
                    return resp__ok(User.form);

                case "create":
                    resp = await ApiUser.userCreate(
                        req_body.email,
                        req_body.password,
                        req_body.is_superuser,
                        req_body.first_name,
                        req_body.last_name,
                        req_body.active_from,
                        req_body.active_to,
                        req_body.is_active
                    );
                    return (resp == null) ? resp__bad_request() : resp__ok(filterInfoUser(resp));

                case "update":
                    if (Utils.checkKeys(["id"], req_body)) {
                        resp = await ApiUser.userUpdate(
                            req_body.id,
                            (req_body.password == '*') ? null : req_body.password,
                            req_body.is_superuser,
                            req_body.first_name,
                            req_body.last_name,
                            req_body.active_from,
                            req_body.active_to,
                            req_body.is_active
                        );
                        return (resp == null) ? resp__bad_request() : resp__ok(resp);
                    }
                    return resp__bad_request();

                case "delete":
                    if (Utils.checkKeys(["id"], req_body)) {
                        resp = await ApiUser.userDelete(req_body.id);
                        return (resp == null) ? resp__bad_request() : resp__ok(resp);
                    }
                    return resp__bad_request();
            }

        default:
            return resp__bad_request();
    }
}


/// Check autorizzazione esecuzione richiesta con access_token
async function authorized(access_token_value, loginAdmin = false) {
    return await ApiAuth._isAuthorized(access_token_value, loginAdmin);
}


module.exports = {
    checkInit: checkInit,
    manager: manager,
    authorized: authorized,
};