import RestManager from '../providers/RestManager';
import Env from '../settings/Env';

export default class Api {

    ///
    static async test_auth_get() {
        const url = `${Env.BASE_URL}/test_auth_get`;
        const res = await RestManager.get(url);
        return res;
    }

    ///
    static async test_auth_post() {
        const url = `${Env.BASE_URL}/test_auth_post`;
        const res = await RestManager.post(url);
        return res;
    }
}