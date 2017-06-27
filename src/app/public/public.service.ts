import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from './http';
import {Observable} from 'rxjs/Rx';
import {DialogService} from 'ng2-bootstrap-modal';
import {LoadingComponent} from './loading.component';
import * as config from '../app.config';
import * as constDf from '../lib/const';

@Injectable()
export class PublicService {
    public canActive = constDf.moduleStart;
    private pspApiUrl = config.pspApiUrl;
    private aspApiUrl = config.aspApiUrl;
    private loadingStatus = false;
    private dlLoad: any;

    constructor(private http: HttpClient, private dialogService: DialogService) {

    }

    public checkAccess(fallback: any, tk: string, checkRoute) {
        if (checkRoute) {
            const url = this.pspApiUrl + `sessions`;
            const body = JSON.stringify({token: tk});
            return this.http.post(url, body)
                .map((res: Response) => {
                    return true;
                }).catch(() => {
                    fallback();
                    return Observable.of(false);
                });
        } else {
            return Observable.of(false);
        }
    }

    getConfig(key) {
        const url = this.pspApiUrl + 'preferences';
        const params: URLSearchParams = new URLSearchParams();
        params.set('key', key);
        return this.http.get(url, {search: params}).map((res: Response) => res.json().value);
    }

    public startLoad(title = 'Loading...') {
        if (this.loadingStatus) {
            return false;
        }
        this.loadingStatus = true;
        this.dlLoad = this.dialogService.addDialog(LoadingComponent, {
            status: title
        });
    }

    public endLoad() {
        this.dlLoad.unsubscribe();
        this.loadingStatus = false;
    }
}
