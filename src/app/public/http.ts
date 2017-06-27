import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptionsArgs, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {DialogService} from 'ng2-bootstrap-modal';
import {AlertComponent} from './public/alert.component';
import {DsLib} from './lib/lib';

@Injectable()
export class HttpClient {
    alertStatus = false;

    static getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
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

    constructor(private http: Http, private dialogService: DialogService) {
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

    public get(url: string, options?: RequestOptionsArgs) {
        return this.intercept(this.http.get(url, HttpClient.getRequestOptionArgs(options)));
    }

    public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.post(url, body, HttpClient.getRequestOptionArgs(options)));
    }

    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.put(url, body, HttpClient.getRequestOptionArgs(options)));
    }

    public deletex(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.delete(url, HttpClient.getRequestOptionArgs(options)));
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
}
