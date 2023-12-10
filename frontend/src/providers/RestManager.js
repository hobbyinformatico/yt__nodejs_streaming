import Axios from 'axios';
import SessionManager from './SessionManager';


/// Interfaccia per gestire le chiamate autenticate generiche
/// con refresh automatico dei token scaduti, usando
/// "SessionManager.tryToRefresh()"
export default class RestManager {

    static STATUS_OK = 200;
    static STATUS_BAD_REQUEST = 400;
    static STATUS_UNAUTHORIZED = 401;
    static STATUS_PAGE_NOT_FOUND = 404;
    // 503 Service Unavailable
    static STATUS_NO_CONNECTION = 503;


    /// GET generica autenticata
    static async get(url) {
        // recupera i dati di sessione
        const currentSession = SessionManager.getSession();
        let options = {
            url: url,
            method: 'GET',
            headers: { 'Authorization': currentSession.access_token }
        };

        try {
            const res = await Axios(options);
            return res;
        }
        catch (responseErr) {
            // 503 Service Unavailable
            if (responseErr.code === 'ERR_NETWORK') {
                console.log("No connection");
                return { status: RestManager.STATUS_NO_CONNECTION };
            }
            else if (responseErr.request.status === RestManager.STATUS_UNAUTHORIZED) {
                // Forse è fallita perchè l'access_token è scaduto
                const res = await SessionManager.tryToRefresh(
                    responseErr,
                    async (access_token) => {
                        // l'access_token è stato rigenerato, lo
                        // sostituisco a quello non più valido
                        options.headers['Authorization'] = access_token;
                        return await Axios(options);
                    }
                );
                return res;
            }
            return responseErr;
        }
    }

    /// POST generica autenticata
    static async post(url, data = {}) {
        // recupera i dati di sessione
        const currentSession = SessionManager.getSession();
        let options = {
            url: url,
            method: 'POST',
            headers: { 'Authorization': currentSession.access_token },
            data: data
        };

        try {
            const res = await Axios(options);
            return res;
        }
        catch (responseErr) {
            // 503 Service Unavailable
            if (responseErr.code === 'ERR_NETWORK') {
                console.log("No connection");
                return { status: RestManager.STATUS_NO_CONNECTION };
            }
            else if (responseErr.request.status === RestManager.STATUS_UNAUTHORIZED) {
                // Forse è fallita perchè l'access_token è scaduto
                const res = await SessionManager.tryToRefresh(
                    responseErr,
                    async (access_token) => {
                        // l'access_token è stato rigenerato, lo
                        // sostituisco a quello non più valido
                        options.headers['Authorization'] = access_token;
                        return await Axios(options);
                    }
                );
                return res;
            }
            return responseErr;
        }
    }
}
