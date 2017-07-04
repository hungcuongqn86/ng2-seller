import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../lib/http';
import {Observable} from 'rxjs/Rx';
import * as config from '../app.config';

@Injectable()
export class PublicService {
    constructor(public http: HttpClient) {

    }

    public removeSession(id) {
        const url = config.pspApiUrl + `sessions/${id}`;
        return this.http.delete(url).map((res: Response) => res.json());
    }

    public getConfig(key) {
        const url = config.pspApiUrl + 'preferences';
        const params: URLSearchParams = new URLSearchParams();
        params.set('key', key);
        return this.http.get(url, {search: params}).map((res: Response) => res.json().value);
    }
}
