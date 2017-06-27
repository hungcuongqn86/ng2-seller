import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptionsArgs, XHRBackend, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {DialogService} from 'ng2-bootstrap-modal';
import {AlertComponent} from './alert.component';
import {DsLib} from '../lib/lib';

@Injectable()
export class HttpClient extends Http {
    private alertStatus = false;

    constructor(backend: XHRBackend, options: RequestOptions, private dialogService: DialogService) {
        super(backend, options);
    }

    public get(url: string, options?: RequestOptionsArgs) {
        return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    }

    public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('X-Expires', '3600');
        const now = new Date();
        options.headers.append('X-Date', DsLib.getTimeFomat(now));
        options.headers.append('X-Authorization',
            'WSS-HMAC-SHA256 Credential=TEST/20170621/leadsgen/psp/wss-request,SignedHeaders=,' +
            'Signature=b2596934cd3acf0b363ddf91e0a9b702a19063558a21e34ccb44ab9acad16609');
        return options;
    }

    private intercept(observable: Observable<Response>): Observable<Response> {
        const serv = this;
        let alertStatus = true;
        return observable.catch((err) => {
            let ms = err._body;
            switch (err.status) {
                case 400:
                    ms = err.json().message;
                    break;
                case 500:
                    alertStatus = false;
                    break;
                default:
                    ms = err._body;
            }
            if (alertStatus) {
                serv.alert(ms);
            }
            return Observable.throw(err);
        });
    }

    private alert(title) {
        if (!this.alertStatus) {
            this.alertStatus = true;
            this.dialogService.addDialog(AlertComponent, {
                alert: title
            }).subscribe(() => {
                this.alertStatus = false;
            });
        }
    }
}
