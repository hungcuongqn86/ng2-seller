import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import {HttpClient} from '../../lib/http';
import {pspApiUrl} from '../../app.config';

@Injectable()
export class CampaignsService {
    private module = 'campaigns';
    public campaign: any;
    public arrBaseTypes: any = [];

    constructor(public http: HttpClient) {
    }

    public getCampaigns(sparams) {
        const url = pspApiUrl + this.module;
        const params: URLSearchParams = new URLSearchParams();
        Object.keys(sparams).map((key) => {
            params.set(key, sparams[key]);
        });
        return this.http.get(url, {search: params}).map((res: Response) => res.json());
    }

    public getCampaign(id) {
        const url = pspApiUrl + this.module + `/${id}`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    public getDomains(): any {
        const url = pspApiUrl + `domains`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    public getCategories(visible) {
        const url = pspApiUrl + `categories`;
        const params: URLSearchParams = new URLSearchParams();
        params.set('visible', visible);
        return this.http.get(url, {search: params}).map((res: Response) => res.json());
    }

    public updateCampaign(campaign: any) {
        const url = pspApiUrl + this.module + `/${campaign.id}`;
        const body = JSON.stringify(campaign);
        return this.http.put(url, body).map((res: Response) => res.json());
    }

    public getBaseTypes(): any {
        const url = pspApiUrl + `base_groups`;
        return this.http.get(url).map((res: Response) => res.json().base_groups);
    }
}
