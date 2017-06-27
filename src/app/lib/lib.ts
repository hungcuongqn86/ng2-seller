import {Cookie} from 'ng2-cookies';
import * as config from '../lib/const';

import {
    addDays,
    format
} from 'date-fns';

declare const moment: any;

export class DsLib {
    static getToken(): any {
        const cookieName = btoa(config.cookie_tokens);
        const tk = Cookie.get(cookieName);
        return JSON.parse(atob(tk));
    }

    static setToken(res: any) {
        const cookval = JSON.stringify({
            id: res.id,
            user_id: '1LkvNVzwJFMJXr2Q'
            // user_id: res.user_id
        });
        const cookieName = btoa(config.cookie_tokens);

        const dateString = res.expire,
            reggie = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
            [, year, month, day, hours, minutes, seconds] = reggie.exec(dateString);
        const expires = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
        Cookie.set(cookieName, btoa(cookval), expires, '/');
    }

    static checkLogin(): boolean {
        return Cookie.check(btoa(config.cookie_tokens));
    }

    static checkSession(): boolean {
        return Cookie.check(btoa(config.cookie_session));
    }

    static removeToken() {
        const cookieName = btoa(config.cookie_tokens);
        Cookie.delete(cookieName, '/');
    }

    static getServerConfig() {
        return config.serverConfig;
    }

    static getTimeFomat(date: Date): string {
        return format(date, 'YYYYMMDDThhmmss') + 'Z';
    }

    constructor() {
    }
}
