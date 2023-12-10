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

    ///
    static async applicationsList() {
        const url = `${Env.BASE_URL}/auth/application/list`;
        const res = await RestManager.post(url);
        return res;
    }

    ///
    static async applicationsFormFields() {
        const url = `${Env.BASE_URL}/auth/application/form_fields`;
        const res = await RestManager.post(url);
        if (res.status === RestManager.STATUS_OK) {
            return res;
        }
        return [];
    }

    ///
    static async applicationCreate(data) {
        const url = `${Env.BASE_URL}/auth/application/create`;
        const res = await RestManager.post(url, data);
        return res;
    }

    ///
    static async applicationUpdate(data) {
        const url = `${Env.BASE_URL}/auth/application/update`;
        const res = await RestManager.post(url, data);
        return res;
    }

    ///
    static async applicationDelete(id) {
        const url = `${Env.BASE_URL}/auth/application/delete`;
        const res = await RestManager.post(url, { id: id });
        return res;
    }

    ///
    static async usersList() {
        const url = `${Env.BASE_URL}/auth/user/list`;
        const result = await RestManager.post(url);
        return result;
    }

    ///
    static async usersFormFields() {
        const url = `${Env.BASE_URL}/auth/user/form_fields`;
        const res = await RestManager.post(url);
        if (res.status === RestManager.STATUS_OK) {
            return res;
        }
        return [];
    }

    ///
    static async userCreate(data) {
        const url = `${Env.BASE_URL}/auth/user/create`;
        const result = await RestManager.post(url, data);
        return result;
    }

    ///
    static async userUpdate(data) {
        const url = `${Env.BASE_URL}/auth/user/update`;
        const res = await RestManager.post(url, data);
        return res;
    }

    ///
    static async userDelete(id) {
        const url = `${Env.BASE_URL}/auth/user/delete`;;
        const res = await RestManager.post(url, { id: id });
        return res;
    }
}