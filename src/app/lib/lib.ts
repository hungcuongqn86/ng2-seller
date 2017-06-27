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

    static genCampaignDetailUrl(uri: string): string {
        const uricv = uri.split('/').join('');
        return config.campaign_url + uricv;
    }

    static getPrice(ds: any, base: any, config: any): number {
        let res = 0;
        const type = [];
        for (let i = 0; i < ds.length; i++) {
            if (!type.includes(ds[i].type)) {
                type.push(ds[i].type);
            }
        }
        res = Number(base.price);
        if (type.length === 1) {
            res = res + Number(config['product.one.side.printing.price']);
        }
        if (type.length === 2) {
            res = res + Number(config['product.two.sides.printing.price']);
        }
        return res;
    }

    static getServerConfig() {
        return config.serverConfig;
    }

    static getTimeFomat(date: Date): string {
        return format(date, 'YYYYMMDDThhmmss') + 'Z';
    }

    constructor() {
    }

    public getBaseImgUrl(sFace, base: any) {
        return config.imgDir + base + '_' + sFace + '.png';
    }

    public getCampaignId() {
        const cookieName = config.campaignCookie;
        if (Cookie.check(cookieName)) {
            return Cookie.get(cookieName);
        } else {
            return '';
        }
    }

    public removeCampaign() {
        Cookie.delete(config.campaignCookie, '/', config.domail);
    }

    public genColumnColor(colors: Array<any>, moreColors: boolean): Array<any> {
        const countInCol = config.colorInColumn;
        const res: Array<any> = [];
        if (colors.length > countInCol) {
            let arrColor = [];
            let dem = 0;
            for (let i = 0; i < colors.length; i++) {
                arrColor.push(colors[i]);
                if (i === (countInCol - 2)) {
                    arrColor.push('more');
                    res.push(arrColor);
                    arrColor = [];
                    dem = 0;
                    if (!moreColors) {
                        return res;
                    }
                } else {
                    if (dem === (countInCol - 1)) {
                        res.push(arrColor);
                        arrColor = [];
                        dem = 0;
                    } else {
                        dem = dem + 1;
                    }
                }
            }
            res.push(arrColor);
        } else {
            res.push(colors);
        }
        return res;
    }

    public getColorDefault() {
        return config.colorsDefault.white.value;
    }

    public getTimeLength(): Array<any> {
        moment.tz.setDefault('America/New_York');
        const now = moment();
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
}
