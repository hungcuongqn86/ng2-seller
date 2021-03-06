import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DialogService} from 'ng2-bootstrap-modal';
import {AlertComponent} from '../public/alert.component';
import {LoadingComponent} from '../public/loading.component';
import {clientId, clientKey, pspApiUrl, serviceName, serviceRegion} from '../app.config';
import {moduleStart} from './const';
import {DsLib} from './lib';
import {Auth} from './auth';

@Injectable()
export class HttpClient extends Http {
  public canActive = moduleStart;
  public profile: any;
  private dlLoad: any;
  private alertStatus = false;
  private initParams = {
    'Content-Type': 'application/json',
    'X-Date': '',
    'X-Expires': '3600'
  };
  private timeStamp: Date;

  constructor(public router: Router, backend: XHRBackend, options: RequestOptions,
              private Auth: Auth, public dialogService: DialogService) {
    super(backend, options);
  }

  public get (url: string, options?: RequestOptionsArgs) {
    const queryParams = (options && options.search) ? options.search.toString() : '';
    const requestBody = (options && options.body) ? options.body : '';
    const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
      DsLib.getUri(url), 'GET', queryParams, this.getheaderParams(), requestBody, this.timeStamp);
    return this.intercept(super.get(url, this.getRequestOptionArgs(options, signed)));
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    const queryParams = (options && options.search) ? options.search.toString() : '';
    const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
      DsLib.getUri(url), 'POST', queryParams, this.getheaderParams(), body, this.timeStamp);
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options, signed)));
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    const queryParams = (options && options.search) ? options.search.toString() : '';
    const signed = this.Auth.createAuthorization(serviceName, serviceRegion, clientId, clientKey,
      DsLib.getUri(url), 'PUT', queryParams, this.getheaderParams(), body, this.timeStamp);
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options, signed)));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    const queryParams = (options && options.search) ? options.search.toString() : '';
    const requestBody = (options && options.body) ? options.body : '';
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
      if (rand > 200) {
        check = true;
        res[index] = this.initParams[index];
      }
    });
    return check ? res : '';
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
          this.logout();
          break;
        case 500:
          ms = err.json().message;
          serv.alert(ms);
          break;
        default:
          serv.alert(ms);
      }
      return Observable.throw(err);
    });
  }

  public alert(alert, type = 'error') {
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

  public startLoad(title = 'Loading...') {
    if (this.dlLoad) {
      return false;
    }
    this.dlLoad = this.dialogService.addDialog(LoadingComponent, {
      status: title
    }).subscribe(() => {
    });
  }

  public endLoad() {
    if (this.dlLoad) {
      this.dlLoad.unsubscribe();
      this.dlLoad = null;
    }
  }

  public logout() {
    this.startLoad();
    this.profile = null;
    DsLib.removeToken();
    this.removeSession();
  }

  private removeSession() {
    const ss = DsLib.getSession();
    this._removeSession(ss).subscribe(
      () => {
        this.endLoad();
        this.router.navigate(['/auth/login']);
      },
      error => {
        this.endLoad();
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  private _removeSession(id) {
    const url = pspApiUrl + `sessions/${id}`;
    return this.delete(url).map((res: Response) => res.json());
  }

  public checkAccess(fallback: any, passback: any, tk: string, checkRoute, checkLogin) {
    if (checkRoute) {
      if (checkLogin) {
        passback();
        return Observable.of(true);
      } else {
        if (tk !== '') {
          const url = pspApiUrl + `sessions`;
          const body = JSON.stringify({token: tk});
          return this.post(url, body)
            .map((res: Response) => {
              passback();
              return true;
            }).catch(() => {
              fallback();
              return Observable.of(false);
            });
        } else {
          fallback();
          return Observable.of(false);
        }
      }
    } else {
      fallback();
      return Observable.of(false);
    }
  }
}
