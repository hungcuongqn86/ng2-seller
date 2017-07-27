import {Cookie} from 'ng2-cookies';
import {environment} from '../../environments/environment';
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
            id: res.id
        });
        DsLib.setCookie(config.cookie_tokens, cookval, res.expire);
    }

    static setCookie(cookieName, cookval, expire_time) {
        const dateString = expire_time,
            reggie = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
            [, year, month, day, hours, minutes, seconds] = reggie.exec(dateString);
        const expires = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
        Cookie.set(btoa(cookieName), btoa(cookval), expires, '/');
    }

    static checkLogin(): boolean {
        return Cookie.check(btoa(config.cookie_tokens));
    }

    static checkSession(): boolean {
        if (!Cookie.check('session_id') || !Cookie.check('user_email') || !Cookie.get('user_email') || Cookie.get('user_email') === null
            || Cookie.get('user_email') === '') {
            return false;
        }
        return true;
    }

    static getProfile(): any {
        const tk = Cookie.get('user_email');
        if (tk && tk !== '') {
            return tk;
        } else {
            return null;
        }
    }

    static getSession() {
        return Cookie.get('session_id');
    }

    static removeToken() {
        const cookieName = btoa(config.cookie_tokens);
        Cookie.delete(cookieName, '/');
    }

    static getUri(url) {
        if (!url) {
            return '';
        }
        const parser = document.createElement('a');
        parser.href = url;
        return parser.pathname.replace(environment.basename, '');
    }

    static getBaseImgUrl(sFace, base: any) {
        if (sFace) {
            return base.image[sFace];
        } else {
            return '';
        }
    }

    static getTimeLength(): Array<any> {
        moment.tz.setDefault('America/New_York');
        const res: Array<any> = [];
        const timeLength = config.timeLength;
        for (let i = 0; i < timeLength.length; i++) {
            const day = moment().add(timeLength[i] - 1, 'day');
            day.hour(23);
            day.minute(0);
            day.seconds(0);
            const item: any = [];
            item.number = timeLength[i];
            item.view = moment.tz(day, moment.tz.guess()).format('dddd, MMMM Do YYYY, h:mm:ss a z');
            res.push(item);
        }
        return res;
    }

    constructor() {
    }
}
