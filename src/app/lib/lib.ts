import {Cookie} from 'ng2-cookies';
import {environment} from '../../environments/environment';
import * as config from '../lib/const';

import {addDays, format} from 'date-fns';

declare const moment: any;

export class DsLib {
  static getToken = () => JSON.parse(atob(Cookie.get(btoa(config.cookie_tokens))));
  static setToken = res => DsLib.setCookie(config.cookie_tokens, JSON.stringify({id: res.id}), res.expire);

  static setCookie(cookieName, cookval, expire_time) {
    const dateString = expire_time,
      reggie = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
      [, year, month, day, hours, minutes, seconds] = reggie.exec(dateString),
      expires = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
    Cookie.set(btoa(cookieName), btoa(cookval), expires, '/');
  }

  static checkLogin = (): boolean => Cookie.check(btoa(config.cookie_tokens));

  static checkSession = (): boolean => (!(!Cookie.check('session_id') || !Cookie.check('user_email')
    || !Cookie.get('user_email') || Cookie.get('user_email') === null || Cookie.get('user_email') === ''));

  static getProfile(): any {
    const tk = Cookie.get('user_email');
    return (tk && tk !== '') ? tk : null;
  }

  static getSession = () => Cookie.get('session_id');
  static removeToken = () => Cookie.delete(btoa(config.cookie_tokens), '/');

  static getUri(url) {
    if (!url) {
      return '';
    }
    const parser = document.createElement('a');
    parser.href = url;
    return parser.pathname.replace(environment.basename, '');
  }

  static getBaseImgUrl = (sFace, base: any) => sFace ? base.image[sFace] : '';

  static getTimeLength(start): Array<any> {
    moment.tz.setDefault('America/New_York');
    const res: Array<any> = [];
    for (const itemtime of config.timeLength) {
      const nday = moment(start, 'YYYYMMDDTHHmmss').add(itemtime - 1, 'day'), item: any = [];
      nday.hour(23);
      nday.minute(0);
      nday.seconds(0);
      item.number = itemtime;
      item.format = nday.format('YYYYMMDDTHHmmss') + 'Z';
      item.view = nday.format('dddd, MMMM Do YYYY, h:mm:ss a z');
      res.push(item);
    }
    return res;
  }

  constructor() {
  }
}
