import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from './http-client';

@Injectable()
export class AppService {
    private apiUrl = './psp/api/v1/';  // URL to web api

    constructor(private http: HttpClient) {
    }

    getConfig(key) {
        const url = this.apiUrl + 'preferences';
        const params: URLSearchParams = new URLSearchParams();
        params.set('key', key);
        return this.http.get(url, {search: params}).map((res: Response) => res.json().value);
    }
}
