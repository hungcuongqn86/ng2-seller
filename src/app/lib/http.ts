import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptionsArgs, XHRBackend, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {DialogService} from 'ng2-bootstrap-modal';
import {AlertComponent} from '../public/alert.component';
import {aspApiUrl, pspApiUrl, serviceName, serviceRegion, clientId, clientKey} from '../app.config';
import {DsLib} from './lib';
import {Auth} from './auth';


@Injectable()
export class HttpClient extends Http {
    public profile: any;
    private dlauth: any;
    private alertStatus = false;
    private loginStatus = false;
    private initParams = {
        // 'Content-Type': 'application/json',
        // 'X-Date': '',
        'X-Expires': '3600'
    };
    private timeStamp: Date;

    constructor(backend: XHRBackend, options: RequestOptions, private Auth: Auth, private dialogService: DialogService) {
        super(backend, options);
    }

    public get(url: string, options?: RequestOptionsArgs) {
        let queryParams = '';
        if (options && options.search) {
            queryParams = options.search.toString();
        }
        let requestBody = '';
        if (options && options.body) {
            requestBody = options.body;
        }
        const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
            DsLib.getUri(url), 'GET', queryParams, this.getheaderParams(), requestBody, this.timeStamp);
        return this.intercept(super.get(url, this.getRequestOptionArgs(options, signed)));
    }

    public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        let queryParams = '';
        if (options && options.search) {
            queryParams = options.search.toString();
        }
        const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
            DsLib.getUri(url), 'POST', queryParams, this.getheaderParams(), body, this.timeStamp);
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options, signed)));
    }

    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        let queryParams = '';
        if (options && options.search) {
            queryParams = options.search.toString();
        }
        const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
            DsLib.getUri(url), 'PUT', queryParams, this.getheaderParams(), body, this.timeStamp);
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options, signed)));
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        let queryParams = '';
        if (options && options.search) {
            queryParams = options.search.toString();
        }
        let requestBody = '';
        if (options && options.body) {
            requestBody = options.body;
        }
        const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
            DsLib.getUri(url), 'DELETE', queryParams, this.getheaderParams(), requestBody, this.timeStamp);
        return this.intercept(super.delete(url, this.getRequestOptionArgs(options, signed)));
    }

    private getheaderParams() {
        const res: any = {};
        this.timeStamp = new Date();
        this.initParams['X-Date'] = this.Auth.yyyyMMddTHHmmssZ(this.timeStamp);
        let check = false;
        Object.keys(this.initParams).map((index) => {
            const rand = Math.floor((Math.random() * 100) + 1);
            if (rand > 50) {
                check = true;
                res[index] = this.initParams[index];
            }
        });
        if (check) {
            return res;
        } else {
            return '';
        }
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs, signed = ''): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        Object.keys(this.initParams).map((index) => {
            options.headers.append(index, this.initParams[index].trim());
        });
        options.headers.append('X-Authorization', signed);
        return options;
    }

    private intercept(observable: Observable<Response>): Observable<Response> {
        const serv = this;
        return observable.catch((err) => {
            let ms = err._body;
            switch (err.status) {
                case 400:
                    ms = err.json().message;
                    serv.alert(ms);
                    break;
                case 401:
                    // this.authDl('l');
                    break;
                case 500:
                    break;
                default:
                    ms = err._body;
            }
            return Observable.throw(err);
        });
    }

    //  type =  error, success) {
    private alert(alert, type = 'error') {
        if (!this.alertStatus) {
            this.alertStatus = true;
            this.dialogService.addDialog(AlertComponent, {
                alert: alert,
                type: type
            }, {closeByClickingOutside: true}).subscribe(() => {
                this.alertStatus = false;
            });
        }
    }
}
