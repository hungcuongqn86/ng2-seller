import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';
import {pspApiUrl} from '../../app.config';

@Injectable()
export class CampaignsService {
    private module = 'campaigns';

    constructor(private http: HttpClient) {
    }

    public getCampaigns(key) {
        const url = pspApiUrl + this.module;
        const params: URLSearchParams = new URLSearchParams();
        params.set('state', key);
        return this.http.get(url, {search: params}).map((res: Response) => res.json());
    }
}
