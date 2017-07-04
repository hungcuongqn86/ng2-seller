import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../lib/http';
import {Observable} from 'rxjs/Rx';
import {DialogService} from 'ng2-bootstrap-modal';
import {LoadingComponent} from './loading.component';
import * as config from '../app.config';
import * as constDf from '../lib/const';

@Injectable()
export class PublicService {
    public canActive = constDf.moduleStart;
    private loadingStatus = false;
    private dlLoad: any;

    constructor(public http: HttpClient, private dialogService: DialogService) {

    }

    public checkAccess(fallback: any, passback: any, tk: string, checkRoute, checkLogin) {
        if (checkRoute) {
            if (checkLogin) {
                passback();
                return Observable.of(true);
            } else {
                const url = config.pspApiUrl + `sessions`;
                const body = JSON.stringify({token: tk});
                return this.http.post(url, body)
                    .map((res: Response) => {
                        passback();
                        return true;
                    }).catch(() => {
                        fallback();
                        return Observable.of(false);
                    });
            }
        } else {
            return Observable.of(false);
        }
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
