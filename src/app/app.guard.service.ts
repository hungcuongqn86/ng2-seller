import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {HttpClient} from './lib/http';
import {DsLib} from './lib/lib';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const step = route.url[0].path, checkRoute = this.http.canActive.includes(step);
    const checkLogin = DsLib.checkSession(), tooken = DsLib.checkLogin() ? DsLib.getToken().id : '';
    return this.http.checkAccess(() => this.canAccessScreen(), () => this.pass(), tooken, checkRoute, checkLogin);
  }

  private canAccessScreen() {
    DsLib.removeToken();
    this.http.router.navigate(['/auth/login']);
  }

  private pass = () => this.http.profile = DsLib.getProfile();
}
