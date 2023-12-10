import RestManager from '../providers/RestManager';
import Env from '../settings/Env';
import axios from "axios";


export default class Api {

    /// ----------------- Streaming -----------------
    ///

    static buildVideoUrl(videoSubPath) {
        return `${Env.BASE_URL}/video/${videoSubPath}#t=00:00:00,01:00:00`;
    }

    static async getListVideos() {
        const response = await axios.get(`${Env.BASE_URL}/listAllVideos/`);
        return response.data;
    }

    static async getListHome() {
        const response = await axios.get(`${Env.BASE_URL}/listHome/`);
        return response.data;
    }

    static async getListItem(item) {
        const body = {
            path: item
        };
        const response = await axios.post(`${Env.BASE_URL}/listItem/`, body);
        return response.data;
    }

    static async getListBack(item) {
        const body = {
            path: item
        };
        const response = await axios.post(`${Env.BASE_URL}/listBack/`, body);
        return response.data;
    }
}