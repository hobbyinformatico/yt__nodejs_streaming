import Axios from 'axios';
import Env from '../settings/Env';
import RestManager from '../providers/RestManager';


/// Interfaccia per gestire la sessione (recupero e salvataggio sul browser)
export default class SessionManager {

    static URL_LOGIN = `${Env.BASE_URL}/auth/login_admin`;
    static ALL_SESSION = ['user', 'access_token', 'refresh_token'];

    // L'utente ha checkato:
    //  "gc.stayLogged" = true     => salvo i dati su localStorage (non viene cancellata alla chiusura del browser)
    //  "gc.stayLogged" = false    => salvo i dati su sessionStorage (alla chiusura del browser viene rimossa)
    static gc = null;
    static setGc = null;

    // Verifico se presente una sessione con del lavoro in corso.
    // Mi serve per capire se una eventuale richiesta di login potrebbe nascere da:
    //     - primo accesso
    //         - l'utente non aveva lavoro in corso che potrebbe perdere quindi
    //             disegno solo la schermata di login senza disegnare la pagina sotto
    //     - scadenza access_token
    //         - l'utente stava lavorando quindi c'è la probabilità che stesse inserendo
    //             o modificando dati che non vuole perdere o reinserire, quindi gli mostro
    //             la schermata di login obbligatoria ma al login può continuare senza
    //             perdere nulla
    static checkSessionExist() {
        const currentSession = SessionManager.getSession();
        return currentSession.session_exist;
    }

    /// Recupera utente loggato
    static getUser() {
        const currentSession = SessionManager.getSession();
        return currentSession.user;
    }

    /// Una request di "RestManager" è fallita => mi chiede di refreshare la sessione usando l'access_token
    static async tryToRefresh(responseErr, retryRequest) {
        // Accesso non autorizzato => probabile access_token scaduto
        if ((responseErr.request.status === RestManager.STATUS_UNAUTHORIZED)) {
            const result = await SessionManager.refreshSession();
            if (result.status === RestManager.STATUS_OK) {
                // refresh sessione OK => rieseguo la request fallita prima
                try {
                    // rieseguo la richiesta prima fallita (solo un'ultima volta)
                    // usando il nuovo access_token
                    return await retryRequest(result.access_token);
                }
                catch (e) {
                    // ancora errore => sarà scaduto anche il refresh_token
                }
            }
            // sessione non più valida => logout
            SessionManager.logout(false);
        }
        return responseErr;
    }

    /// Login con username e password
    static async login(username, password, stay_logged = true) {
        const options = {
            url: `${Env.BASE_URL}/auth/login`,
            method: 'POST',
            headers: {
                //'Authorization': `Bearer ${state.SessionManager.userToken}`
            },
            data: {
                client_id: 'default',
                username: username, //'admin',
                password: password, //'admin'
            }
        };

        try {
            const result = await Axios(options);
            if (result.status === RestManager.STATUS_OK) {
                const data = result.data.data;
                // login ok
                SessionManager.gc.stayLogged = stay_logged;
                // sessione creata
                SessionManager.setSession({
                    user: data.username.email,
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    session_exist: true
                });
                return {
                    user: data.username,
                    status: RestManager.STATUS_OK
                };
            }
            return {
                user: null,
                status: RestManager.STATUS_PAGE_NOT_FOUND
            };
        }
        catch (resultError) {
            // 503 Service Unavailable
            if (resultError.code === 'ERR_NETWORK') {
                console.log("No connection");
                return { status: RestManager.STATUS_NO_CONNECTION };
            }
            else {
                console.log(resultError);
                return {
                    user: null,
                    status: resultError.response.status
                };
            }
        }
    }

    /// Login con refresh_token
    static async refreshSession() {
        try {
            const currentSession = SessionManager.getSession();
            const refresh_token = currentSession.refresh_token;

            if (refresh_token != null) {
                const options = {
                    url: SessionManager.URL_LOGIN,
                    method: 'POST',
                    headers: {},
                    data: {
                        refresh_token: refresh_token
                    }
                };

                const result = await Axios(options);
                if (result.status === RestManager.STATUS_OK) {
                    const data = result.data.data;
                    SessionManager.setSession({
                        access_token: result.data.data.access_token,
                        refresh_token: result.data.data.refresh_token,
                        session_exist: true
                    });

                    // login ok
                    return {
                        user: data.username,
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                        status: RestManager.STATUS_OK
                    };
                }
                return {
                    user: null,
                    access_token: null,
                    refresh_token: null,
                    status: RestManager.STATUS_PAGE_NOT_FOUND
                };
            }
            return {
                user: null,
                access_token: null,
                refresh_token: null,
                status: RestManager.STATUS_UNAUTHORIZED
            };
        }
        catch (resultError) {
            // 503 Service Unavailable
            if (resultError.code === 'ERR_NETWORK') {
                console.log("No connection");
                return { status: RestManager.STATUS_NO_CONNECTION };
            }
            else {
                console.log(resultError);
                return {
                    user: null,
                    access_token: null,
                    refresh_token: null,
                    status: resultError.response.status
                };
            }
        }
    }

    /// Logout con invalidazione dati di accesso correnti
    static logout(destroy_session = false) {
        SessionManager.removeSession();
        if (destroy_session === true) {
            SessionManager.setSession({ session_exist: false });
        }
        SessionManager.setGc((prevState) => ({
            ...prevState,
            stayLogged: null
        }));
    }

    /// Se presenti carico i valori della vecchia sessione
    static restoreOldSession(gc, setGc) {
        SessionManager.gc = gc;
        SessionManager.setGc = setGc;
        const user = localStorage.getItem('user');
        if (user != null) {
            sessionStorage.setItem('user', user);
            // Esisteva una vecchia sessione => ripristino il flag "stay_logged"
            // (servirà a tenere aggiornata la vecchia sessione)
            SessionManager.setGc((prevState) => ({
                ...prevState,
                stayLogged: true
            }));
            // sessione rigenerata
            sessionStorage.setItem('session_exist', true);
        }

        const access_token = localStorage.getItem('access_token');
        if (access_token != null) {
            sessionStorage.setItem('access_token', access_token);
        }

        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token != null) {
            sessionStorage.setItem('refresh_token', refresh_token);
        }
    }

    ///
    static getSession() {
        let currentSession = {};
        for (const k of SessionManager.ALL_SESSION) {
            currentSession[k] = sessionStorage.getItem(k);
        }
        currentSession['session_exist'] = (sessionStorage.getItem('session_exist') === 'true') ? true : false;
        return currentSession;
    }

    ///
    static setSession({ user = null, access_token = null, refresh_token = null, session_exist = null }) {

        // update sessione
        if (user != null) {
            sessionStorage.setItem('user', user);
            if (SessionManager.gc.stayLogged === true) {
                localStorage.setItem('user', user);
            }
        }
        if (access_token != null) {
            sessionStorage.setItem('access_token', access_token);
            if (SessionManager.gc.stayLogged === true) {
                localStorage.setItem('access_token', access_token);
            }
        }
        if (refresh_token != null) {
            sessionStorage.setItem('refresh_token', refresh_token);
            if (SessionManager.gc.stayLogged === true) {
                localStorage.setItem('refresh_token', refresh_token);
            }
        }
        if (session_exist != null) {
            sessionStorage.setItem('session_exist', session_exist);
        }
    }

    ///
    static removeSession(items = SessionManager.ALL_SESSION) {

        // cancella dati sessione
        for (const i of items) {
            sessionStorage.removeItem(i);
            localStorage.removeItem(i);
        }
    }
}