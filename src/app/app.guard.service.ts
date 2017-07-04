import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {PublicService} from './public/public.service';
import {Router} from '@angular/router';
import {DsLib} from './lib/lib';

@Injectable()
export class AppGuard implements CanActivate {
    constructor(private PublicService: PublicService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot) {
        const step = route.url[0].path;
        let checkRoute = false;
        if (this.PublicService.http.canActive.includes(step)) {
            checkRoute = true;
        }

        // Check session
        let checkLogin = false;
        if (DsLib.checkSession()) {
            checkLogin = true;
        }

        let tooken = '';
        if (DsLib.checkLogin()) {
            tooken = DsLib.getToken().id;
        }
        return this.PublicService.checkAccess(() => this.canAccessScreen(), () => this.pass(), tooken, checkRoute, checkLogin);
    }

    private canAccessScreen() {
        DsLib.removeToken();
        this.router.navigate(['/auth/login']);
    }

    private pass() {
        this.PublicService.http.profile = DsLib.getProfile();
    }
}
